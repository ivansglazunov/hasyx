'use client';

import { Button } from 'hasyx/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'hasyx/components/ui/card';
import { Input } from 'hasyx/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'hasyx/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'hasyx/components/ui/input-otp';
import { Label } from 'hasyx/components/ui/label';
import { KeyRound } from 'lucide-react';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useTranslations } from 'hasyx';

export function OtpSignInCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations();

  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const handleStart = async () => {
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);
    try {
      const provider = mode;
      const identifier = mode === 'email' ? email : phone;
      const resp = await fetch('/api/auth/credentials/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, identifier }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to start');
      setAttemptId(json.attemptId);
      setInfoMessage('Code sent. Enter it below.');
    } catch (e: any) {
      console.error('OTP start error:', e);
      setError(e?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (value: string) => {
    if (!attemptId || value.length !== 6) return;
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, code: value }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to verify');

      const result = await signIn('credentials', {
        redirect: false,
        userId: json.userId,
      } as any);
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.reload();
      }
    } catch (e: any) {
      console.error('OTP verify error:', e);
      setError(e?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          {t('auth.otp.title')}
        </CardTitle>
        <CardDescription>
          {t('auth.signInToYourAccount')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="mt-4 grid gap-2">
              <Label htmlFor="otp-email">{t('forms.labels.email')}</Label>
              <Input id="otp-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || !!attemptId} required />
            </TabsContent>
            <TabsContent value="phone" className="mt-4 grid gap-2">
              <Label htmlFor="otp-phone">{t('forms.labels.phone')}</Label>
              <Input id="otp-phone" type="tel" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading || !!attemptId} required />
            </TabsContent>
          </Tabs>

          {attemptId ? (
            <div className="grid gap-2">
              <Label>{t('auth.otp.enterCode')}</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={handleVerify}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : null}

          {error && (<div className="text-red-500 text-sm">{error}</div>)}
          {infoMessage && (<div className="text-blue-500 text-sm">{t('auth.otp.codeSent')}</div>)}

          {!attemptId && (
            <Button type="button" className="w-full" onClick={handleStart} disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.otp.sendCode')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


