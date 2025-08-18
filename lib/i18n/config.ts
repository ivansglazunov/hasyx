import { getRequestConfig } from 'next-intl/server';
// Try to obtain locale from env to minimize runtime resolution differences in CI
const locale = process.env.NEXT_PUBLIC_LOCALE || 'en';

export default getRequestConfig(async () => {
  return {
    locale,
    timeZone: 'UTC',
    messages: (await import(`../../i18n/${locale}.json`)).default
  };
});