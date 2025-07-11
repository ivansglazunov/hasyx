"use client"

import { useCreateApolloClient } from './apollo';
import { ThemeProvider } from "hasyx/components/theme-provider";
import { url, API_URL } from 'hasyx/lib/url';
import { SessionProvider, useSession as useSessionNextAuth } from "next-auth/react";
import { useMemo, createContext, useContext, useEffect, useState } from "react";
import Debug from './debug';
import { Generate } from './generator';
import { Hasyx } from './hasyx';
import { NotificationProvider } from '../components/notify';
import { Analytics } from "@vercel/analytics/next"
import { HasyxClient } from './hasyx-client';
import { TelegramMiniappProvider, useTelegramMiniapp } from './telegram-miniapp';
import { JwtAuthProvider } from '../components/jwt-auth';

const debug = Debug('provider');

// Create Hasyx context
const HasyxContext = createContext<Hasyx | null>(null);

// Hook to get Hasyx instance from context
export function useHasyx(): Hasyx {
  const hasyx = useContext(HasyxContext);
  if (!hasyx) {
    throw new Error('useHasyx must be used within a HasyxProvider');
  }
  return hasyx;
}

// Alias for compatibility
export const useClient = useHasyx;

// Re-export useTelegramMiniapp for easy access throughout the app
export { useTelegramMiniapp };

function HasyxProviderCore({ url: urlOverride, children, generate }: { url?: string, children: React.ReactNode, generate: Generate }) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [jwtUser, setJwtUser] = useState<any>(null);
  
  // Check for JWT mode and monitor localStorage changes
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_JWT_AUTH || typeof window === 'undefined') return;
    
    const checkJwtAuth = () => {
      const jwt = localStorage.getItem('nextauth_jwt');
      if (jwt !== jwtToken) {
        setJwtToken(jwt);
        
        // Parse JWT to extract user info
        if (jwt) {
          try {
            const [, payloadB64] = jwt.split('.');
            const payload = JSON.parse(atob(payloadB64)); // Use atob for browser compatibility
            const hasuraClaims = payload['https://hasura.io/jwt/claims'];
            
            if (hasuraClaims) {
              const user = {
                id: hasuraClaims['x-hasura-user-id'],
                name: payload.name || null,
                email: payload.email || null,
                image: payload.picture || payload.image || null,
              };
              setJwtUser(user);
              debug('JWT user extracted from JWT:', user);
            }
          } catch (error) {
            debug('Error parsing JWT:', error);
            setJwtUser(null);
          }
        } else {
          setJwtUser(null);
        }
      }
    };
    
    // Initial check
    checkJwtAuth();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nextauth_jwt') {
        checkJwtAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const interval = setInterval(checkJwtAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [jwtToken]);

  const apolloClient = useCreateApolloClient(useMemo(() => {
    // Determine if current domain is localhost
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );

    // Define the base API URL (GraphQL endpoint)
    let apiUrl: string;
    if (isLocalhost && !urlOverride) {
      // Local development without override - use API_URL with http
      apiUrl = url('http', API_URL, '/api/graphql');
    } else if (urlOverride) {
      // Override URL provided - use it with appropriate protocol
      apiUrl = url('http', urlOverride, '/api/graphql');
    } else {
      // Production/Preview - use API_URL with appropriate protocol  
      apiUrl = url('http', API_URL, '/api/graphql');
    }
    
    debug(`HasyxProviderCore: Final API URL: ${apiUrl}, isLocalhost: ${isLocalhost}, based on urlOverride: ${urlOverride}`);
    debug(`HasyxProviderCore: JWT token: ${jwtToken ? 'present' : 'none'}`);
    
    return {
      url: apiUrl,
      ws: typeof window !== 'undefined', // Enable WebSocket support
      token: jwtToken || undefined, // Use JWT if available
    };
  }, [urlOverride, jwtToken]));
  
  // Keep the generator on Apollo client for compatibility
  apolloClient.hasyxGenerator = generate;

  // Create Hasyx instance when Apollo client changes
  const hasyxInstance = useMemo(() => {
    debug('Creating new Hasyx instance with Apollo client');
    return new HasyxClient(apolloClient, generate);
  }, [apolloClient, generate]);

  // Get session and update hasyx user when session changes
  const { data: session } = useSessionNextAuth();
  
  useEffect(() => {
    if (hasyxInstance) {
      // In JWT mode, prefer JWT user over session user
      const effectiveUser = (process.env.NEXT_PUBLIC_JWT_AUTH && jwtUser) 
        ? jwtUser 
        : (session?.user || null);
        
      hasyxInstance.user = effectiveUser;
      debug('Updated hasyx user:', effectiveUser);
      debug('Source:', process.env.NEXT_PUBLIC_JWT_AUTH && jwtUser ? 'jwt' : 'session');
    }
  }, [hasyxInstance, session?.user, jwtUser]);

  // @ts-ignore
  global.hasyx = hasyxInstance;

  return (
    <apolloClient.Provider>
      <HasyxContext.Provider value={hasyxInstance}>
        {children}
      </HasyxContext.Provider>
    </apolloClient.Provider>
  );
}

export function HasyxProvider({ children, generate }: { children: React.ReactNode, generate: Generate }) {
  // Use enhanced url function for auth base path
  const authBasePath = url('http', API_URL, '/api/auth');

  return (
    // SessionProvider is needed for signIn/signOut calls
    <SessionProvider basePath={authBasePath}>
      <TelegramMiniappProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JwtAuthProvider>
          <HasyxProviderCore generate={generate}>
            <Analytics/>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </HasyxProviderCore>  
          </JwtAuthProvider>
        </ThemeProvider>
      </TelegramMiniappProvider>
    </SessionProvider>
  );
} 