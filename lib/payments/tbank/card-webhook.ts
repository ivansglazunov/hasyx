import { NextRequest, NextResponse } from 'next/server';
import { TBankPaymentProcessor, TBankCardInfo, TBankProviderDBConfig } from '../tbank';
import { Hasyx } from '../../hasyx/hasyx';
import { createApolloClient } from '../../apollo/apollo';
import { Generator } from '../../generator';
import schema from '../../../public/hasura-schema.json';
import Debug from '../../debug';
import { PaymentMethodStatus } from '../base';

const debug = Debug('api:payments:tbank:card-webhook');

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let hasyxClient: Hasyx;

if (!HASURA_GRAPHQL_URL || !HASURA_ADMIN_SECRET) {
  console.error('Hasura URL or Admin Secret not configured for TBank card webhook handler.');
} else {
  try {
    const apolloClient = createApolloClient({ url: HASURA_GRAPHQL_URL, secret: HASURA_ADMIN_SECRET });
    hasyxClient = new Hasyx(apolloClient, Generator(schema as any));
  } catch (e: any) { debug('Error initializing Hasyx client for card webhook', e.message); }
}

export async function handleTbankCardWebhook(request: NextRequest): Promise<NextResponse> {
  debug('Received TBank card webhook POST request');

  if (!hasyxClient) {
    debug('Hasyx client not initialized for card webhook.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const payload = Object.fromEntries(new URLSearchParams(rawBody));
    debug('Card webhook raw payload:', payload);

    const terminalKeyFromPayload = payload.TerminalKey as string;
    if (!terminalKeyFromPayload) {
      debug('TerminalKey missing in TBank card webhook payload.');
      return new NextResponse("ERROR: TerminalKey missing", { status: 400 });
    }

    debug(`Fetching TBank provider config for TerminalKey: ${terminalKeyFromPayload}`);
    const providers = await hasyxClient.select({
      table: 'payments_providers',
      where: { type: { _eq: 'tbank' }, config: { _contains: { terminal_key: terminalKeyFromPayload } }, is_active: { _eq: true } },
      limit: 1,
      returning: ['id', 'config', 'is_test_mode', 'default_return_url', 'default_webhook_url', 'default_card_webhook_url']
    });

    if (!providers || providers.length === 0 || !providers[0].config) {
      debug(`No active TBank provider configuration found for TerminalKey: ${terminalKeyFromPayload}`);
      return new NextResponse("ERROR: Provider configuration not found", { status: 400 });
    }

    const providerResult = providers[0];
    const providerDBConfig = providerResult.config as TBankProviderDBConfig;
    providerDBConfig.is_test_mode = providerResult.is_test_mode;
    providerDBConfig.default_return_url = providerResult.default_return_url;
    providerDBConfig.default_webhook_url = providerResult.default_webhook_url;
    providerDBConfig.default_card_webhook_url = providerResult.default_card_webhook_url;

    if (!providerDBConfig.secret_key) {
      debug(`Secret key missing in fetched TBank provider config for TerminalKey: ${terminalKeyFromPayload}`);
      return new NextResponse("ERROR: Provider secret key misconfiguration", { status: 500 });
    }

    const tbankAdapter = new TBankPaymentProcessor({ providerDBConfig: providerDBConfig, appBaseUrl: APP_BASE_URL });

    const customerKey = payload.CustomerKey as string;
    const requestKey = payload.RequestKey as string;
    const tbankCardStatus = payload.Status as string;
    const cardIdFromPayload = payload.CardId as string;
    const success = payload.Success === 'true';

    if (!success || tbankCardStatus !== 'A') {
      debug(`Card operation not successful or status not Active. Status: ${tbankCardStatus}, Success: ${payload.Success}. RequestKey: ${requestKey}`);
      return new NextResponse("OK", { status: 200 });
    }

    if (!customerKey) {
      debug('CustomerKey missing in card webhook payload.');
      return new NextResponse("ERROR", { status: 400 });
    }

    const cards = await tbankAdapter.getCardList(customerKey);
    let newCardInfo: TBankCardInfo | null | undefined = null;

    if (cards && cards.length > 0) {
      if (cardIdFromPayload) {
        newCardInfo = cards.find(card => card.CardId === cardIdFromPayload && card.Status === 'A');
      } else {
        newCardInfo = cards.filter(card => card.Status === 'A').sort((a, b) => b.CardId.localeCompare(a.CardId))[0];
        debug('CardId not in webhook, heuristically picked card:', newCardInfo);
      }
    }

    if (newCardInfo == null) {
      debug(`Could not find a suitable active card object for CustomerKey ${customerKey} via GetCardList after webhook. Webhook CardId: ${cardIdFromPayload}`);
      return new NextResponse("OK", { status: 200 });
    }

    if (!newCardInfo.CardId) {
      debug(`Card object found for CustomerKey ${customerKey}, but it is missing a CardId. Webhook CardId: ${cardIdFromPayload}`);
      return new NextResponse("OK", { status: 200 });
    }

    const userMappings = await hasyxClient.select({
      table: 'payments_user_payment_provider_mappings',
      where: { provider_id: providerResult.id, provider_customer_key: customerKey },
      limit: 1,
      returning: ['user_id']
    });

    let internalUserId = userMappings && userMappings.length > 0 ? userMappings[0].user_id : null;

    if (!internalUserId) {
      debug('Could not determine internalUserId for card webhook processing. CustomerKey:', customerKey);
      return new NextResponse("OK", { status: 200 });
    }

    const paymentMethodData = {
      user_id: internalUserId,
      provider_id: providerResult.id,
      external_id: newCardInfo.CardId,
      type: 'card',
      details: {
        pan_masked: newCardInfo.Pan,
        exp_date: newCardInfo.ExpDate,
        card_type: newCardInfo.CardType,
      },
      is_default: newCardInfo.IsDefault || false,
      is_recurrent_ready: !!newCardInfo.RebillId,
      recurrent_details: newCardInfo.RebillId ? { rebillId: newCardInfo.RebillId } : null,
      expires_at: newCardInfo.ExpDate ? `20${newCardInfo.ExpDate.substring(2)}/${newCardInfo.ExpDate.substring(0, 2)}/01` : undefined,
      status: PaymentMethodStatus.ACTIVE,
    };

    try {
      debug('Attempting to save payment method to Hasura:', paymentMethodData);
      await hasyxClient.insert({
        table: 'payments_methods',
        object: paymentMethodData,
        returning: ['id'],
        role: 'admin',
      });
      debug(`Payment method for CardId ${newCardInfo.CardId} saved successfully for user ${internalUserId}.`);
    } catch (hasuraError: any) {
      debug(`Error saving payment method for CardId ${newCardInfo.CardId} in Hasura:`, hasuraError.message, hasuraError.graphQLErrors);
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error: any) {
    debug('Critical error in TBank card webhook POST handler:', error.message, error.stack);
    return new NextResponse("ERROR", { status: 500 });
  }
}

export async function handleTbankCardWebhookOptions(request: NextRequest): Promise<NextResponse> {
  debug('OPTIONS /api/payments/tbank/card-webhook');
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
