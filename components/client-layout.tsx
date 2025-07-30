'use client';

import { HasyxProvider } from "hasyx";
import { PWAInstallPrompt, PWAStatus } from "hasyx/components/pwa-install-prompt";
import { useLocaleClient } from "hasyx/components/locale-switcher";
import { NextIntlClientProvider } from 'next-intl';
import { i18nMessages } from 'hasyx/lib/i18n/messages';
import { Eruda } from "hasyx/lib/eruda";
import { Generator } from "hasyx";
import schema from "../public/hasura-schema.json";


interface ClientLayoutProps {
  defaultLocale: string;
  children: React.ReactNode;
}

export function ClientLayout({ defaultLocale, children }: ClientLayoutProps) {
  const { locale, setLocale } = useLocaleClient(defaultLocale);
  const generate = Generator(schema);
  
  return (
    <HasyxProvider generate={generate}>
      <NextIntlClientProvider locale={locale} messages={i18nMessages(locale)} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
      
      {/* PWA Components - available on all pages */}
      <PWAInstallPrompt />
      <PWAStatus />
      <Eruda />
    </HasyxProvider>
  );
} 