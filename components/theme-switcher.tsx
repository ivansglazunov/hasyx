"use client";

import { Button } from "hasyx/components/ui/button";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useTranslations } from "hasyx";

export function ThemeSwitcher(props: any) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useNextTheme();
  const t = useTranslations('theme');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder during SSR to avoid hydration issues
    return <div {...props} style={{ width: '58px', height: '40px' }} />;
  }

  return (
    <Button {...props} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? t('light') : t('dark')}
    </Button>
  )
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  return { theme, setTheme };
}
