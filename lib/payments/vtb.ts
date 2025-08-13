import axios from 'axios';
import Debug from '../debug';
import {
  IPaymentProcessor,
  PaymentDetailsArgs,
  InitiatePaymentResult,
  WebhookHandlingResult,
  PaymentStatus,
  PaymentStatusResult,
  SubscriptionDetailsArgs,
  CreateSubscriptionResult,
  CancelSubscriptionArgs,
  CancelSubscriptionResult,
  AddPaymentMethodArgs,
  AddPaymentMethodResult,
  PaymentMethodStatus,
} from './base';

const debug = Debug('payment:vtb');

export interface VtbProviderDBConfig {
  api_base_url?: string; // defaults by mode
  user_name?: string;
  password?: string;
  token?: string;
  is_test_mode?: boolean;
  default_return_url?: string;
  default_webhook_url?: string;
  default_card_webhook_url?: string;
}

type VtbParams = Record<string, string | number | boolean | undefined>;

function buildBaseUrl(config: VtbProviderDBConfig): string {
  if (config.api_base_url && config.api_base_url.length > 0) return config.api_base_url.replace(/\/?$/, '/');
  return (config.is_test_mode ? 'https://vtb.rbsuat.com/payment/rest/' : 'https://platezh.vtb24.ru/payment/rest/');
}

function withAuth(params: VtbParams, cfg: VtbProviderDBConfig): VtbParams {
  const p: VtbParams = { ...params };
  if (cfg.token && String(cfg.token).length > 0) {
    p.token = cfg.token;
  } else {
    if (cfg.user_name) p.userName = cfg.user_name;
    if (cfg.password) p.password = cfg.password;
  }
  return p;
}

async function postForm<T>(baseUrl: string, endpoint: string, params: VtbParams): Promise<T> {
  const url = baseUrl + endpoint;
  const form = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  debug('VTB POST', endpoint, Object.fromEntries(form));
  const res = await axios.post<T>(url, form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  return res.data;
}

function mapVtbOrderStatusToInternal(status: number | string | undefined): PaymentStatus {
  // Based on common RBC gateway semantics
  const s = typeof status === 'string' ? parseInt(status, 10) : (status ?? -1);
  switch (s) {
    case 0: // created
      return PaymentStatus.PENDING_USER_ACTION;
    case 1: // authorized (pre-auth)
      return PaymentStatus.PENDING_CONFIRMATION;
    case 2: // deposited (paid)
      return PaymentStatus.SUCCEEDED;
    case 3: // canceled
      return PaymentStatus.CANCELED;
    case 4: // refunded
      return PaymentStatus.REFUNDED;
    case 5: // reversed/chargeback
      return PaymentStatus.CANCELED;
    default:
      return PaymentStatus.UNKNOWN;
  }
}

export class VtbPaymentProcessor implements IPaymentProcessor {
  readonly providerName = 'vtb';
  private providerConfig: VtbProviderDBConfig;
  private appBaseUrl: string;
  private baseUrl: string;

  constructor(config: { providerDBConfig: VtbProviderDBConfig; appBaseUrl: string }) {
    this.providerConfig = config.providerDBConfig;
    this.appBaseUrl = config.appBaseUrl;
    this.baseUrl = buildBaseUrl(this.providerConfig);
    if (!this.providerConfig.token && (!this.providerConfig.user_name || !this.providerConfig.password)) {
      throw new Error('VTB credentials are not configured (token or user_name/password required).');
    }
  }

  async initiatePayment(args: PaymentDetailsArgs): Promise<InitiatePaymentResult> {
    const { paymentId, amount, description, returnUrl, metadata } = args;
    const amountMinor = Math.round(amount * 100);
    const finalReturnUrl = returnUrl || this.providerConfig.default_return_url || `${this.appBaseUrl}/payments/callback/vtb/${paymentId}`;
    const params = withAuth({
      orderNumber: paymentId,
      amount: amountMinor,
      description,
      returnUrl: finalReturnUrl,
      // Bindings support (optional):
      clientId: metadata?.customerKey || metadata?.vtbClientId,
      createBinding: metadata?.isRecurrent ? true : undefined,
    }, this.providerConfig);
    type RegisterResponse = { errorCode: string; errorMessage?: string; orderId?: string; formUrl?: string };
    try {
      const resp = await postForm<RegisterResponse>(this.baseUrl, 'register.do', params);
      if (resp.errorCode === '0' && resp.formUrl && resp.orderId) {
        return {
          paymentId,
          externalPaymentId: resp.orderId,
          status: PaymentStatus.PENDING_USER_ACTION,
          redirectUrl: resp.formUrl,
          providerResponse: resp,
        };
      } else {
        return {
          paymentId,
          externalPaymentId: resp.orderId,
          status: PaymentStatus.ERROR,
          errorMessage: resp.errorMessage || `VTB register.do failed with code ${resp.errorCode}`,
          providerResponse: resp,
        };
      }
    } catch (e: any) {
      return { paymentId, status: PaymentStatus.ERROR, errorMessage: e.message, providerResponse: e.response?.data || e };
    }
  }

  async getPaymentStatus(internalPaymentId: string, externalPaymentId?: string): Promise<PaymentStatusResult> {
    if (!externalPaymentId) {
      return { internalPaymentId, status: PaymentStatus.UNKNOWN, error: 'orderId is required for VTB getOrderStatusExtended.do' };
    }
    type StatusResp = { errorCode: string; orderStatus?: number; actionCodeDescription?: string } & Record<string, any>;
    try {
      const resp = await postForm<StatusResp>(this.baseUrl, 'getOrderStatusExtended.do', withAuth({ orderId: externalPaymentId }, this.providerConfig));
      if (resp.errorCode === '0') {
        const mapped = mapVtbOrderStatusToInternal(resp.orderStatus);
        return { internalPaymentId, status: mapped, providerStatus: String(resp.orderStatus), providerResponse: resp, paidAt: mapped === PaymentStatus.SUCCEEDED ? Date.now() : undefined };
      }
      return { internalPaymentId, status: PaymentStatus.ERROR, error: resp.actionCodeDescription || `VTB status error ${resp.errorCode}`, providerResponse: resp };
    } catch (e: any) {
      return { internalPaymentId, status: PaymentStatus.ERROR, error: e.message, providerResponse: e.response?.data || e };
    }
  }

  async confirmPayment(externalPaymentId: string, amount?: number): Promise<any> {
    const params = withAuth({ orderId: externalPaymentId, amount: typeof amount === 'number' ? Math.round(amount * 100) : undefined }, this.providerConfig);
    return postForm<any>(this.baseUrl, 'deposit.do', params);
  }

  async cancelPayment(externalPaymentId: string, amount?: number): Promise<any> {
    // Prefer refund.do when deposited; reverse.do when only authorized. Caller can decide which to call; for now try refund.
    const params = withAuth({ orderId: externalPaymentId, amount: typeof amount === 'number' ? Math.round(amount * 100) : undefined }, this.providerConfig);
    return postForm<any>(this.baseUrl, 'refund.do', params);
  }

  async createSubscription(args: SubscriptionDetailsArgs): Promise<CreateSubscriptionResult> {
    const { userId, planId, metadata } = args;
    const init = await this.initiatePayment({
      paymentId: `sub_init_${userId}_${planId}_${Date.now()}`,
      amount: Number(metadata?.vtbInitialAmount ?? metadata?.amount ?? 0),
      currency: String(metadata?.vtbCurrency || 'RUB'),
      description: String(metadata?.vtbDescription || `Initial payment for plan ${planId}`),
      userId,
      objectHid: `plan_${planId}`,
      returnUrl: this.providerConfig.default_return_url,
      metadata: { isRecurrent: true, customerKey: metadata?.vtbClientId || metadata?.customerKey },
    });
    if (init.status === PaymentStatus.ERROR || init.status === PaymentStatus.FAILED) {
      throw new Error(init.errorMessage || 'VTB register.do failed for subscription');
    }
    return {
      subscriptionId: init.paymentId,
      externalSubscriptionId: undefined, // bindingId will be resolved after redirect and bindings fetch
      status: init.redirectUrl ? 'pending_initial_payment' : 'pending_confirmation',
      paymentRequired: !!init.redirectUrl,
      initialPaymentResult: init,
    };
  }

  async chargeRecurrent(args: { bindingId: string; orderId: string; amount: number; description?: string }): Promise<any> {
    const params = withAuth({
      bindingId: args.bindingId,
      orderNumber: args.orderId,
      amount: Math.round(args.amount * 100),
      description: args.description,
    }, this.providerConfig);
    return postForm<any>(this.baseUrl, 'recurrentPayment.do', params);
  }

  async cancelSubscription(args: CancelSubscriptionArgs): Promise<CancelSubscriptionResult> {
    return { subscriptionId: args.internalSubscriptionId, newStatus: 'canceled', canceledAt: Date.now() };
  }

  async addPaymentMethod(args: AddPaymentMethodArgs): Promise<AddPaymentMethodResult> {
    const { userId, details } = args;
    const clientId = details?.vtbClientId || details?.customerKey || `user_${userId}`;
    const returnUrl = details?.vtbReturnUrl || this.providerConfig.default_card_webhook_url || `${this.appBaseUrl}/api/payments/vtb/card-webhook`;
    const params = withAuth({
      orderNumber: `pm_${userId}_${Date.now()}`,
      amount: 100, // minimal amount to trigger card verification/binding if required
      returnUrl,
      clientId,
      createBinding: true,
      description: 'Card binding verification',
    }, this.providerConfig);
    type RegisterResponse = { errorCode: string; errorMessage?: string; orderId?: string; formUrl?: string };
    const resp = await postForm<RegisterResponse>(this.baseUrl, 'register.do', params);
    if (resp.errorCode === '0' && resp.formUrl) {
      return { paymentMethodId: '', externalId: undefined, status: PaymentMethodStatus.PENDING_USER_ACTION, isRecurrentReady: false, redirectUrl: resp.formUrl, detailsForUser: { orderId: resp.orderId, clientId } };
    }
    throw new Error(resp.errorMessage || `VTB register.do (add card) failed with code ${resp.errorCode}`);
  }

  async getCardList(clientId: string): Promise<any[] | null> {
    const resp = await postForm<any>(this.baseUrl, 'getBindings.do', withAuth({ clientId }, this.providerConfig));
    if (resp.errorCode === '0' && Array.isArray(resp.bindings)) return resp.bindings;
    if (resp.errorCode === '6') return []; // no bindings
    throw new Error(resp.errorMessage || `VTB getBindings.do failed with code ${resp.errorCode}`);
  }

  async removeCard(clientId: string, bindingId: string): Promise<any> {
    return postForm<any>(this.baseUrl, 'unBindCard.do', withAuth({ bindingId, clientId }, this.providerConfig));
  }

  async handleWebhook(_request: Request, rawBody: string | Buffer): Promise<WebhookHandlingResult> {
    try {
      let payload: any;
      if (typeof rawBody === 'string') {
        const asForm = new URLSearchParams(rawBody);
        payload = Object.fromEntries(asForm as any);
      } else if (Buffer.isBuffer(rawBody)) {
        const asForm = new URLSearchParams(rawBody.toString());
        payload = Object.fromEntries(asForm as any);
      } else if (typeof rawBody === 'object' && rawBody) {
        payload = rawBody;
      }
      const orderId = payload?.orderId || payload?.mdOrder || payload?.OrderId;
      const orderStatus = payload?.orderStatus;
      const newPaymentStatus = mapVtbOrderStatusToInternal(orderStatus);
      return { providerName: this.providerName, processed: true, paymentId: payload?.orderNumber, externalPaymentId: orderId, newPaymentStatus, providerResponse: payload, messageToProvider: 'OK' };
    } catch (e: any) {
      return { providerName: this.providerName, processed: false, error: e.message, messageToProvider: 'ERROR' };
    }
  }
}




