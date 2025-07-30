"use client";

import { Button } from "hasyx/components/ui/button";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import { create } from 'zustand';

import { useTranslations } from "hasyx";
import { cn } from "hasyx/lib/utils";

export interface LocaleStore {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale }),
}));

export function LocaleSwitcher(props: any) {
  const { locale, setLocale } = useLocaleStore();
  const t = useTranslations('hasyx');

  return (<div {...props}>
    <Button className="w-full" onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}>
      {locale} ➤ {locale === 'en' ? 'ru' : 'en'}
    </Button>
  </div>)
}

export function useLocaleServer(defaultLocale: string = 'en') {
  return { 
    locale: defaultLocale, 
    setLocale: () => {} // No-op for server
  };
}

export function useLocaleClient(defaultLocale: string = 'en') {
  const { locale, setLocale } = useLocaleStore();
  useEffect(() => {
    if (!locale) setLocale(defaultLocale);
  }, [defaultLocale]);
  return { locale, setLocale };
}

// Export the appropriate hook based on environment
// For Next.js, we need to be more explicit about server vs client
export const useLocale = (defaultLocale: string = 'en') => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return useLocaleClient(defaultLocale);
  }
  return useLocaleServer(defaultLocale);
};
