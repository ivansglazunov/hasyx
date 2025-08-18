import { NextRequest, NextResponse } from 'next/server';
import { Hasura } from '../../hasura/hasura';
import { TBankPaymentProcessor } from '../tbank';
import { Hasyx } from '../../hasyx/hasyx';
import { createApolloClient } from '../../apollo/apollo';
import { Generator } from '../../generator';
import schema from '../../../public/hasura-schema.json';
import { getServerSession } from 'next-auth';
import authOptions from '../../../app/options';
import Debug from '../../debug';

const debug = Debug('payments:tbank:api');

export async function handleTbankInitPayment(request: NextRequest) {
  try {
    const { operation_id, provider_id } = await request.json();
    if (!operation_id || !provider_id) return NextResponse.json({ error: 'Missing operation_id or provider_id' }, { status: 400 });

    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    const operationQuery = `query GetOperation($id: uuid!) { payments_operations(where: { id: { _eq: $id } }) { id amount currency description user_id } }`;
    const operationResult = await hasura.client.post('/v1/graphql', { query: operationQuery, variables: { id: operation_id } });
    const operation = operationResult.data?.data?.payments_operations?.[0];
    if (!operation) return NextResponse.json({ error: 'Payment operation not found' }, { status: 404 });

    const providerQuery = `query GetProvider($id: uuid!) { payments_providers(where: { id: { _eq: $id } }) { id name type config is_test_mode } }`;
    const providerResult = await hasura.client.post('/v1/graphql', { query: providerQuery, variables: { id: provider_id } });
    const provider = providerResult.data?.data?.payments_providers?.[0];
    if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    if (provider.type !== 'tbank') return NextResponse.json({ error: 'Provider is not TBank' }, { status: 400 });

    const tbank = new TBankPaymentProcessor({ providerDBConfig: provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const paymentResult = await tbank.initiatePayment({ paymentId: operation.id, amount: operation.amount, currency: operation.currency, description: operation.description || 'Payment', objectHid: operation.id, userId: operation.user_id });
    if ((paymentResult as any).errorMessage) {
      const updateFailedMutation = `mutation UpdateOperation($id: uuid!, $data: payments_operations_set_input!) { update_payments_operations(where: { id: { _eq: $id } }, _set: $data) { affected_rows } }`;
      await hasura.client.post('/v1/graphql', { query: updateFailedMutation, variables: { id: operation_id, data: { status: 'failed', error_message: (paymentResult as any).errorMessage, provider_response_details: (paymentResult as any).providerResponse, updated_at: Date.now() } } });
      return NextResponse.json({ error: (paymentResult as any).errorMessage }, { status: 400 });
    }

    const updateSuccessMutation = `mutation UpdateOperation($id: uuid!, $data: payments_operations_set_input!) { update_payments_operations(where: { id: { _eq: $id } }, _set: $data) { affected_rows } }`;
    await hasura.client.post('/v1/graphql', { query: updateSuccessMutation, variables: { id: operation_id, data: { external_operation_id: (paymentResult as any).externalPaymentId, status: (paymentResult as any).status === 'pending_user_action' ? 'pending_user_action' : 'pending_confirmation', provider_response_details: (paymentResult as any).providerResponse, updated_at: Date.now() } } });

    return NextResponse.json({ success: true, payment_id: (paymentResult as any).externalPaymentId, payment_url: (paymentResult as any).redirectUrl, operation_id });
  } catch (error) {
    debug('Error initializing payment:', error as any);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function handleTbankAddCard(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { provider_id, customer_key } = await request.json();
    if (!provider_id || !customer_key) return NextResponse.json({ error: 'Missing required fields: provider_id, customer_key' }, { status: 400 });

    const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, token: (session as any).accessToken || undefined });
    const hasyx = new Hasyx(apolloClient, Generator(schema as any));
    (hasyx as any).user = session.user;

    const providers = await hasyx.select({ table: 'payments_providers', where: { id: { _eq: provider_id } }, returning: ['id', 'type', 'config', 'is_test_mode'], role: 'user' });
    if (!providers || providers.length === 0) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

    const provider = providers[0];
    if (provider.type !== 'tbank') return NextResponse.json({ error: 'Unsupported provider type' }, { status: 400 });

    const processor = new TBankPaymentProcessor({ providerDBConfig: provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const addCardResult = await processor.addPaymentMethod({ userId: session.user.id, providerName: 'tbank', type: 'card', details: { tbankCustomerKey: customer_key, tbankCheckType: '3DS', tbankReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hasyx/payments?tab=methods&action=card-added` } });
    if ((addCardResult as any).status === 'failed') return NextResponse.json({ error: (addCardResult as any).detailsForUser?.message || 'Failed to initiate card addition' }, { status: 400 });

    const paymentMethod = await hasyx.insert({ table: 'payments_methods', object: { provider_id: provider_id, external_id: (addCardResult as any).detailsForUser?.requestKey || '', type: 'card', status: 'pending_verification', details: { customer_key: customer_key, request_key: (addCardResult as any).detailsForUser?.requestKey }, is_recurrent_ready: false, recurrent_details: { customerKey: customer_key } }, returning: ['id'], role: 'user' });

    return NextResponse.json({ success: true, payment_method_id: (paymentMethod as any).id, redirect_url: (addCardResult as any).redirectUrl, request_key: (addCardResult as any).detailsForUser?.requestKey });
  } catch (error: any) {
    debug('Add card error:', error);
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}

export async function handleTbankCreateSubscription(request: NextRequest, authOptions?: any) {
  try {
    const { getServerSession } = await import('next-auth');
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan_id, method_id } = await request.json();
    if (!plan_id || !method_id) return NextResponse.json({ error: 'Missing required fields: plan_id, method_id' }, { status: 400 });

    const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, token: (session as any).accessToken || undefined });
    const hasyx = new Hasyx(apolloClient, Generator(schema as any));
    (hasyx as any).user = session.user;

    const plans = await hasyx.select({ table: 'payments_plans', where: { id: { _eq: plan_id }, active: { _eq: true } }, returning: ['id','name','price','currency','interval','interval_count','trial_period_days'], role: 'user' });
    if (!plans || plans.length === 0) return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 });
    const plan = plans[0];

    const methods = await hasyx.select({ table: 'payments_methods', where: { id: { _eq: method_id }, status: { _eq: 'active' }, is_recurrent_ready: { _eq: true } }, returning: [ 'id','provider_id','external_id','type','details','recurrent_details', { provider: ['id','type','config','is_test_mode'] } ], role: 'user' });
    if (!methods || methods.length === 0) return NextResponse.json({ error: 'Payment method not found, not active, or not ready for recurrent payments' }, { status: 404 });
    const method = methods[0];
    if (method.provider.type !== 'tbank') return NextResponse.json({ error: 'Unsupported provider type' }, { status: 400 });

    const now = Date.now();
    const trialEnd = plan.trial_period_days > 0 ? now + (plan.trial_period_days * 24 * 60 * 60 * 1000) : now;
    const firstBillingDate = (() => { const d = new Date(trialEnd); switch (plan.interval) { case 'minute': d.setMinutes(d.getMinutes()+plan.interval_count); break; case 'hour': d.setHours(d.getHours()+plan.interval_count); break; case 'day': d.setDate(d.getDate()+plan.interval_count); break; case 'week': d.setDate(d.getDate()+7*plan.interval_count); break; case 'month': d.setMonth(d.getMonth()+plan.interval_count); break; case 'year': d.setFullYear(d.getFullYear()+plan.interval_count); break; default: throw new Error('Unsupported interval'); } return d.getTime(); })();

    const processor = new TBankPaymentProcessor({ providerDBConfig: method.provider.config, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const needsInitialPayment = plan.trial_period_days === 0;
    let initResult: any | null = null;
    if (needsInitialPayment) {
      initResult = await processor.initiatePayment({ paymentId: `sub_init_${Date.now()}`, amount: plan.price, currency: plan.currency, description: `${plan.name} - Initial subscription payment`, userId: (session as any).user.id, objectHid: `plan_${plan_id}`, returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hasyx/payments?tab=subscriptions&action=subscription-created`, metadata: { isRecurrent: true, customerKey: method.recurrent_details?.customerKey, subscriptionPlanId: plan_id, subscriptionUserId: (session as any).user.id, subscriptionMethodId: method_id } });
      if (initResult.status === 'failed' || initResult.status === 'error') return NextResponse.json({ error: initResult.errorMessage || 'Failed to initiate subscription payment' }, { status: 400 });
    }

    const subscription = await hasyx.insert({ table: 'payments_subscriptions', object: { method_id: method_id, provider_id: method.provider_id, plan_id: plan_id, status: plan.trial_period_days > 0 ? 'trialing' : 'pending_confirmation', external_subscription_id: needsInitialPayment ? initResult?.externalPaymentId : null, current_period_start: now, current_period_end: firstBillingDate, next_billing_date: firstBillingDate, billing_anchor_date: now, billing_retry_count: 0, max_billing_retries: 3, metadata: { plan_name: plan.name, initial_payment_required: needsInitialPayment } }, returning: ['id'], role: 'user' });
    const subscriptionId = (subscription as any).id;

    if (needsInitialPayment && initResult) {
      await hasyx.insert({ table: 'payments_operations', object: { user_id: (session as any).user.id, method_id: method_id, provider_id: method.provider_id, subscription_id: subscriptionId, external_operation_id: initResult.externalPaymentId, amount: plan.price, currency: plan.currency, status: 'pending_user_action', description: `${plan.name} - Initial subscription payment`, provider_request_details: { paymentId: initResult.paymentId, amount: plan.price, isInitialSubscriptionPayment: true }, initiated_at: now }, role: 'user' });
      return NextResponse.json({ success: true, subscription_id: subscriptionId, redirect_url: initResult.redirectUrl, message: 'Please complete the initial payment to activate your subscription' });
    }

    return NextResponse.json({ success: true, subscription_id: subscriptionId, message: plan.trial_period_days > 0 ? `Subscription created with ${plan.trial_period_days} day trial period` : 'Subscription created' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 });
  }
}


