// import { getRequestConfig } from 'next-intl/server';
 
// export default getRequestConfig(async () => {
//   // Provide a static locale, fetch a user setting,
//   // read from `cookies()`, `headers()`, etc.
//   const locale = 'en';
 
//   return {
//     locale,
//     messages: (await import(`../../i18n/${locale}.json`)).default
//   };
// });

import * as en from '../../i18n/en.json';
import * as ru from '../../i18n/ru.json';

export const i18nMessages = (locale: string = 'en') => {
  switch (locale) {
    case 'en': return en;
    case 'ru': return ru;
    default: return en;
  }
}