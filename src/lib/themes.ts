 // 10 Crazy Universe Themes - 疯狂宇宙主题系统
 
 export interface ThemeDefinition {
   id: string;
   name: string;
   description: string;
   emoji: string;
   decorations: string[];
   preview: {
     primary: string;
     background: string;
     accent: string;
   };
   gradient: string;
   bgGradient: string;
   cssVariables: {
     light: Record<string, string>;
     dark: Record<string, string>;
   };
 }
 
 export const themes: ThemeDefinition[] = [
   // 🔥 1. 爆裂红 (Red)
   {
     id: 'red',
     name: '🔥 爆裂红',
     description: '岩浆与热情',
     emoji: '🔥',
     decorations: ['🔥', '❤️', '💥', '🌋', '❤️‍🔥'],
     preview: {
       primary: '#DC2626',
       background: '#FEF2F2',
       accent: '#FCA5A5',
     },
     gradient: 'linear-gradient(180deg, #FEF2F2 0%, #FECACA 50%, #DC2626 100%)',
     bgGradient: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 25%, #F87171 50%, #EF4444 75%, #DC2626 100%)',
     cssVariables: {
       light: {
         '--primary': '0 72% 51%',
         '--primary-foreground': '0 86% 97%',
         '--accent': '0 93% 94%',
         '--accent-foreground': '0 72% 40%',
         '--ring': '0 72% 51%',
       },
       dark: {
         '--primary': '0 72% 60%',
         '--primary-foreground': '0 86% 10%',
         '--accent': '0 50% 20%',
         '--accent-foreground': '0 93% 85%',
         '--ring': '0 72% 60%',
       },
     },
   },
   // 🍊 2. 活力橙 (Orange) - Default
   {
     id: 'orange',
     name: '🍊 活力橙',
     description: '维他命炸弹',
     emoji: '🍊',
     decorations: ['🍊', '☀️', '✨', '🧡', '🔶'],
     preview: {
       primary: '#EA580C',
       background: '#FFFBF5',
       accent: '#FED7AA',
     },
     gradient: 'linear-gradient(180deg, #FFFBF5 0%, #FED7AA 50%, #EA580C 100%)',
     bgGradient: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 25%, #FDBA74 50%, #FB923C 75%, #F97316 100%)',
     cssVariables: {
       light: {
         '--primary': '20 90% 48%',
         '--primary-foreground': '33 100% 96%',
         '--accent': '32 98% 83%',
         '--accent-foreground': '20 90% 40%',
         '--ring': '20 90% 48%',
       },
       dark: {
         '--primary': '27 95% 60%',
         '--primary-foreground': '20 81% 14%',
         '--accent': '20 91% 20%',
         '--accent-foreground': '43 96% 70%',
         '--ring': '27 95% 60%',
       },
     },
   },
   // 🍋 3. 柠檬黄 (Yellow)
   {
     id: 'yellow',
     name: '🍋 柠檬黄',
     description: '酸甜电光',
     emoji: '🍋',
     decorations: ['🍋', '⚡️', '⭐️', '🌟', '💛'],
     preview: {
       primary: '#CA8A04',
       background: '#FEFCE8',
       accent: '#FDE68A',
     },
     gradient: 'linear-gradient(180deg, #FEFCE8 0%, #FDE68A 50%, #EAB308 100%)',
     bgGradient: 'linear-gradient(135deg, #FEF9C3 0%, #FDE68A 25%, #FACC15 50%, #EAB308 75%, #CA8A04 100%)',
     cssVariables: {
       light: {
         '--primary': '45 93% 40%',
         '--primary-foreground': '45 92% 10%',
         '--accent': '48 96% 76%',
         '--accent-foreground': '45 93% 30%',
         '--ring': '45 93% 40%',
       },
       dark: {
         '--primary': '48 96% 53%',
         '--primary-foreground': '45 93% 10%',
         '--accent': '45 80% 20%',
         '--accent-foreground': '48 96% 76%',
         '--ring': '48 96% 53%',
       },
     },
   },
   // 🌿 4. 幸运绿 (Green)
   {
     id: 'green',
     name: '🌿 幸运绿',
     description: '薄荷苏打水',
     emoji: '🍀',
     decorations: ['🍀', '🍃', '🥑', '🌱', '💚'],
     preview: {
       primary: '#16A34A',
       background: '#F0FDF4',
       accent: '#BBF7D0',
     },
     gradient: 'linear-gradient(180deg, #F0FDF4 0%, #BBF7D0 50%, #16A34A 100%)',
     bgGradient: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 25%, #86EFAC 50%, #4ADE80 75%, #22C55E 100%)',
     cssVariables: {
       light: {
         '--primary': '142 71% 37%',
         '--primary-foreground': '138 76% 97%',
         '--accent': '141 79% 85%',
         '--accent-foreground': '142 71% 30%',
         '--ring': '142 71% 37%',
       },
       dark: {
         '--primary': '142 69% 50%',
         '--primary-foreground': '142 71% 10%',
         '--accent': '142 64% 20%',
         '--accent-foreground': '141 79% 80%',
         '--ring': '142 69% 50%',
       },
     },
   },
   // 🧊 5. 极冰青 (Cyan)
   {
     id: 'cyan',
     name: '🧊 极冰青',
     description: '夏日泳池派对',
     emoji: '🧊',
     decorations: ['💧', '🧊', '🐬', '🌊', '💎'],
     preview: {
       primary: '#0891B2',
       background: '#ECFEFF',
       accent: '#A5F3FC',
     },
     gradient: 'linear-gradient(180deg, #ECFEFF 0%, #A5F3FC 50%, #06B6D4 100%)',
     bgGradient: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 25%, #67E8F9 50%, #22D3EE 75%, #06B6D4 100%)',
     cssVariables: {
       light: {
         '--primary': '189 94% 37%',
         '--primary-foreground': '183 100% 96%',
         '--accent': '187 92% 81%',
         '--accent-foreground': '189 94% 30%',
         '--ring': '189 94% 37%',
       },
       dark: {
         '--primary': '187 85% 53%',
         '--primary-foreground': '189 94% 10%',
         '--accent': '189 70% 20%',
         '--accent-foreground': '187 92% 80%',
         '--ring': '187 85% 53%',
       },
     },
   },
   // 🌊 6. 电光蓝 (Blue)
   {
     id: 'blue',
     name: '🌊 电光蓝',
     description: '深海狂想曲',
     emoji: '🐳',
     decorations: ['🐳', '🌊', '🎵', '💙', '🔵'],
     preview: {
       primary: '#2563EB',
       background: '#EFF6FF',
       accent: '#BFDBFE',
     },
     gradient: 'linear-gradient(180deg, #EFF6FF 0%, #BFDBFE 50%, #2563EB 100%)',
     bgGradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 25%, #93C5FD 50%, #60A5FA 75%, #3B82F6 100%)',
     cssVariables: {
       light: {
         '--primary': '221 83% 53%',
         '--primary-foreground': '214 100% 97%',
         '--accent': '213 97% 87%',
         '--accent-foreground': '221 83% 45%',
         '--ring': '221 83% 53%',
       },
       dark: {
         '--primary': '217 91% 60%',
         '--primary-foreground': '221 83% 12%',
         '--accent': '221 60% 20%',
         '--accent-foreground': '213 97% 82%',
         '--ring': '217 91% 60%',
       },
     },
   },
   // 🔮 7. 魔法紫 (Purple)
   {
     id: 'purple',
     name: '🔮 魔法紫',
     description: '银河独角兽',
     emoji: '🦄',
     decorations: ['🔮', '🦄', '🌙', '✨', '💜'],
     preview: {
       primary: '#9333EA',
       background: '#FAF5FF',
       accent: '#E9D5FF',
     },
     gradient: 'linear-gradient(180deg, #FAF5FF 0%, #E9D5FF 50%, #9333EA 100%)',
     bgGradient: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 25%, #D8B4FE 50%, #C084FC 75%, #A855F7 100%)',
     cssVariables: {
       light: {
         '--primary': '271 81% 56%',
         '--primary-foreground': '270 100% 98%',
         '--accent': '269 100% 92%',
         '--accent-foreground': '271 81% 45%',
         '--ring': '271 81% 56%',
       },
       dark: {
         '--primary': '270 76% 70%',
         '--primary-foreground': '271 81% 12%',
         '--accent': '271 60% 20%',
         '--accent-foreground': '269 100% 85%',
         '--ring': '270 76% 70%',
       },
     },
   },
   // 💖 8. 甜心粉 (Pink)
   {
     id: 'pink',
     name: '💖 甜心粉',
     description: '草莓泡泡糖',
     emoji: '🎀',
     decorations: ['🎀', '🍬', '🌸', '💕', '🍭'],
     preview: {
       primary: '#DB2777',
       background: '#FDF2F8',
       accent: '#FBCFE8',
     },
     gradient: 'linear-gradient(180deg, #FDF2F8 0%, #FBCFE8 50%, #EC4899 100%)',
     bgGradient: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 25%, #F9A8D4 50%, #F472B6 75%, #EC4899 100%)',
     cssVariables: {
       light: {
         '--primary': '330 81% 50%',
         '--primary-foreground': '327 73% 97%',
         '--accent': '326 78% 90%',
         '--accent-foreground': '330 81% 40%',
         '--ring': '330 81% 50%',
       },
       dark: {
         '--primary': '330 81% 65%',
         '--primary-foreground': '330 81% 10%',
         '--accent': '326 60% 20%',
         '--accent-foreground': '326 78% 85%',
         '--ring': '330 81% 65%',
       },
     },
   },
   // 🖤 9. 赛博黑 (Black) - Neon Night
   {
     id: 'black',
     name: '🖤 赛博黑',
     description: '五彩斑斓的黑',
     emoji: '👻',
     decorations: ['👻', '💣', '🎮', '🕹️', '💀'],
     preview: {
       primary: '#22C55E',
       background: '#0F172A',
       accent: '#1E293B',
     },
     gradient: 'linear-gradient(180deg, #1E293B 0%, #0F172A 50%, #020617 100%)',
     bgGradient: 'linear-gradient(135deg, #334155 0%, #1E293B 25%, #0F172A 50%, #020617 100%)',
     cssVariables: {
       light: {
         '--background': '222 47% 6%',
         '--foreground': '142 71% 45%',
         '--card': '222 47% 11%',
         '--card-foreground': '142 71% 45%',
         '--primary': '142 71% 45%',
         '--primary-foreground': '222 47% 6%',
         '--accent': '330 81% 60%',
         '--accent-foreground': '222 47% 6%',
         '--muted': '217 33% 17%',
         '--muted-foreground': '142 71% 45%',
         '--border': '142 71% 30%',
         '--input': '142 71% 20%',
         '--ring': '142 71% 45%',
       },
       dark: {
         '--background': '222 47% 6%',
         '--foreground': '142 71% 45%',
         '--card': '222 47% 11%',
         '--card-foreground': '142 71% 45%',
         '--primary': '142 71% 45%',
         '--primary-foreground': '222 47% 6%',
         '--accent': '330 81% 60%',
         '--accent-foreground': '222 47% 6%',
         '--muted': '217 33% 17%',
         '--muted-foreground': '142 71% 45%',
         '--border': '142 71% 30%',
         '--input': '142 71% 20%',
         '--ring': '142 71% 45%',
       },
     },
   },
   // 🦄 10. 全息白 (White) - Holographic
   {
     id: 'white',
     name: '🦄 全息白',
     description: '镭射独角兽',
     emoji: '🌈',
     decorations: ['🌈', '☁️', '💎', '🦋', '⭐'],
     preview: {
       primary: '#6366F1',
       background: '#FAFAFA',
       accent: '#F5F5F5',
     },
     gradient: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 50%, #E5E5E5 100%)',
     bgGradient: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 25%, #E5E5E5 50%, #F5F5F5 75%, #FAFAFA 100%)',
     cssVariables: {
       light: {
         '--background': '0 0% 98%',
         '--foreground': '240 10% 25%',
         '--card': '0 0% 100%',
         '--card-foreground': '240 10% 25%',
         '--primary': '239 84% 67%',
         '--primary-foreground': '0 0% 100%',
         '--accent': '0 0% 96%',
         '--accent-foreground': '239 84% 60%',
         '--muted': '0 0% 90%',
         '--muted-foreground': '240 10% 35%',
         '--border': '0 0% 85%',
         '--input': '0 0% 85%',
         '--ring': '239 84% 67%',
       },
       dark: {
         '--background': '240 10% 12%',
         '--foreground': '0 0% 95%',
         '--card': '240 10% 15%',
         '--card-foreground': '0 0% 95%',
         '--primary': '239 84% 67%',
         '--primary-foreground': '0 0% 100%',
         '--accent': '240 10% 20%',
         '--accent-foreground': '239 84% 75%',
         '--muted': '240 10% 25%',
         '--muted-foreground': '0 0% 70%',
         '--border': '240 10% 30%',
         '--input': '240 10% 25%',
         '--ring': '239 84% 67%',
       },
     },
   },
 ];
 
 // Legacy ID mapping
 const legacyMap: Record<string, string> = {
   'white-orange': 'orange',
   'white-black': 'black',
   'white-red': 'red',
   'white-green': 'green',
   'white-blue': 'blue',
   'default': 'orange',
 };
 
 export const getThemeById = (id: string): ThemeDefinition | undefined => {
   const mappedId = legacyMap[id] || id;
   return themes.find((t) => t.id === mappedId);
 };
 
 export const applyTheme = (themeId: string) => {
   const mappedId = legacyMap[themeId] || themeId;
   const theme = getThemeById(mappedId);
   if (!theme) return;
 
   const root = document.documentElement;
   const isDark = root.classList.contains('dark');
   const vars = isDark ? theme.cssVariables.dark : theme.cssVariables.light;
 
   Object.entries(vars).forEach(([key, value]) => {
     root.style.setProperty(key, value);
   });
   
   // Store theme ID for background component
   root.setAttribute('data-theme', mappedId);
 };
 
 export const getThemeGradient = (themeId: string): string => {
   const mappedId = legacyMap[themeId] || themeId;
   const theme = getThemeById(mappedId);
   if (!theme) return themes[1].bgGradient;
   return theme.bgGradient;
 };
 
 export const getThemeDecorations = (themeId: string): string[] => {
   const mappedId = legacyMap[themeId] || themeId;
   const theme = getThemeById(mappedId);
   if (!theme) return themes[1].decorations;
   return theme.decorations;
 };