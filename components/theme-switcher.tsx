"use client";

import { Button } from "hasyx/components/ui/button";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useTranslations } from "hasyx";

export function ThemeSwitcher(props: any) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useNextTheme();
  const t = useTranslations('hasyx');

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!mounted) {
  //   // You can return a placeholder or null here
  //   // For a button, it's often fine to return null or a skeleton
  //   return <div {...props} style={{ width: '58px', height: '40px' }} />; // Placeholder with similar size
  // }

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
