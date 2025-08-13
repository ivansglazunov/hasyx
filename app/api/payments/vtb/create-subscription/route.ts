import { NextRequest, NextResponse } from 'next/server';
import { Hasyx } from '@/lib/hasyx/hasyx';
import { createApolloClient } from '@/lib/apollo/apollo';
import { Generator } from 'hasyx/lib/generator';
import schema from '../../../../../public/hasura-schema.json';
import { VtbPaymentProcessor } from 'hasyx/lib/payments/vtb';
import { getServerSession } from 'next-auth';
import authOptions from 'hasyx/lib/next-auth-options';

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan_id, method_id } = await request.json();
    if (!plan_id || !method_id) return NextResponse.json({ error: 'Missing required fields: plan_id, method_id' }, { status: 400 });

    const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, token: session.accessToken || undefined });
    const hasyx = new Hasyx(apolloClient, Generator(schema));
    hasyx.user = session.user;

    const plans = await hasyx.select({ table: 'payments_plans', where: { id: { _eq: plan_id }, active: { _eq: true } }, returning: ['id','name','price','currency','interval','interval_count','trial_period_days'], role: 'user' });
    if (!plans || plans.length === 0) return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    const plan = plans[0];

    const methods = await hasyx.select({ table: 'payments_methods', where: { id: { _eq: method_id }, status: { _eq: 'active' }, is_recurrent_ready: { _eq: true } }, returning: [ 'id','provider_id','external_id','type','details','recurrent_details', { provider: ['id','type','config','is_test_mode'] } ], role: 'user' });
    if (!methods || methods.length === 0) return NextResponse.json({ error: 'Payment method not found, not active, or not ready for recurrent payments' }, { status: 404 });
    const method = methods[0];
    if (method.provider.type !== 'vtb') return NextResponse.json({ error: 'Unsupported provider type' }, { status: 400 });

    const existingSubscriptions = await hasyx.select({ table: 'payments_subscriptions', where: { plan_id: { _eq: plan_id }, status: { _in: ['active','trialing'] } }, returning: ['id'], role: 'user' });
    if (existingSubscriptions && existingSubscriptions.length > 0) return NextResponse.json({ error: 'You already have an active subscription for this plan' }, { status: 400 });

    const now = Date.now();
    const trialEnd = plan.trial_period_days > 0 ? now + (plan.trial_period_days * 24 * 60 * 60 * 1000) : now;
    const firstBillingDate = calculateNextBillingDate(plan.interval, plan.interval_count, trialEnd);

    const processor = new VtbPaymentProcessor({ providerDBConfig: method.provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });

    let needsInitialPayment = plan.trial_period_days === 0;
    let initResult: any | null = null;
    if (needsInitialPayment) {
      initResult = await processor.initiatePayment({
        paymentId: `sub_init_${Date.now()}`,
        amount: plan.price,
        currency: plan.currency,
        description: `${plan.name} - Initial subscription payment`,
        userId: session.user.id,
        objectHid: `plan_${plan_id}`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hasyx/payments?tab=subscriptions&action=subscription-created`,
        metadata: { isRecurrent: true, customerKey: method.recurrent_details?.clientId }
      });
      if (initResult.status === 'failed' || initResult.status === 'error') return NextResponse.json({ error: initResult.errorMessage || 'Failed to initiate subscription payment' }, { status: 400 });
    }

    const subscription = await hasyx.insert({
      table: 'payments_subscriptions',
      object: {
        method_id: method_id,
        provider_id: method.provider_id,
        plan_id: plan_id,
        status: plan.trial_period_days > 0 ? 'trialing' : 'pending_confirmation',
        external_subscription_id: null,
        current_period_start: now,
        current_period_end: firstBillingDate,
        next_billing_date: firstBillingDate,
        billing_anchor_date: now,
        billing_retry_count: 0,
        max_billing_retries: 3,
        metadata: { plan_name: plan.name, initial_payment_required: needsInitialPayment }
      },
      returning: ['id'],
      role: 'user'
    });

    const subscriptionId = subscription.id;
    if (needsInitialPayment && initResult) {
      await hasyx.insert({ table: 'payments_operations', object: { user_id: session.user.id, method_id: method_id, provider_id: method.provider_id, subscription_id: subscriptionId, external_operation_id: initResult.externalPaymentId, amount: plan.price, currency: plan.currency, status: 'pending_user_action', description: `${plan.name} - Initial subscription payment`, provider_request_details: { paymentId: initResult.paymentId, amount: plan.price, isInitialSubscriptionPayment: true }, initiated_at: now }, role: 'user' });
      return NextResponse.json({ success: true, subscription_id: subscriptionId, redirect_url: initResult.redirectUrl, message: 'Please complete the initial payment to activate your subscription' });
    }

    return NextResponse.json({ success: true, subscription_id: subscriptionId, message: plan.trial_period_days > 0 ? `Subscription created with ${plan.trial_period_days} day trial period` : 'Subscription created' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}
