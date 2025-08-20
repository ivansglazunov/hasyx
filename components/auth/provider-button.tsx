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
        
        // Ensure we have a valid JWT ID before saving
        if (!jwtClient.id) {
          jwtClient.update();
        }
        
        debug(`Using JWT ID: ${jwtClient.id} for ${provider} authentication`);
        
        // Save JWT ID to localStorage so it can be accessed after OAuth redirect
        localStorage.setItem('nextauth_jwt_id', jwtClient.id);
        localStorage.setItem('nextauth_jwt_provider', provider);
        
        // Start polling immediately on the client
        jwtClient.start();

        // Build callbackUrl carrying jwtId and close flag so remote can complete and close itself
        const callbackUrl = `${API_URL}/auth/callback?jwtId=${encodeURIComponent(jwtClient.id)}&close=1`;
        // Open helper page that auto-submits POST to NextAuth (avoids provider chooser page)
        const helperUrl = `${API_URL}/api/auth/jwt-signin?provider=${encodeURIComponent(provider)}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
        debug(`Opening JWT helper signin URL:`, helperUrl);
        window.open(helperUrl, '_blank', 'width=600,height=700');
        
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