'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Debug from 'hasyx/lib/debug';

const debug = Debug('auth:jwt-signin');

function JwtSigninContent() {
  const searchParams = useSearchParams();
  const jwt = searchParams.get('jwt');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      debug('JWT signin error:', error);
      // Handle error case
      if (window.opener) {
        window.opener.postMessage({
          type: 'NEXTAUTH_SIGNIN_ERROR',
          error: error
        }, window.location.origin);
      }
      window.close();
      return;
    }

    if (jwt) {
      debug('JWT signin successful, notifying parent window');
      
      // Save the JWT ID to localStorage for the JWT client to use
      localStorage.setItem('nextauth_jwt_id', jwt);
      
      // Notify parent window that signin was successful
      if (window.opener) {
        window.opener.postMessage({
          type: 'NEXTAUTH_SIGNIN_SUCCESS',
          jwt: jwt
        }, window.location.origin);
      }
      
      // Close the popup
      window.close();
    }
  }, [jwt, error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">JWT Authentication</h1>
        {error ? (
          <div className="text-red-500">
            <p>Authentication failed: {error}</p>
            <p className="text-sm mt-2">This window will close automatically.</p>
          </div>
        ) : jwt ? (
          <div className="text-green-500">
            <p>Authentication successful!</p>
            <p className="text-sm mt-2">This window will close automatically.</p>
          </div>
        ) : (
          <div>
            <p>Processing authentication...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JwtSigninPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">JWT Authentication</h1>
          <div>
            <p>Loading...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <JwtSigninContent />
    </Suspense>
  );
} 