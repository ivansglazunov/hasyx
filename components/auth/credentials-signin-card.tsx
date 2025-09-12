'use client';

import { Button } from "hasyx/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "hasyx/components/ui/card";
import { Input } from "hasyx/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "hasyx/components/ui/tabs";
import { Label } from "hasyx/components/ui/label";
import { KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from 'hasyx';
import { useSession } from 'next-auth/react';

export function CredentialsSignInCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations();
  const { data: session } = useSession();
  
  const [mode, setMode] = useState<'email'|'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [linked, setLinked] = useState<boolean | null>(null);

  const identifier = useMemo(() => mode === 'email' ? email : phone, [mode, email, phone]);

  useEffect(() => {
    setError(null);
    setInfoMessage(null);
    setHasPassword(null);
    setLinked(null);
    if (!session?.user?.id) return;
    if (!identifier) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const url = `/api/auth/credentials/status?providerType=${mode}&identifier=${encodeURIComponent(identifier)}`;
        const resp = await fetch(url, { signal: ctrl.signal });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.error || 'Failed to load status');
        setHasPassword(!!json.hasPassword);
        setLinked(!!json.linked);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message || 'Failed to load status');
      }
    })();
    return () => ctrl.abort();
  }, [session?.user?.id, identifier, mode]);

  const handleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        providerType: mode,
        identifier,
        password,
      } as any);
      if (result?.error) throw new Error(result.error);
      window.location.reload();
    } catch (e: any) {
      setError(e?.message || 'Sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);
    try {
      const payload: any = {
        providerType: mode,
        identifier,
        newPassword,
        confirmNewPassword,
      };
      if (hasPassword) payload.oldPassword = oldPassword;
      const resp = await fetch('/api/auth/credentials/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Failed to save password');
      setInfoMessage('Saved');
      setOldPassword(''); setNewPassword(''); setConfirmNewPassword('');
      const statusResp = await fetch(`/api/auth/credentials/status?providerType=${mode}&identifier=${encodeURIComponent(identifier)}`);
      const statusJson = await statusResp.json();
      if (statusResp.ok) {
        setHasPassword(!!statusJson.hasPassword);
        setLinked(!!statusJson.linked);
      }
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!session?.user?.id;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          {isAuthenticated ? t('auth.credentials.title') : t('auth.signIn')}
        </CardTitle>
        <CardDescription>
          {isAuthenticated ? t('auth.credentials.manageDescription') : t('auth.signInToYourAccount')}
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
              <Label htmlFor="cred-email">{t('forms.labels.email')}</Label>
              <Input id="cred-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
            </TabsContent>
            <TabsContent value="phone" className="mt-4 grid gap-2">
              <Label htmlFor="cred-phone">{t('forms.labels.phone')}</Label>
              <Input id="cred-phone" type="tel" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} required />
            </TabsContent>
          </Tabs>

          {!isAuthenticated && (
            <>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="cred-password">{t('forms.labels.password')}</Label>
                </div>
                <Input id="cred-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
              </div>
              {error && (<div className="text-red-500 text-sm">{error}</div>)}
              {infoMessage && (<div className="text-blue-500 text-sm">{infoMessage}</div>)}
              <Button type="button" className="w-full" onClick={handleSignIn} disabled={isLoading || !identifier || !password}>
                {isLoading ? t('common.loading') : t('auth.signIn')}
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              {linked != null && (
                <div className="text-sm">
                  {hasPassword ? t('auth.password.set') : t('auth.password.notSet')}
                  {!linked ? ` (${t('auth.credentials.willLinkIdentifier')})` : ''}
                </div>
              )}
              {hasPassword ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="old-password">{t('forms.labels.oldPassword')}</Label>
                    <Input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">{t('forms.labels.newPassword')}</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-new-password">{t('forms.labels.confirmNewPassword')}</Label>
                    <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isLoading} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">{t('forms.labels.newPassword')}</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-new-password">{t('forms.labels.confirmNewPassword')}</Label>
                    <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isLoading} />
                  </div>
                </>
              )}
              {error && (<div className="text-red-500 text-sm">{error}</div>)}
              {infoMessage && (<div className="text-blue-500 text-sm">{infoMessage}</div>)}
              <Button type="button" className="w-full" onClick={handleSavePassword} disabled={isLoading || !identifier || !newPassword || !confirmNewPassword || (hasPassword ? !oldPassword : false)}>
                {isLoading ? t('common.loading') : t('actions.save')}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 