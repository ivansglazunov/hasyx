import { useTranslations as useNextTranslations } from 'next-intl';

export function useTranslations(...args: Parameters<typeof useNextTranslations>) {
  return useNextTranslations(...args);
}