import { NextRequest, NextResponse } from 'next/server';
import { Hasyx } from '../..';
import { createApolloClient } from '../../apollo/apollo';
import { Generator } from '../../generator';
import schema from '../../../public/hasura-schema.json';
import Debug from '../../debug';
import { VtbPaymentProcessor, VtbProviderDBConfig } from '../vtb';
import { PaymentStatus } from '../base';

const debug = Debug('api:payments:vtb:webhook');

let hasyxClient: Hasyx | undefined;
try {
  const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
  hasyxClient = new Hasyx(apolloClient, Generator(schema as any));
} catch (e) {
  debug('Failed init Hasyx for VTB webhook');
}

export async function handleVtbWebhook(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = Object.fromEntries(new URLSearchParams(rawBody));
    debug('VTB webhook payload', payload);

    if (!hasyxClient) return new NextResponse('ERROR', { status: 500 });

    const orderId = payload.orderId || payload.mdOrder;
    if (!orderId) return new NextResponse('OK', { status: 200 });

    const ops = await (hasyxClient as any).select({ table: 'payments_operations', where: { external_operation_id: { _eq: String(orderId) } }, returning: ['id', 'provider_id'], limit: 1, role: 'admin' });
    if (!ops || ops.length === 0) return new NextResponse('OK', { status: 200 });

    const providerRows = await (hasyxClient as any).select({ table: 'payments_providers', where: { id: { _eq: ops[0].provider_id }, type: { _eq: 'vtb' } }, returning: ['config', 'is_test_mode'], limit: 1, role: 'admin' });
    if (!providerRows || providerRows.length === 0) return new NextResponse('OK', { status: 200 });

    const cfg = providerRows[0].config as VtbProviderDBConfig;
    cfg.is_test_mode = providerRows[0].is_test_mode;

    const processor = new VtbPaymentProcessor({ providerDBConfig: cfg, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const result = await processor.handleWebhook(request as any, rawBody);

    if (result.processed && result.paymentId) {
      const data: any = { status: result.newPaymentStatus, provider_response_details: result.providerResponse };
      if (result.newPaymentStatus === PaymentStatus.SUCCEEDED) data.paid_at = new Date().toISOString();
      await (hasyxClient as any).update({ table: 'payments_operations', where: { id: { _eq: result.paymentId } }, _set: data, returning: ['id'], role: 'admin' });
    }

    return new NextResponse(result.messageToProvider || 'OK', { status: result.processed ? 200 : 400 });
  } catch (e: any) {
    debug('VTB webhook error', e);
    return new NextResponse('ERROR', { status: 500 });
  }
}

export async function handleVtbWebhookOptions() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}


