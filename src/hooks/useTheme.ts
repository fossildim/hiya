import { useEffect, useState } from 'react';
import { applyTheme, getThemeById } from '@/lib/themes';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('haiya_theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applySystemTheme = (resolvedTheme: 'light' | 'dark') => {
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);

      // Also apply the user's selected color theme
      const savedSettings = localStorage.getItem('haiya_settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          const colorThemeId = settings.currentTheme || 'white-orange';
          const colorTheme = getThemeById(colorThemeId);
          if (colorTheme) {
            const vars =
              resolvedTheme === 'dark'
                ? colorTheme.cssVariables.dark
                : colorTheme.cssVariables.light;
            Object.entries(vars).forEach(([key, value]) => {
              root.style.setProperty(key, value);
            });
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applySystemTheme(mediaQuery.matches ? 'dark' : 'light');
      };

      handleChange(); // Apply immediately
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applySystemTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('haiya_theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
