import { NextRequest, NextResponse } from 'next/server';
import { Hasura } from 'hasyx/lib/hasura/hasura';
import { VtbPaymentProcessor, VtbProviderDBConfig } from 'hasyx/lib/payments/vtb';
import Debug from 'hasyx/lib/debug';

const debug = Debug('api:payments:vtb:add-card');

export async function POST(request: NextRequest) {
  try {
    const { provider_id, customer_key } = await request.json();
    if (!provider_id || !customer_key) {
      return NextResponse.json({ error: 'Missing provider_id or customer_key' }, { status: 400 });
    }

    const hasura = new Hasura({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
    const providerQ = `
      query GetProvider($id: uuid!) { payments_providers(where:{id:{_eq:$id}}){ id type config is_test_mode } }
    `;
    const prRes = await hasura.client.post('/v1/graphql', { query: providerQ, variables: { id: provider_id } });
    const provider = prRes.data?.data?.payments_providers?.[0];
    if (!provider || provider.type !== 'vtb') return NextResponse.json({ error: 'Provider is not VTB' }, { status: 400 });

    const processor = new VtbPaymentProcessor({ providerDBConfig: provider.config as VtbProviderDBConfig, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const result = await processor.addPaymentMethod({ userId: 'unknown', providerName: 'vtb', type: 'card', details: { vtbClientId: customer_key } });
    if (result.redirectUrl) {
      return NextResponse.json({ success: true, redirect_url: result.redirectUrl });
    }
    return NextResponse.json({ error: 'Failed to get redirect URL' }, { status: 400 });
  } catch (e: any) {
    debug('Error VTB add-card', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


