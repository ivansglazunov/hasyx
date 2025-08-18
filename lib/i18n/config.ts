import { getRequestConfig } from 'next-intl/server';
import { getLocale } from 'hasyx/lib/i18n/index';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = getLocale();
 
  return {
    locale,
    timeZone: 'UTC',
    messages: (await import(`../../i18n/${locale}.json`)).default
  };
}); 