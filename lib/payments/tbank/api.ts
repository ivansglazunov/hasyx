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


