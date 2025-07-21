'use client';

import { Button } from "hasyx/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "hasyx/components/ui/card";
import { Input } from "hasyx/components/ui/input";
import { Label } from "hasyx/components/ui/label";
import { KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useJwt } from '../jwt-auth';
import { API_URL } from 'hasyx/lib/url';

export function CredentialsSignInCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const jwtClient = useJwt();
  const isJwtMode = !!+process.env.NEXT_PUBLIC_JWT_AUTH!;
  
  // State for credentials form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // State for info/success messages
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  const handleCredentialsSignIn = async () => {
    setError(null); // Clear previous error
    setInfoMessage(null); // Clear previous info message
    setIsCredentialsLoading(true);
    
    try {
      if (isJwtMode) {
        // JWT mode - use standard NextAuth signIn with JWT parameter
        const currentUrl = window.location.href;
        localStorage.setItem('nextauth_jwt_redirect', currentUrl);
        localStorage.setItem('nextauth_jwt_id', jwtClient.id);
        
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: `/?jwt=${jwtClient.id}`,
        });
        
        if (result?.error) {
          setError('Invalid credentials');
        } else if (result?.ok) {
          setInfoMessage('Authentication initiated. Waiting for completion...');
          setEmail('');
          setPassword('');
          jwtClient.start();
        }
        
      } else {
        // Regular credentials flow
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        if (result?.error) {
          setError('Invalid credentials');
        } else if (result?.ok) {
          setInfoMessage('Authentication successful!');
          setEmail('');
          setPassword('');
          // Redirect after successful login
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Credentials sign-in error:', error);
      setError('An error occurred during sign-in');
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          Login
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCredentialsLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isCredentialsLoading}
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          {infoMessage && (
            <div className="text-blue-500 text-sm">
              {infoMessage}
            </div>
          )}
          
          <Button 
            type="button" 
            className="w-full" 
            onClick={handleCredentialsSignIn}
            disabled={isCredentialsLoading}
          >
            {isCredentialsLoading ? 'Signing in...' : 'Login'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 