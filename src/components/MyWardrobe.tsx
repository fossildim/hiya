import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { themes, ThemeDefinition, applyTheme } from '@/lib/themes';
import { useApp } from '@/context/AppContext';
import { playRandomSyllable } from '@/lib/sfx';

const MyWardrobe = () => {
  const { settings, updateSettings } = useApp();
  const currentTheme = settings.currentTheme || 'white-orange';

  const handleApplyTheme = (theme: ThemeDefinition) => {
    updateSettings({ currentTheme: theme.id });
    applyTheme(theme.id);
    playRandomSyllable();
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
      <h2 className="text-lg font-black mb-3 flex items-center gap-2" style={{ color: '#EA580C' }}>
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎨
        </motion.span>
        选择主题
      </h2>
      <p className="text-sm mb-4" style={{ color: '#9A3412' }}>
        点击切换主题风格
      </p>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme, index) => {
          const active = isActive(theme.id);

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleApplyTheme(theme)}
              className="relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                boxShadow: active 
                  ? '0 10px 40px rgba(251, 146, 60, 0.4), 0 0 30px rgba(251, 146, 60, 0.2)'
                  : '0 8px 25px rgba(0, 0, 0, 0.08)',
                border: active ? '3px solid #FB923C' : '3px solid rgba(255,255,255,0.5)',
              }}
            >
              {/* Glow effect for active */}
              {active && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
                  }}
                />
              )}
              
              {/* Theme preview background */}
              <div
                className="h-24 p-4 relative"
                style={{ background: theme.gradient }}
              >
                {/* Glossy highlight */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                  }}
                />
                
                <p
                  className="text-sm font-black truncate relative z-10"
                  style={{ color: theme.preview.primary }}
                >
                  {theme.name}
                </p>
              </div>

              {/* Color dots - bubble style */}
              <div 
                className="p-3 flex gap-2"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.9) 100%)',
                }}
              >
                {Object.values(theme.preview).map((color, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: color,
                      border: '2px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                ))}
              </div>

              {/* Active indicator */}
              {active && (
                <motion.div 
                  className="absolute top-3 right-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
                      boxShadow: '0 4px 15px rgba(251, 146, 60, 0.5)',
                    }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default MyWardrobe;
