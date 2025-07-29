'use client';

import { Button } from "hasyx/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "hasyx/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "hasyx/components/ui/tabs";
import { Label } from "hasyx/components/ui/label";
import { Github, LogIn, LogOut, MailCheck, MailWarning, Loader2 } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import React from "react";
import { useHasyx, useSession, useSubscription } from 'hasyx';
import { OAuthButtons } from './oauth-buttons';
import { Accounts } from '../accounts';
import Debug from 'hasyx/lib/debug';

// Import provider icons (assuming they exist)
// import GoogleIcon from 'hasyx/public/icons/google.svg';
// import YandexIcon from 'hasyx/public/icons/yandex.svg';

const debug = Debug('auth:actions-card');

export function AuthActionsCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const hasyx = useHasyx();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const userId = session?.user?.id;

  console.log('AuthActionsCard', { hasyx, session, loading, userId });

  // --- Subscription for email verification status ---
  const { 
    data: subData, 
    loading: subLoading, 
    error: subError 
  } = useSubscription<{ users: { email_verified: string | null }[] }>(
    {
      table: 'users',
      where: { id: { _eq: userId } }, // Subscribe only if userId exists
      returning: ['email_verified'], // Only need verification status
    },
    {
      role: 'me',
      skip: !userId,
    }
  );

  const emailVerified = subData?.users?.[0]?.email_verified;
  // --- End Subscription ---

  const handleSignOut = async () => {
    // Call standard signOut
    // Specify callbackUrl to return to homepage on localhost after signing out from Vercel
    hasyx.logout();
  };

  // If user is not authenticated, show original content without tabs
  if (!hasyx?.userId || loading) {
    return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Session & OAuth</CardTitle>
          <CardDescription>View session status and sign in using OAuth providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label>Client Session status (useSession().user.id())</Label>
            {loading && <p className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading session...</p>}
            {!session && !loading && <p>Not signed in</p>}
          </div>
          <div className="grid w-full items-center gap-2">
            <Label>Sign In with OAuth</Label>
            <OAuthButtons />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is authenticated, show tabs
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Session & OAuth</CardTitle>
        <CardDescription>View session status and manage your connected accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auth">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>
          <TabsContent value="auth" className="mt-4 space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label>Client Session Status (useSession().user.id)</Label>
              <div className="flex items-center space-x-2 flex-wrap">
                {/* Email Verification Status from Subscription */}
                {userId && (
                  <span className="flex items-center">
                    {subLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {subError && <span className="text-xs text-red-500" title={subError.message}>Error loading status</span>}
                    {!subLoading && !subError && emailVerified && (
                       <span 
                        title={`Email verified at ${new Date(emailVerified).toLocaleString()}`}
                        className="mr-2 px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center"
                      >
                        <MailCheck className="mr-1 h-3 w-3" /> Verified
                      </span>
                    )}
                     {!subLoading && !subError && !emailVerified && (
                       <span 
                        title="Email not verified. Check your inbox or spam folder for the verification email."
                        className="mr-2 px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center"
                      >
                         <MailWarning className="mr-1 h-3 w-3" /> Not Verified
                         {/* TODO: Add Resend Button Here */}
                      </span>
                    )}
                  </span>
                )}
                {/* User Avatar */}
                {session?.user?.image && (
                  <Image
                    src={session?.user.image}
                    alt={session?.user.name || 'User avatar'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                {/* User Name/Email */}
                <span>Signed in as {session?.user?.name || session?.user?.email} {session?.provider ? `(${session.provider})` : ''}</span>
              </div>
            </div>

            <div className="grid w-full items-center gap-2">
              <Label>Sign Out</Label>
              <Button onClick={handleSignOut} disabled={loading}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="accounts" className="mt-4">
            <div className="max-h-[400px] overflow-y-auto">
              <Accounts userId={userId} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 