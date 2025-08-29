'use client';

import { Button } from "hasyx/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "hasyx/components/ui/card";
import { Input } from "hasyx/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "hasyx/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "hasyx/components/ui/input-otp";
import { Label } from "hasyx/components/ui/label";
import { KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useTranslations } from 'hasyx';
import { useJwt } from '../jwt-auth';
import { API_URL } from 'hasyx/lib/url';

export function CredentialsSignInCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations();
  const jwtClient = useJwt();
  const isJwtMode = !!+process.env.NEXT_PUBLIC_JWT_AUTH!;
  
  // State for credentials form
  const [mode, setMode] = useState<'email'|'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // State for info/success messages
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const handleStart = async () => {
    setError(null); // Clear previous error
    setInfoMessage(null); // Clear previous info message
    setIsCredentialsLoading(true);
    
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
    } catch (error) {
      console.error('Credentials sign-in error:', error);
      setError('An error occurred during sign-in');
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  const handleVerify = async (value: string) => {
    if (!attemptId || value.length !== 6) return;
    setIsCredentialsLoading(true);
    try {
      const resp = await fetch('/api/auth/credentials/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, code: value, password }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to verify');

      // Finish with NextAuth signIn by userId for stable session
      const result = await signIn('credentials', {
        redirect: false,
        userId: json.userId,
      } as any);
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      setError((e as any)?.message || 'Verification failed');
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          {t('auth.signIn')}
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
              <Label htmlFor="email">{t('forms.labels.email')}</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isCredentialsLoading || !!attemptId} required />
            </TabsContent>
            <TabsContent value="phone" className="mt-4 grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isCredentialsLoading || !!attemptId} required />
            </TabsContent>
          </Tabs>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{t('forms.labels.password')}</Label>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isCredentialsLoading || !!attemptId} required />
          </div>

          {attemptId ? (
            <div className="grid gap-2">
              <Label>Enter verification code</Label>
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
          {infoMessage && (<div className="text-blue-500 text-sm">{infoMessage}</div>)}

          {!attemptId && (
            <Button type="button" className="w-full" onClick={handleStart} disabled={isCredentialsLoading}>
              {isCredentialsLoading ? t('common.loading') : 'Send code'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 