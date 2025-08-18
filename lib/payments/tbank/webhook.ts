import { NextRequest, NextResponse } from 'next/server';
import { TBankPaymentProcessor, TBankProviderDBConfig } from '../tbank';
import { Hasyx } from '../..';
import { createApolloClient } from '../../apollo/apollo';
import { Generator } from '../../generator';
import schema from '../../../public/hasura-schema.json';
import Debug from '../../debug';
import { PaymentStatus } from '../base';

const debug = Debug('api:payments:tbank:webhook');

let hasyxClient: Hasyx | undefined;
try {
  const apolloClient = createApolloClient({ url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!, secret: process.env.HASURA_ADMIN_SECRET! });
  hasyxClient = new Hasyx(apolloClient, Generator(schema as any));
} catch (e) {
  debug('Failed to initialize Hasyx client for TBank webhook');
}

export async function handleTbankWebhook(request: NextRequest) {
  debug('Received TBank webhook POST request');
  if (!hasyxClient) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });

  let payload: any;
  try {
    const rawBody = await request.text();
    debug('Raw webhook body:', rawBody);
    payload = typeof rawBody === 'string' ? Object.fromEntries(new URLSearchParams(rawBody)) : null;
    if (!payload) return new NextResponse('ERROR: Invalid body format', { status: 400 });

    const terminalKeyFromPayload = payload.TerminalKey as string;
    if (!terminalKeyFromPayload) return new NextResponse('ERROR: TerminalKey missing', { status: 400 });

    const providers = await (hasyxClient as any).select({ table: 'payments_providers', where: { type: { _eq: 'tbank' }, config: { _contains: { terminal_key: terminalKeyFromPayload } }, is_active: { _eq: true } }, limit: 1, returning: ['id', 'config', 'is_test_mode', 'default_return_url', 'default_webhook_url', 'default_card_webhook_url'] });
    if (!providers || providers.length === 0 || !providers[0].config) return new NextResponse('ERROR: Provider configuration not found', { status: 400 });

    const providerResult = providers[0];
    const providerDBConfig = providerResult.config as TBankProviderDBConfig;
    providerDBConfig.is_test_mode = providerResult.is_test_mode;
    providerDBConfig.default_return_url = providerResult.default_return_url;
    providerDBConfig.default_webhook_url = providerResult.default_webhook_url;
    providerDBConfig.default_card_webhook_url = providerResult.default_card_webhook_url;
    if (!providerDBConfig.secret_key) return new NextResponse('ERROR: Provider secret key misconfiguration', { status: 500 });

    const tbankAdapter = new TBankPaymentProcessor({ providerDBConfig, appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' });
    const result = await tbankAdapter.handleWebhook(request, rawBody);
    debug('Webhook processing result from adapter:', result);

    if (result.processed && result.paymentId) {
      const paymentUpdateData: any = { status: result.newPaymentStatus, provider_response_details: result.providerResponse };
      if (result.externalPaymentId) paymentUpdateData.external_operation_id = result.externalPaymentId;
      if (result.newPaymentStatus === PaymentStatus.SUCCEEDED) paymentUpdateData.paid_at = new Date().toISOString();
      try {
        await (hasyxClient as any).update({ table: 'payments_operations', where: { id: { _eq: result.paymentId } }, _set: paymentUpdateData, returning: ['id'], role: 'admin' });
      } catch (err: any) {
        debug('Error updating operation in Hasura:', err.message, err.graphQLErrors);
      }

      if (result.subscriptionId && result.newSubscriptionStatus) {
        try {
          await (hasyxClient as any).update({ table: 'payments_subscriptions', where: { id: { _eq: result.subscriptionId } }, _set: { status: result.newSubscriptionStatus }, returning: ['id'], role: 'admin' });
        } catch (err: any) {
          debug('Error updating subscription in Hasura:', err.message, err.graphQLErrors);
        }
      }
    }

    const responseMessage = result.messageToProvider || (result.processed ? 'OK' : 'ERROR');
    const responseStatus = result.processed ? 200 : (result.error === 'Webhook token mismatch' || result.error === 'Webhook TerminalKey mismatch with processor instance.' ? 400 : 500);
    return new NextResponse(responseMessage, { status: responseStatus });
  } catch (error: any) {
    debug('Critical error in TBank webhook POST handler:', error.message, error.stack);
    const internalPaymentIdAttempt = payload?.OrderId;
    debug(`Webhook processing failed critically. OrderId: ${internalPaymentIdAttempt}`);
    return new NextResponse('ERROR', { status: 500 });
  }
}

export async function handleTbankWebhookOptions() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}


