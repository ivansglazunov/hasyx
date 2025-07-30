// Server-side locale hook - no client dependencies
export function useLocaleServer(defaultLocale: string = 'en') {
  return { 
    locale: defaultLocale, 
    setLocale: () => {} // No-op for server
  };
} 