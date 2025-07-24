import { Button } from 'hasyx/components/ui/button';
import Debug from 'hasyx/lib/debug';
import { API_URL } from 'hasyx/lib/url';
import { signIn } from 'next-auth/react';
import React from 'react';
import { useJwt } from '../jwt-auth';

const debug = Debug('auth:provider-button');

interface ProviderButtonProps {
  provider: string;
  icon?: React.ReactElement;
  label: string;
  className?: string;
}

/**
 * Authorization button through provider, using the built-in signIn method from NextAuth.js
 * If user is already logged in, it will automatically link the new account to the existing user
 */
export function ProviderButton({ provider, icon, label, className }: ProviderButtonProps) {
  const jwtClient = useJwt();
  const isJwtMode = !!+process?.env?.NEXT_PUBLIC_JWT_AUTH!;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      if (isJwtMode) {
        debug(`Starting ${provider} authentication in JWT mode`);
        
        // Save JWT ID to localStorage so it can be accessed after OAuth redirect
        localStorage.setItem('nextauth_jwt_id', jwtClient.id);
        localStorage.setItem('nextauth_jwt_provider', provider);
        
        // Open standard NextAuth signin URL in new window
        const authUrl = `${API_URL}/api/auth/signin/${provider}`;
        debug(`Opening NextAuth signin URL:`, authUrl);
        
        // Open in new window/tab for JWT auth
        const authWindow = window.open(authUrl, '_blank', 'width=600,height=700');
        
        // Listen for messages from the auth window
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'NEXTAUTH_SIGNIN_SUCCESS') {
            debug('Received signin success message from auth window');
            // Start JWT client polling
            jwtClient.start();
            // Remove the message listener
            window.removeEventListener('message', messageListener);
            // Close auth window if still open
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
          }
        };
        
        window.addEventListener('message', messageListener);
        
        // Handle case when popup is blocked or closed manually
        const checkClosed = setInterval(() => {
          if (authWindow && authWindow.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            debug('Auth window was closed manually');
          }
        }, 1000);
        
        // Cleanup after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          if (authWindow && !authWindow.closed) {
            authWindow.close();
          }
        }, 5 * 60 * 1000);
        
      } else {
        // Regular NextAuth mode
        debug(`Starting ${provider} authentication in regular mode`);
        
        await signIn(provider);
      }
    } catch (error) {
      console.error(`Error during ${provider} authentication:`, error);
      debug(`Error during ${provider} authentication:`, error);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant="outline" 
      className={className}
      type="button"
    >
      {icon && <span className="mr-2 h-4 w-4 inline-block">{icon}</span>}
      {label}
    </Button>
  );
} 