// Theme definitions for the app
export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
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
    id: 'default',
    name: '默认嗨呀粉',
    description: '清新少女感，温馨可爱的粉橙色调',
    price: 0,
    preview: {
      primary: '#ea580c',
      background: '#fffbf5',
      accent: '#fef3c7',
    },
    gradient: 'linear-gradient(135deg, #fff5f7 0%, #ffe4e8 50%, #fed7aa 100%)',
    cssVariables: {
      light: {
        '--primary': '20 90% 48%',
        '--primary-foreground': '33 100% 96%',
        '--accent': '47 100% 96%',
        '--accent-foreground': '37 92% 50%',
        '--chart-1': '27 95% 60%',
      },
      dark: {
        '--primary': '27 95% 60%',
        '--primary-foreground': '12 81% 14%',
        '--accent': '20 91% 14%',
        '--accent-foreground': '43 96% 56%',
        '--chart-1': '30 97% 72%',
      },
    },
  },
  {
    id: 'midnight-blue',
    name: '静谧午夜蓝',
    description: '暗色模式，带深蓝色渐变，宁静深邃',
    price: 6,
    preview: {
      primary: '#6366f1',
      background: '#1e1b4b',
      accent: '#312e81',
    },
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    cssVariables: {
      light: {
        '--primary': '239 84% 67%',
        '--primary-foreground': '226 100% 97%',
        '--accent': '244 47% 20%',
        '--accent-foreground': '243 75% 59%',
        '--chart-1': '245 58% 51%',
      },
      dark: {
        '--primary': '239 84% 67%',
        '--primary-foreground': '226 100% 97%',
        '--accent': '244 47% 20%',
        '--accent-foreground': '243 75% 59%',
        '--chart-1': '245 58% 51%',
      },
    },
  },
  {
    id: 'dopamine-green',
    name: '多巴胺嫩绿',
    description: '明快活泼，充满能量的清新绿色',
    price: 6,
    preview: {
      primary: '#22c55e',
      background: '#f0fdf4',
      accent: '#bbf7d0',
    },
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    cssVariables: {
      light: {
        '--primary': '142 71% 45%',
        '--primary-foreground': '138 76% 97%',
        '--accent': '141 79% 85%',
        '--accent-foreground': '142 76% 36%',
        '--chart-1': '142 69% 58%',
      },
      dark: {
        '--primary': '142 69% 58%',
        '--primary-foreground': '144 61% 10%',
        '--accent': '143 64% 20%',
        '--accent-foreground': '141 79% 85%',
        '--chart-1': '142 71% 45%',
      },
    },
  },
  {
    id: 'starry-purple',
    name: '幻彩星空紫',
    description: '神秘浪漫，带有星星点缀的梦幻紫色',
    price: 6,
    preview: {
      primary: '#a855f7',
      background: '#faf5ff',
      accent: '#e9d5ff',
    },
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
    cssVariables: {
      light: {
        '--primary': '271 91% 65%',
        '--primary-foreground': '270 100% 98%',
        '--accent': '270 95% 91%',
        '--accent-foreground': '271 81% 56%',
        '--chart-1': '272 91% 65%',
      },
      dark: {
        '--primary': '271 91% 65%',
        '--primary-foreground': '273 67% 10%',
        '--accent': '272 47% 25%',
        '--accent-foreground': '270 95% 91%',
        '--chart-1': '272 91% 65%',
      },
    },
  },
  {
    id: 'sunset-orange',
    name: '日落晚霞橙',
    description: '温暖疗愈，如日落般的橙黄渐变',
    price: 6,
    preview: {
      primary: '#f97316',
      background: '#fffbeb',
      accent: '#fed7aa',
    },
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)',
    cssVariables: {
      light: {
        '--primary': '25 95% 53%',
        '--primary-foreground': '33 100% 96%',
        '--accent': '27 96% 83%',
        '--accent-foreground': '21 90% 48%',
        '--chart-1': '33 95% 55%',
      },
      dark: {
        '--primary': '25 95% 53%',
        '--primary-foreground': '20 14% 4%',
        '--accent': '20 91% 18%',
        '--accent-foreground': '27 96% 83%',
        '--chart-1': '33 95% 55%',
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
