'use client';

import { ClientLayout as HasyxClientLayout } from 'hasyx/components/client-layout';
import { useLocaleClient } from 'hasyx/components/locale-switcher';
import { i18nMessages } from '@/lib/i18n/messages';

export function AppClientLayout(props: {
  defaultLocale: string;
  schema: any;
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  const { defaultLocale, schema, children, defaultTheme } = props;
  const { locale } = useLocaleClient(defaultLocale);
  const messages = i18nMessages(locale);
  return (
    <HasyxClientLayout defaultLocale={defaultLocale} defaultTheme={defaultTheme} schema={schema} messages={messages}>
      {children}
    </HasyxClientLayout>
  );
}


