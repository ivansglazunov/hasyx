'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'hasyx';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Debug from 'hasyx/lib/debug';

const debug = Debug('auth:callback');

export interface AuthCallbackState {
  status: 'loading' | 'completing' | 'error';
}

export const useAuthCallback = (): AuthCallbackState => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [callbackState, setCallbackState] = useState<AuthCallbackState>({ status: 'loading' });

  useEffect(() => {
    debug('AuthCallback hook mounted. Session status:', status);
    
    if (status === 'loading') {
      debug('Session still loading, waiting...');
      setCallbackState({ status: 'loading' });
      return;
    }
    
    if (status === 'authenticated' && session && !hasRedirected) {
      debug('User authenticated successfully, preparing redirect...');
      setCallbackState({ status: 'completing' });
      setHasRedirected(true);
      
      // Get JWT-related data from localStorage
      const jwtId = localStorage.getItem('nextauth_jwt_id');
      const jwtProvider = localStorage.getItem('nextauth_jwt_provider');
      
      debug('JWT callback data:', { jwtId, jwtProvider });
      
      // If we have JWT data, complete the JWT authentication
      if (jwtId && jwtProvider) {
        debug('Completing JWT authentication...');
        
        const completeJwtAuth = async () => {
          try {
            // Call the JWT complete endpoint
            const response = await fetch('/api/auth/jwt-complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({
                jwtId: jwtId,
              }),
            });
            
            if (response.ok) {
              debug('JWT authentication completed successfully');
              
              // Clean up localStorage
              localStorage.removeItem('nextauth_jwt_id');
              localStorage.removeItem('nextauth_jwt_provider');
              
              // Redirect to root or saved URL
              const savedUrl = localStorage.getItem('nextauth_jwt_redirect');
              if (savedUrl) {
                localStorage.removeItem('nextauth_jwt_redirect');
                window.location.href = savedUrl;
              } else {
                window.location.href = '/';
              }
            } else {
              debug('JWT authentication completion failed:', response.status);
              // Clean up localStorage on error
              localStorage.removeItem('nextauth_jwt_id');
              localStorage.removeItem('nextauth_jwt_provider');
              localStorage.removeItem('nextauth_jwt_redirect');
              
              // Show error or redirect to home
              window.location.href = '/?error=jwt-completion-failed';
            }
        } catch (error) {
            debug('Error completing JWT authentication:', error);
            // Clean up localStorage on error
            localStorage.removeItem('nextauth_jwt_id');
            localStorage.removeItem('nextauth_jwt_provider');
            localStorage.removeItem('nextauth_jwt_redirect');
          
            // Show error or redirect to home
            window.location.href = '/?error=jwt-completion-error';
          }
        };
          
        completeJwtAuth();
          return;
      }
      
      // Regular (non-JWT) authentication redirect
      const preAuthUrl = sessionStorage.getItem('preAuthUrl') || '/';
      sessionStorage.removeItem('preAuthUrl');
      
      debug('Redirecting to:', preAuthUrl);
      
      // Use Next.js router for client-side navigation
      router.replace(preAuthUrl);
      return;
    }
    
    if (status === 'unauthenticated') {
      debug('Authentication failed, setting error state');
      setCallbackState({ status: 'error' });
      return;
    }
  }, [status, session, router, hasRedirected]);

  return callbackState;
};

export const AuthCallbackCompleting = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">Completing authentication...</p>
    </div>
  );
};

export const AuthCallbackError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg text-red-600 mb-4">Authentication Error</p>
      <p className="text-muted-foreground mb-4">Something went wrong during authentication.</p>
      <p className="text-sm text-muted-foreground">
        You can try returning to the <a href="/" className="underline">homepage</a>.
      </p>
    </div>
  );
}; 