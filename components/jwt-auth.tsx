'use client';

import { createContext, useContext, useEffect } from 'react';
import { JwtClient, initJwtClient } from 'hasyx/lib/jwt-auth';

// Create context with JwtClient instance
const JwtContext = createContext<JwtClient>(
  new JwtClient({
    onDone: (jwt: string) => {
      // Default handler - save JWT to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nextauth_jwt', jwt);
      }
    }
  })
);

// Hook to access JwtClient instance
export function useJwt(): JwtClient {
  const client = useContext(JwtContext);
  
  // Auto-init JWT client on mount if needed
  useEffect(() => {
    if (!!+process.env.NEXT_PUBLIC_JWT_AUTH!) {
      initJwtClient();
    }
  }, []);
  
  return client;
}

// Component to wrap your app for JWT auth support
export function JwtAuthProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Check for JWT_FORCE mode first
    if (!!+process.env.NEXT_PUBLIC_JWT_FORCE!) {
      // Force JWT retrieval - this ensures JWT is always available
      const forceJwtRetrieval = async () => {
        try {
          // Check if JWT already exists
          const existingJwt = localStorage.getItem('nextauth_jwt');
          if (!existingJwt) {
            // Request JWT from server
            const response = await fetch('/api/auth/get-jwt', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.token) {
                localStorage.setItem('nextauth_jwt', data.token);
                // Trigger storage event for other components
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'nextauth_jwt',
                  newValue: data.token,
                  oldValue: null
                }));
              }
            }
          }
        } catch (error) {
          console.error('Failed to force JWT retrieval:', error);
        }
      };

      forceJwtRetrieval();
    }
    
    // Regular JWT auth initialization
    if (!!+process.env.NEXT_PUBLIC_JWT_AUTH!) {
      initJwtClient();
    }
  }, []);
  
  return <>{children}</>;
} 