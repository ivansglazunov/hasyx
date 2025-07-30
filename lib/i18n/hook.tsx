import { useTranslations as useNextTranslations } from 'next-intl';

// Global configuration for next-intl
export const timeZone = 'UTC';

export function useTranslations(...args: Parameters<typeof useNextTranslations>) {
  return useNextTranslations(...args);
}