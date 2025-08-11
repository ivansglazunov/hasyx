import Debug from 'hasyx/lib/debug';

const debug = Debug('sms');

export interface SmsOptions {
  to: string; // E.164
  text: string;
}

export async function sendSms(options: SmsOptions): Promise<boolean> {
  debug('SMS to %s: %s', options.to, options.text);
  return true;
}


