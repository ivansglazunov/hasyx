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
      console.log('JWT authentication completed, JWT saved to localStorage');
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
    if (!!+process.env.NEXT_PUBLIC_JWT_AUTH!) {
      initJwtClient();
    }
  }, []);
  
  return <>{children}</>;
} 