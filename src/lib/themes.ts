// Theme definitions for the app - 5 gradient themes
export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    background: string;
    accent: string;
  };
  gradient: string;
  cssVariables: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'white-orange',
    name: '白橙渐变',
    description: '默认主题，温暖活力的橙色调',
    preview: {
      primary: '#ea580c',
      background: '#fffbf5',
      accent: '#fef3c7',
    },
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 67%, #ea580c 100%)',
    cssVariables: {
      light: {
        '--primary': '20 90% 48%',
        '--primary-foreground': '33 100% 96%',
        '--accent': '47 100% 96%',
        '--accent-foreground': '37 92% 50%',
        '--chart-1': '27 95% 60%',
        '--chart-2': '43 96% 56%',
        '--chart-3': '47 95% 53%',
        '--chart-4': '24 94% 53%',
        '--ring': '20 90% 48%',
      },
      dark: {
        '--primary': '27 95% 60%',
        '--primary-foreground': '12 81% 14%',
        '--accent': '20 91% 14%',
        '--accent-foreground': '43 96% 56%',
        '--chart-1': '30 97% 72%',
        '--chart-2': '45 96% 64%',
        '--chart-3': '48 96% 76%',
        '--chart-4': '27 95% 60%',
        '--ring': '27 95% 60%',
      },
    },
  },
  {
    id: 'white-black',
    name: '白黑渐变',
    description: '简约经典，黑白极简风格',
    preview: {
      primary: '#1f2937',
      background: '#ffffff',
      accent: '#f3f4f6',
    },
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 67%, #1f2937 100%)',
    cssVariables: {
      light: {
        '--primary': '220 13% 18%',
        '--primary-foreground': '0 0% 98%',
        '--accent': '220 14% 96%',
        '--accent-foreground': '220 13% 18%',
        '--chart-1': '220 9% 46%',
        '--chart-2': '215 14% 34%',
        '--chart-3': '216 12% 54%',
        '--chart-4': '218 11% 65%',
        '--ring': '220 13% 18%',
      },
      dark: {
        '--primary': '0 0% 80%',
        '--primary-foreground': '220 13% 10%',
        '--accent': '220 13% 20%',
        '--accent-foreground': '0 0% 90%',
        '--chart-1': '0 0% 70%',
        '--chart-2': '0 0% 60%',
        '--chart-3': '0 0% 50%',
        '--chart-4': '0 0% 40%',
        '--ring': '0 0% 80%',
      },
    },
  },
  {
    id: 'white-red',
    name: '白红渐变',
    description: '热情洋溢，充满活力的红色调',
    preview: {
      primary: '#dc2626',
      background: '#fffbfb',
      accent: '#fee2e2',
    },
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 67%, #dc2626 100%)',
    cssVariables: {
      light: {
        '--primary': '0 72% 51%',
        '--primary-foreground': '0 86% 97%',
        '--accent': '0 93% 94%',
        '--accent-foreground': '0 72% 51%',
        '--chart-1': '0 84% 60%',
        '--chart-2': '0 74% 42%',
        '--chart-3': '0 65% 48%',
        '--chart-4': '0 91% 71%',
        '--ring': '0 72% 51%',
      },
      dark: {
        '--primary': '0 72% 60%',
        '--primary-foreground': '0 86% 10%',
        '--accent': '0 50% 15%',
        '--accent-foreground': '0 93% 85%',
        '--chart-1': '0 74% 65%',
        '--chart-2': '0 72% 50%',
        '--chart-3': '0 65% 55%',
        '--chart-4': '0 84% 75%',
        '--ring': '0 72% 60%',
      },
    },
  },
  {
    id: 'white-green',
    name: '白绿渐变',
    description: '清新自然，充满生机的绿色调',
    preview: {
      primary: '#16a34a',
      background: '#f0fdf4',
      accent: '#dcfce7',
    },
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 67%, #16a34a 100%)',
    cssVariables: {
      light: {
        '--primary': '142 71% 37%',
        '--primary-foreground': '138 76% 97%',
        '--accent': '141 79% 93%',
        '--accent-foreground': '142 71% 37%',
        '--chart-1': '142 69% 45%',
        '--chart-2': '142 76% 30%',
        '--chart-3': '141 64% 38%',
        '--chart-4': '142 77% 55%',
        '--ring': '142 71% 37%',
      },
      dark: {
        '--primary': '142 69% 50%',
        '--primary-foreground': '142 61% 10%',
        '--accent': '143 64% 15%',
        '--accent-foreground': '141 79% 85%',
        '--chart-1': '142 71% 55%',
        '--chart-2': '142 76% 40%',
        '--chart-3': '141 64% 48%',
        '--chart-4': '142 77% 65%',
        '--ring': '142 69% 50%',
      },
    },
  },
  {
    id: 'white-blue',
    name: '白蓝渐变',
    description: '宁静淡雅，清爽的蓝色调',
    preview: {
      primary: '#2563eb',
      background: '#eff6ff',
      accent: '#dbeafe',
    },
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 67%, #2563eb 100%)',
    cssVariables: {
      light: {
        '--primary': '221 83% 53%',
        '--primary-foreground': '214 100% 97%',
        '--accent': '214 95% 93%',
        '--accent-foreground': '221 83% 53%',
        '--chart-1': '221 83% 60%',
        '--chart-2': '224 76% 48%',
        '--chart-3': '217 91% 60%',
        '--chart-4': '213 94% 68%',
        '--ring': '221 83% 53%',
      },
      dark: {
        '--primary': '217 91% 60%',
        '--primary-foreground': '221 83% 10%',
        '--accent': '221 50% 15%',
        '--accent-foreground': '214 95% 85%',
        '--chart-1': '221 83% 65%',
        '--chart-2': '224 76% 55%',
        '--chart-3': '217 91% 65%',
        '--chart-4': '213 94% 75%',
        '--ring': '217 91% 60%',
      },
    },
  },
];

export const getThemeById = (id: string): ThemeDefinition | undefined => {
  return themes.find((t) => t.id === id);
};

export const applyTheme = (themeId: string) => {
  const theme = getThemeById(themeId);
  if (!theme) return;

  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const vars = isDark ? theme.cssVariables.dark : theme.cssVariables.light;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Get the gradient background based on theme
export const getThemeGradient = (themeId: string): string => {
  const theme = getThemeById(themeId);
  if (!theme) return 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 67%, hsl(var(--primary) / 0.3) 100%)';
  
  // Use primary color for gradient
  return `linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 67%, hsl(var(--primary) / 0.3) 100%)`;
};
