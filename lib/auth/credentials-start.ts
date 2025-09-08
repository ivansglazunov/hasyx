import { NextRequest, NextResponse } from 'next/server';
import Debug from '../debug';
import { createAttempt, VerificationProvider } from '../verification-codes';
import { sendVerificationEmail } from '../email';
import { sendSms } from '../sms';

const debug = Debug('api:credentials:start');

export async function handleCredentialsStart(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, identifier } = body as { provider: VerificationProvider; identifier: string };
    if (!provider || !identifier) {
      return NextResponse.json({ error: 'Missing provider or identifier' }, { status: 400 });
    }

    const attempt = await createAttempt({ provider, identifier });

    // Send out-of-band code. For phone we log via sms.ts, for email use resend if configured
    const message = `Your verification code is: ${attempt.code}`;
    // Always write OTP to terminal for diagnostics regardless of real sending
    console.log('[OTP] credentials %s:%s code=%s', provider, identifier, attempt.code);
    if (provider === 'phone') {
      await sendSms({ to: identifier, text: message });
    } else {
      await sendVerificationEmail(identifier, `CODE:${attempt.code}`);
    }

    debug('Started credentials verification attempt %s for %s:%s', attempt.attemptId, provider, identifier);
    return NextResponse.json({ attemptId: attempt.attemptId, expiresAt: attempt.expiresAt });
  } catch (error: any) {
    debug('Error starting credentials flow:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
