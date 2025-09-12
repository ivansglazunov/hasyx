import Debug from './debug';

const debug = Debug('sms');

export interface SmsOptions {
  to: string; // E.164
  text: string;
}

// Environment-driven configuration for sms providers
const smsProvider = (process.env.SMS_PROVIDER || '').toLowerCase(); // 'smsru' | 'smsaero'
// sms.ru
const smsRuApiId = process.env.SMSRU_API_ID; // main api_id
const smsRuFrom = process.env.SMSRU_FROM; // optional approved sender name
// SMSAero
const smsAeroEmail = process.env.SMSAERO_EMAIL;
const smsAeroApiKey = process.env.SMSAERO_API_KEY;
const smsAeroSign = process.env.SMSAERO_SIGN;
const smsAeroChannel = process.env.SMSAERO_CHANNEL; // optional

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

  const provider = smsProvider || (smsRuApiId ? 'smsru' : (smsAeroEmail && smsAeroApiKey && smsAeroSign ? 'smsaero' : ''));
  if (provider === 'smsaero') {
    // Send via SMSAero
    if (!smsAeroEmail || !smsAeroApiKey || !smsAeroSign) {
      console.warn('⚠️ SMSAero is not fully configured. Set SMSAERO_EMAIL, SMSAERO_API_KEY, SMSAERO_SIGN.');
      return true;
    }
    try {
      const number = normalizePhoneNumber(to);
      const url = new URL('https://gate.smsaero.ru/v2/sms/send');
      url.searchParams.set('number', number);
      url.searchParams.set('text', text);
      url.searchParams.set('sign', smsAeroSign);
      if (smsAeroChannel) url.searchParams.set('channel', smsAeroChannel);

      const auth = Buffer.from(`${smsAeroEmail}:${smsAeroApiKey}`).toString('base64');
      debug('Sending SMS via SMSAero number=%s sign=%s channel=%s', number, smsAeroSign, smsAeroChannel || '');
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
      });
      const json = await resp.json().catch(() => ({} as any));
      if (!resp.ok) {
        console.error('SMSAero HTTP error:', resp.status, json);
        debug('SMSAero HTTP error %s %o', resp.status, json);
        return false;
      }
      const success = Boolean((json as any)?.success);
      if (!success) {
        console.error('SMSAero API error response:', json);
        debug('SMSAero API error %o', json);
        return false;
      }
      debug('SMSAero sent successfully %o', (json as any)?.data || json);
      return true;
    } catch (error: any) {
      console.error('Failed to send SMS via SMSAero:', error?.message || error);
      debug('Exception sending SMS %o', error);
      return false;
    }
  }

  // Default to sms.ru
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
    const resp = await fetch(url.toString(), { method: 'GET', headers: { Accept: 'application/json' } });
    const json = await resp.json().catch(() => ({} as any));
    if (!resp.ok) {
      console.error('sms.ru HTTP error:', resp.status, json);
      debug('sms.ru HTTP error %s %o', resp.status, json);
      return false;
    }
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

