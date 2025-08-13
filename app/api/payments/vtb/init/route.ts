import { NextRequest, NextResponse } from 'next/server';
import { Hasura } from 'hasyx/lib/hasura/hasura';
import { VtbPaymentProcessor, VtbProviderDBConfig } from 'hasyx/lib/payments/vtb';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:payments:vtb:init');

export async function POST(request: NextRequest) {
  try {
    const { operation_id, provider_id } = await request.json();
    if (!operation_id || !provider_id) {
      return NextResponse.json({ error: 'Missing operation_id or provider_id' }, { status: 400 });
    }

    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });

    const operationQ = `
      query GetOp($id: uuid!) { payments_operations(where:{id:{_eq:$id}}){ id amount currency description user_id } }
    `;
    const opRes = await hasura.client.post('/v1/graphql', { query: operationQ, variables: { id: operation_id } });
    const op = opRes.data?.data?.payments_operations?.[0];
    if (!op) return NextResponse.json({ error: 'Payment operation not found' }, { status: 404 });

    const providerQ = `
      query GetProvider($id: uuid!) { payments_providers(where:{id:{_eq:$id}}){ id type config is_test_mode } }
    `;
    const prRes = await hasura.client.post('/v1/graphql', { query: providerQ, variables: { id: provider_id } });
    const provider = prRes.data?.data?.payments_providers?.[0];
    if (!provider || provider.type !== 'vtb') return NextResponse.json({ error: 'Provider is not VTB' }, { status: 400 });

    const vtb = new VtbPaymentProcessor({ providerDBConfig: provider.config as VtbProviderDBConfig, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });

    const init = await vtb.initiatePayment({
      paymentId: op.id,
      amount: op.amount,
      currency: op.currency,
      description: op.description || 'Payment',
      objectHid: op.id,
      userId: op.user_id,
    });

    if (init.errorMessage) {
      const updateFailed = `
        mutation U($id: uuid!, $data: payments_operations_set_input!){ update_payments_operations(where:{id:{_eq:$id}}, _set:$data){ affected_rows } }
      `;
      await hasura.client.post('/v1/graphql', { query: updateFailed, variables: { id: operation_id, data: { status: 'failed', error_message: init.errorMessage, provider_response_details: init.providerResponse, updated_at: Date.now() } } });
      return NextResponse.json({ error: init.errorMessage }, { status: 400 });
    }

    const updateOk = `
      mutation U($id: uuid!, $data: payments_operations_set_input!){ update_payments_operations(where:{id:{_eq:$id}}, _set:$data){ affected_rows } }
    `;
    await hasura.client.post('/v1/graphql', { query: updateOk, variables: { id: operation_id, data: { external_operation_id: init.externalPaymentId, status: init.status === 'pending_user_action' ? 'pending_user_action' : 'pending_confirmation', provider_response_details: init.providerResponse, updated_at: Date.now() } } });

    return NextResponse.json({ success: true, payment_id: init.externalPaymentId, payment_url: init.redirectUrl, operation_id });
  } catch (e: any) {
    debug('Error initializing VTB payment', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




