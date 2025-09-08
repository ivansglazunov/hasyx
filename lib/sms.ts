import Debug from 'hasyx/lib/debug';

const debug = Debug('sms');

export interface SmsOptions {
  to: string; // E.164
  text: string;
}

// Environment-driven configuration for sms.ru
const smsRuApiId = process.env.SMSRU_API_ID; // main api_id
const smsRuFrom = process.env.SMSRU_FROM; // optional approved sender name

// Normalize phone to sms.ru expected format: digits only, no leading '+'
function normalizePhoneNumber(input: string): string {
  const digitsOnly = (input || '').replace(/[^0-9]/g, '');
  // sms.ru expects e.g. 79991234567
  return digitsOnly;
}

export async function sendSms(options: SmsOptions): Promise<boolean> {
  const { to, text } = options;

  // Always log the SMS content to terminal regardless of real send
  console.log('SMS to %s: %s', to, text);
  debug('Prepared SMS to=%s text=%s', to, text);

  // If credentials are missing, do not fail the flow in development; return success after logging
  if (!smsRuApiId) {
    console.warn('⚠️ sms.ru is not configured. Set SMSRU_API_ID to enable real SMS sending.');
    return true;
  }

  try {
    const number = normalizePhoneNumber(to);
    const url = new URL('https://sms.ru/sms/send');
    url.searchParams.set('api_id', smsRuApiId);
    url.searchParams.set('to', number);
    url.searchParams.set('msg', text);
    url.searchParams.set('json', '1');
    if (smsRuFrom) url.searchParams.set('from', smsRuFrom);

    debug('Sending SMS via sms.ru number=%s from=%s', number, smsRuFrom || '');

    const resp = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await resp.json().catch(() => ({} as any));
    if (!resp.ok) {
      console.error('sms.ru HTTP error:', resp.status, json);
      debug('sms.ru HTTP error %s %o', resp.status, json);
      return false;
    }

    // sms.ru json has structure { status: 'OK' | 'ERROR', status_code, sms: {...} }
    const status = (json as any)?.status;
    const ok = status === 'OK';
    if (!ok) {
      console.error('sms.ru API error response:', json);
      debug('sms.ru API error %o', json);
      return false;
    }

    debug('sms.ru sent successfully %o', json);
    return true;
  } catch (error: any) {
    console.error('Failed to send SMS via sms.ru:', error?.message || error);
    debug('Exception sending SMS %o', error);
    return false;
  }
}

