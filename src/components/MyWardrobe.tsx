import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { themes, ThemeDefinition, applyTheme } from '@/lib/themes';
import { useApp } from '@/context/AppContext';

const MyWardrobe = () => {
  const { settings, updateSettings } = useApp();
  const currentTheme = settings.currentTheme || 'white-orange';

  const handleApplyTheme = (theme: ThemeDefinition) => {
    updateSettings({ currentTheme: theme.id });
    applyTheme(theme.id);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const isActive = (themeId: string) => currentTheme === themeId;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4"
    >
      <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        🎨 选择主题
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        点击切换主题风格
      </p>

      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme, index) => {
          const active = isActive(theme.id);

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleApplyTheme(theme)}
              className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                active ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {/* Theme preview background */}
              <div
                className="h-20 p-3"
                style={{ background: theme.gradient }}
              >
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: theme.preview.primary }}
                >
                  {theme.name}
                </p>
              </div>

              {/* Color dots */}
              <div className="bg-card p-2 flex gap-1.5">
                {Object.values(theme.preview).map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-border/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Status indicator */}
              {active && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default MyWardrobe;
