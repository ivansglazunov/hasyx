"use client"

import { useCreateApolloClient } from './apollo/apollo';
import { ThemeProvider } from "hasyx/components/theme-provider";
import { url, API_URL } from 'hasyx/lib/url';
import { SessionProvider, useSession as useSessionNextAuth } from "next-auth/react";
import { useMemo, createContext, useContext, useEffect, useState } from "react";
import { create } from 'zustand';
import Debug from './debug';
import { Generate } from './generator';
import { Hasyx } from './hasyx/hasyx';
import { NotificationProvider } from '../components/notify';
import { Analytics } from "@vercel/analytics/next"
import { HasyxClient } from './hasyx/hasyx-client';
import { TelegramMiniappProvider, useTelegramMiniapp } from './telegram/telegram-miniapp';
import { JwtAuthProvider } from '../components/jwt-auth';
import { signOut, signIn } from "next-auth/react";

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

type ImpersonationState = {
  originalJwt: string | null;
  originalUserInfo: { id?: string | null; name?: string | null } | null;
  setOriginal(jwt: string | null, info: { id?: string | null; name?: string | null } | null): void;
  clearOriginal(): void;
};

const useImpersonationStore = create<ImpersonationState>((set) => ({
  originalJwt: null,
  originalUserInfo: null,
  setOriginal: (jwt, info) => set({ originalJwt: jwt, originalUserInfo: info }),
  clearOriginal: () => set({ originalJwt: null, originalUserInfo: null })
}));

function HasyxProviderCore({ url: urlOverride, children, generate }: { url?: string, children: React.ReactNode, generate: Generate }) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [jwtUser, setJwtUser] = useState<any>(null);
  const { originalJwt, originalUserInfo, setOriginal, clearOriginal } = useImpersonationStore();
  
  // Check for JWT mode and monitor localStorage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const base64UrlDecode = (input: string) => {
      try {
        // Convert base64url -> base64
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4 !== 0) base64 += '=';
        return atob(base64);
      } catch (e) {
        throw e;
      }
    };

    const checkJwtAuth = () => {
      const jwt = localStorage.getItem('nextauth_jwt');
      if (jwt !== jwtToken) {
        setJwtToken(jwt);
        
        // Parse JWT to extract user info
        if (jwt) {
          try {
            const [, payloadB64] = jwt.split('.');
            const payloadJson = base64UrlDecode(payloadB64);
            const payload = JSON.parse(payloadJson);
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
          debug('JWT user not found');
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
    let useWebSockets = typeof window !== 'undefined';
    
    const jwtAuthEnabled = (!!+process.env.NEXT_PUBLIC_JWT_AUTH!);
    const jwtForceEnabled = (!!+process.env.NEXT_PUBLIC_JWT_FORCE!);
    if (jwtToken || jwtAuthEnabled || jwtForceEnabled) {
      debug('Creating new Apollo client with JWT token:', jwtToken);
      // When JWT is available, use Hasura GraphQL URL directly for WebSocket support
      apiUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;
      useWebSockets = true; // Force WebSocket for JWT/force mode
      
    } else if (isLocalhost && !urlOverride) {
      // Local development without override - use API_URL with http
      debug('Creating new Apollo client using API_URL:', API_URL);
      apiUrl = url('http', API_URL, '/api/graphql');
      
    } else if (urlOverride) {
      // Override URL provided - use it with appropriate protocol
      debug('Creating new Apollo client with urlOverride:', urlOverride);
      apiUrl = url('http', urlOverride, '/api/graphql');
      
    } else {
      // Production/Preview - use API_URL with appropriate protocol  
      debug('Creating new Apollo client using API_URL:', API_URL);
      apiUrl = url('http', API_URL, '/api/graphql');
      
    }
    
    debug(`HasyxProviderCore: Final API URL: ${apiUrl}, isLocalhost: ${isLocalhost}, based on urlOverride: ${urlOverride}`);
    debug(`HasyxProviderCore: JWT token: ${jwtToken ? 'present' : 'none'}`);
    debug(`HasyxProviderCore: WebSocket enabled: ${useWebSockets}`);
    
    const apolloOpts = {
      url: apiUrl,
      ws: useWebSockets,
      token: jwtToken || undefined, // Use JWT if available
    };
    
    return apolloOpts;
  }, [urlOverride, jwtToken]));
  
  // Keep the generator on Apollo client for compatibility
  apolloClient.hasyxGenerator = generate;

  // Get session and update hasyx user when session changes
  const { data: session } = useSessionNextAuth();

  // Create Hasyx instance when Apollo client changes
  const hasyxInstance = useMemo(() => {
    debug('Creating new Hasyx instance with Apollo client');
    const hasyxInstance = new HasyxClient(apolloClient, generate);
    // also expose on window for debugging
    try { (window as any).hasyx = hasyxInstance; } catch {}
    // In JWT mode, prefer JWT user over session user
    const effectiveUser = jwtUser
      ? jwtUser 
      : (session?.user || null);
      
    hasyxInstance.user = effectiveUser;
    
    
    // Override the jwt method to trigger Hasyx rebuild
    const originalJwt = hasyxInstance.jwt.bind(hasyxInstance);
    hasyxInstance.jwt = async function() {
      
      const token = await originalJwt();
      // After getting JWT, update state to trigger rebuild
      setJwtToken(token);
      
      return token;
    };

    // Impersonation helpers exposed on Hasyx instance
    (hasyxInstance as any).impersonate = async (userId: string) => {
      try {
        const current = localStorage.getItem('nextauth_jwt');
        if (current && !originalJwt) {
          // Save original before switching
          const [, payloadB64] = current.split('.');
          const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
          const payload = JSON.parse(payloadJson);
          const name = payload?.name || null;
          setOriginal(current, { id: jwtUser?.id ?? null, name });
          localStorage.setItem('hasyx_impersonator_jwt', current);
          localStorage.setItem('hasyx_impersonator_info', JSON.stringify({ id: jwtUser?.id ?? null, name }));
        }
        const resp = await fetch('/api/auth/get-jwt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asUserId: userId })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err?.error || `HTTP ${resp.status}`);
        }
        const data = await resp.json();
        const newJwt = data.jwt as string;
        localStorage.setItem('nextauth_jwt', newJwt);
        setJwtToken(newJwt);
        // Force WS reconnect to apply new auth
        try { (hasyxInstance.apolloClient as any)?.reconnectWebSocket?.(); } catch {}
        try {
          window.dispatchEvent(new StorageEvent('storage', { key: 'nextauth_jwt', newValue: newJwt }));
        } catch {}
        return true;
      } catch (e) {
        debug('Impersonation failed:', e);
        return false;
      }
    };

    (hasyxInstance as any).stopImpersonation = () => {
      const saved = localStorage.getItem('hasyx_impersonator_jwt');
      if (saved) {
        localStorage.setItem('nextauth_jwt', saved);
        setJwtToken(saved);
        try {
          window.dispatchEvent(new StorageEvent('storage', { key: 'nextauth_jwt', newValue: saved }));
        } catch {}
      }
      localStorage.removeItem('hasyx_impersonator_jwt');
      localStorage.removeItem('hasyx_impersonator_info');
      clearOriginal();
    };

    // no alias here to avoid recursion
    
    hasyxInstance.logout = (options?: any) => {
      const jwt = localStorage.getItem('nextauth_jwt');
      if (jwt) {
        debug('Logging out with JWT');
        localStorage.removeItem('nextauth_jwt');
        localStorage.removeItem('hasyx_impersonator_jwt');
        localStorage.removeItem('hasyx_impersonator_info');
        clearOriginal();
        setJwtToken(null);
        setJwtUser(null);
        try {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'nextauth_jwt',
            newValue: null,
            oldValue: jwt,
          }));
        } catch {}
        
      } else {
        debug('Logging out with session');
        signOut(options);
        
      }
    };
    return hasyxInstance;
  }, [apolloClient, generate, session, jwtUser]);

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

export function HasyxProvider({
  children,
  generate,
  defaultTheme = 'system',
}: {
  children: React.ReactNode,
  generate: Generate,
  defaultTheme?: string
}) {
  // Use enhanced url function for auth base path
  const authBasePath = url('http', API_URL, '/api/auth');

  useEffect(() => {
    console.log('process.env.NEXT_PUBLIC_JWT_AUTH', process.env.NEXT_PUBLIC_JWT_AUTH);
    console.log('process.env.NEXT_PUBLIC_MAIN_URL', process.env.NEXT_PUBLIC_MAIN_URL);
    console.log('process.env.NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
    console.log('process.env.NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);
    console.log('process.env.NEXT_PUBLIC_CLIENT_ONLY', process.env.NEXT_PUBLIC_CLIENT_ONLY);
    console.log('process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL', process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL);
    console.log('process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED', process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_TELEGRAM_AUTH_ENABLED', process.env.NEXT_PUBLIC_TELEGRAM_AUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED', process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED', process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_YANDEX_AUTH_ENABLED', process.env.NEXT_PUBLIC_YANDEX_AUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED', process.env.NEXT_PUBLIC_FACEBOOK_AUTH_ENABLED);
    console.log('process.env.NEXT_PUBLIC_VK_AUTH_ENABLED', process.env.NEXT_PUBLIC_VK_AUTH_ENABLED);
  }, []);

  return (
    // SessionProvider is needed for signIn/signOut calls
    <SessionProvider basePath={authBasePath}>
      <TelegramMiniappProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
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