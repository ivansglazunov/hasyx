'use client';

import { HasyxProvider } from "hasyx";
import { PWAInstallPrompt, PWAStatus } from "hasyx/components/pwa-install-prompt";
import { useLocaleClient } from "hasyx/components/locale-switcher";
import { NextIntlClientProvider } from 'next-intl';
import { Eruda } from "hasyx/lib/eruda";
import { Generator } from "hasyx";
import { useMemo } from "react";

interface ClientLayoutProps {
  defaultLocale: string;
  schema: any;
  messages: any;
  children: React.ReactNode;
}

export function ClientLayout({ defaultLocale, schema, messages, children }: ClientLayoutProps) {
  const { locale, setLocale } = useLocaleClient(defaultLocale);
  const generate = useMemo(() => {
    return Generator(schema);
  }, []);
  
  return (
    <HasyxProvider generate={generate}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
        {/* PWA Components - must be inside NextIntl provider to use translations */}
        <PWAInstallPrompt />
        <PWAStatus />
        <Eruda />
      </NextIntlClientProvider>
    </HasyxProvider>
  );
} 