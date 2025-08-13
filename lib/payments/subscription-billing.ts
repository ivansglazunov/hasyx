import { NextRequest, NextResponse } from 'next/server';
import { Hasyx } from '../hasyx/hasyx';
import { createApolloClient } from '../apollo/apollo';
import { Generator } from '../generator';
import schema from '../../public/hasura-schema.json';
import { TBankPaymentProcessor } from './tbank';
import Debug from '../debug';

const debug = Debug('api:subscription-billing');

interface Subscription {
  id: string;
  user_id: string;
  method_id: string;
  provider_id: string;
  plan_id: string;
  status: string;
  external_subscription_id: string;
  billing_retry_count: number;
  max_billing_retries: number;
  billing_anchor_date: number;
  computed_next_billing_date: number | null;
  computed_last_billing_date: number | null;
  computed_missed_cycles: number;
  plan: { id: string; name: string; price: number; currency: string; interval: string; interval_count: number; };
  method: { id: string; type: string; is_recurrent_ready: boolean; recurrent_details: any; status: string; };
  provider: { id: string; type: string; config: any; is_test_mode: boolean; };
}

function calculateNextBillingDate(interval: string, intervalCount: number, fromDate: number): number {
  const date = new Date(fromDate);
  switch (interval) {
    case 'minute': date.setMinutes(date.getMinutes() + intervalCount); break;
    case 'hour': date.setHours(date.getHours() + intervalCount); break;
    case 'day': date.setDate(date.getDate() + intervalCount); break;
    case 'week': date.setDate(date.getDate() + (intervalCount * 7)); break;
    case 'month': date.setMonth(date.getMonth() + intervalCount); break;
    case 'year': date.setFullYear(date.getFullYear() + intervalCount); break;
    default: throw new Error(`Unsupported interval: ${interval}`);
  }
  return date.getTime();
}

export async function handleSubscriptionBilling(request: NextRequest) {
  try {
    const eventSecret = request.headers.get('X-Hasura-Event-Secret');
    if (eventSecret !== process.env.HASURA_EVENT_SECRET) {
      debug('Invalid event secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    debug('Starting subscription billing cron job');

    const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    const hasyx = new Hasyx(apolloClient, Generator(schema as any));

    await hasyx.debug({ event: 'subscription_billing_cron_start', timestamp: new Date().toISOString(), message: 'Starting subscription billing cron job with computed fields' });

    const now = Date.now();
    const allActiveSubscriptions = await hasyx.select<Subscription[]>({
      table: 'payments_subscriptions',
      where: { status: { _eq: 'active' }, billing_retry_count: { _lt: { _column: 'max_billing_retries' } } },
      returning: [
        'id','user_id','method_id','provider_id','plan_id','status','external_subscription_id','billing_retry_count','max_billing_retries','billing_anchor_date','computed_next_billing_date','computed_last_billing_date','computed_missed_cycles',
        { plan: ['id','name','price','currency','interval','interval_count'] },
        { method: ['id','type','is_recurrent_ready','recurrent_details','status'] },
        { provider: ['id','type','config','is_test_mode'] }
      ]
    });

    const dueSubscriptions = allActiveSubscriptions?.filter(sub => sub.computed_next_billing_date && sub.computed_next_billing_date <= now) || [];
    debug(`Found ${dueSubscriptions.length} subscriptions due for billing (from ${allActiveSubscriptions?.length || 0} active)`);
    await hasyx.debug({ event: 'subscription_billing_found_due', count: dueSubscriptions.length, total_active: allActiveSubscriptions?.length || 0, timestamp: new Date().toISOString() });

    if (dueSubscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions due for billing', processed: 0 });
    }

    let processedCount = 0; let successCount = 0; let failureCount = 0;
    for (const subscription of dueSubscriptions) {
      try {
        processedCount++;
        await hasyx.debug({ event: 'subscription_billing_processing', subscription_id: subscription.id, user_id: subscription.user_id, plan_name: subscription.plan.name, amount: subscription.plan.price, computed_next_billing_date: subscription.computed_next_billing_date ? new Date(subscription.computed_next_billing_date).toISOString() : null, computed_last_billing_date: subscription.computed_last_billing_date ? new Date(subscription.computed_last_billing_date).toISOString() : null, computed_missed_cycles: subscription.computed_missed_cycles, retry_count: subscription.billing_retry_count });

        if (!subscription.method.is_recurrent_ready || subscription.method.status !== 'active') {
          throw new Error(`Payment method ${subscription.method_id} is not ready for recurrent payments`);
        }

        const cyclesToCharge = Math.max(1, subscription.computed_missed_cycles || 1);
        const totalAmount = subscription.plan.price * cyclesToCharge;
        await hasyx.debug({ event: 'subscription_billing_calculation', subscription_id: subscription.id, computed_missed_cycles: subscription.computed_missed_cycles, cycles_to_charge: cyclesToCharge, unit_amount: subscription.plan.price, total_amount: totalAmount });

        if (subscription.provider.type === 'tbank') {
          const processor = new TBankPaymentProcessor({ providerDBConfig: subscription.provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
          const orderId = `sub_${subscription.id}_${Date.now()}`;
          const chargeResult = await processor.chargeRecurrent({ rebillId: subscription.external_subscription_id, orderId, amount: totalAmount, description: `${subscription.plan.name} - ${cyclesToCharge} billing cycle(s)`, customerKey: subscription.method.recurrent_details?.customerKey });
          if ((chargeResult as any).Success) {
            await hasyx.insert({ table: 'payments_operations', object: { user_id: subscription.user_id, method_id: subscription.method_id, provider_id: subscription.provider_id, subscription_id: subscription.id, external_operation_id: (chargeResult as any).PaymentId, amount: totalAmount, currency: subscription.plan.currency, status: 'succeeded', description: `${subscription.plan.name} - automatic billing`, provider_request_details: { rebillId: subscription.external_subscription_id, orderId, amount: totalAmount, cycles: cyclesToCharge }, provider_response_details: chargeResult, paid_at: now } });
            await hasyx.update({ table: 'payments_subscriptions', pk_columns: { id: subscription.id }, _set: { billing_retry_count: 0, current_period_start: now, current_period_end: calculateNextBillingDate(subscription.plan.interval, subscription.plan.interval_count, now) } });
            successCount++;
            await hasyx.debug({ event: 'subscription_billing_success', subscription_id: subscription.id, operation_id: (chargeResult as any).PaymentId, amount: totalAmount, cycles_charged: cyclesToCharge, message: 'Payment successful - next billing date will be computed from this operation' });
          } else {
            throw new Error((chargeResult as any).Message || 'TBank charge failed');
          }
        } else if (subscription.provider.type === 'vtb') {
          const { VtbPaymentProcessor } = await import('./vtb');
          const vtb = new VtbPaymentProcessor({ providerDBConfig: subscription.provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
          const orderId = `sub_${subscription.id}_${Date.now()}`;
          const bindingId = (subscription.method.recurrent_details?.bindingId || subscription.method.recurrent_details?.binding_id) as string | undefined;
          if (!bindingId) throw new Error('VTB bindingId is missing for recurrent charge');
          const chargeResult: any = await vtb.chargeRecurrent({ bindingId, orderId, amount: totalAmount, description: `${subscription.plan.name} - ${cyclesToCharge} billing cycle(s)` });
          if (chargeResult.errorCode === '0') {
            await hasyx.insert({ table: 'payments_operations', object: { user_id: subscription.user_id, method_id: subscription.method_id, provider_id: subscription.provider_id, subscription_id: subscription.id, external_operation_id: chargeResult.orderId, amount: totalAmount, currency: subscription.plan.currency, status: 'succeeded', description: `${subscription.plan.name} - automatic billing`, provider_request_details: { bindingId, orderId, amount: totalAmount, cycles: cyclesToCharge }, provider_response_details: chargeResult, paid_at: now } });
            await hasyx.update({ table: 'payments_subscriptions', pk_columns: { id: subscription.id }, _set: { billing_retry_count: 0, current_period_start: now, current_period_end: calculateNextBillingDate(subscription.plan.interval, subscription.plan.interval_count, now) } });
            successCount++;
            await hasyx.debug({ event: 'subscription_billing_success', subscription_id: subscription.id, operation_id: chargeResult.orderId, amount: totalAmount, cycles_charged: cyclesToCharge, message: 'VTB payment successful' });
          } else {
            throw new Error(chargeResult.errorMessage || `VTB charge failed: code ${chargeResult.errorCode}`);
          }
        } else {
          throw new Error(`Unsupported provider type: ${subscription.provider.type}`);
        }

      } catch (error: any) {
        failureCount++;
        await hasyx.debug({ event: 'subscription_billing_error', subscription_id: subscription.id, error: error.message, retry_count: subscription.billing_retry_count + 1, max_retries: subscription.max_billing_retries });
        const newRetryCount = subscription.billing_retry_count + 1;
        if (newRetryCount >= subscription.max_billing_retries) {
          await hasyx.update({ table: 'payments_subscriptions', pk_columns: { id: subscription.id }, _set: { status: 'past_due', billing_retry_count: newRetryCount } });
          await hasyx.debug({ event: 'subscription_billing_max_retries_reached', subscription_id: subscription.id, new_status: 'past_due' });
        } else {
          await hasyx.update({ table: 'payments_subscriptions', pk_columns: { id: subscription.id }, _set: { billing_retry_count: newRetryCount } });
        }
        await hasyx.insert({ table: 'payments_operations', object: { user_id: subscription.user_id, method_id: subscription.method_id, provider_id: subscription.provider_id, subscription_id: subscription.id, amount: subscription.plan.price, currency: subscription.plan.currency, status: 'failed', description: `${subscription.plan.name} - automatic billing (failed)`, error_message: error.message, initiated_at: now } });
      }
    }

    await hasyx.debug({ event: 'subscription_billing_cron_complete', timestamp: new Date().toISOString(), processed: processedCount, successful: successCount, failed: failureCount, message: 'Billing completed using computed fields approach' });
    debug(`Subscription billing completed: ${successCount} successful, ${failureCount} failed`);
    return NextResponse.json({ success: true, message: 'Subscription billing completed', processed: processedCount, successful: successCount, failed: failureCount });
  } catch (error: any) {
    debug('Subscription billing cron error:', error);
    try {
      const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET!, });
      const hasyx = new Hasyx(apolloClient, Generator(schema as any));
      await hasyx.debug({ event: 'subscription_billing_cron_error', timestamp: new Date().toISOString(), error: error.message, stack: error.stack });
    } catch (debugError) {
      debug('Failed to log error to debug table:', debugError as any);
    }
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}


