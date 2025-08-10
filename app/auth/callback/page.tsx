'use client';

import { useAuthCallback, AuthCallbackCompleting, AuthCallbackError } from '@/lib/users/auth-callback';

export default function AuthCallbackPage() {
  const callbackState = useAuthCallback();

  switch (callbackState.status) {
    case 'loading':
    case 'completing':
      return <AuthCallbackCompleting />;
    case 'error':
      return <AuthCallbackError />;
    default:
      return <AuthCallbackCompleting />;
  }
} 