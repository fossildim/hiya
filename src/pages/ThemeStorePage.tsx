import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Sparkles, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';

interface Theme {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  gradient: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: '默认嗨呀粉',
    description: '温馨可爱的粉橙色调，满满的幸福感',
    price: 0,
    colors: {
      primary: '#ea580c',
      background: '#fffbf5',
      accent: '#fef3c7',
    },
    gradient: 'linear-gradient(135deg, #fff5f7 0%, #ffe4e8 50%, #fed7aa 100%)',
  },
  {
    id: 'night-blue',
    name: '深夜静谧蓝',
    description: '宁静深邃的蓝紫色调，适合夜晚记录',
    price: 6,
    colors: {
      primary: '#6366f1',
      background: '#1e1b4b',
      accent: '#312e81',
    },
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  },
  {
    id: 'lemon-yellow',
    name: '柠檬开心黄',
    description: '明亮活泼的柠檬黄，每天都充满阳光',
    price: 6,
    colors: {
      primary: '#eab308',
      background: '#fefce8',
      accent: '#fef08a',
    },
    gradient: 'linear-gradient(135deg, #fefce8 0%, #fef08a 50%, #facc15 100%)',
  },
];

const ThemeStorePage = () => {
  const { settings, updateSettings } = useApp();
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Get unlocked themes from settings (default is always unlocked)
  const unlockedThemes = settings.unlockedThemes || ['default'];
  const currentTheme = settings.currentTheme || 'default';

  const handleThemeClick = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleUnlock = (theme: Theme) => {
    if (theme.price === 0 || unlockedThemes.includes(theme.id)) {
      // Apply theme
      updateSettings({ currentTheme: theme.id });
      setSelectedTheme(null);
    } else {
      // Show payment modal
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    // Simulate payment success
    setTimeout(() => {
      setPaymentSuccess(true);
      const newUnlocked = [...unlockedThemes, selectedTheme!.id];
      updateSettings({ 
        unlockedThemes: newUnlocked,
        currentTheme: selectedTheme!.id 
      });
      
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPayment(false);
        setSelectedTheme(null);
      }, 1500);
    }, 1000);
  };

  const isUnlocked = (themeId: string) => unlockedThemes.includes(themeId);
  const isActive = (themeId: string) => currentTheme === themeId;

  return (
    <div className="min-h-screen bg-background pb-20 pt-safe">
      {/* Header */}
      <header className="p-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">嗨呀宝藏商店</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">选择你喜欢的主题风格</p>
        </motion.div>
      </header>

      {/* Theme Cards */}
      <div className="px-4 space-y-4">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeClick(theme)}
            className={`relative overflow-hidden rounded-2xl p-1 cursor-pointer transition-all ${
              isActive(theme.id) ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{ background: theme.gradient }}
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{theme.name}</h3>
                    {isActive(theme.id) && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                        使用中
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isUnlocked(theme.id) && (
                    <div className="flex items-center gap-1 text-primary">
                      <span className="font-bold">¥{theme.price}</span>
                    </div>
                  )}
                  {isUnlocked(theme.id) ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Color preview */}
              <div className="flex gap-2 mt-3">
                {Object.values(theme.colors).map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Theme Detail Modal */}
      <AnimatePresence>
        {selectedTheme && !showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-[60] p-4"
            onClick={() => setSelectedTheme(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md rounded-t-3xl overflow-hidden"
              style={{ background: selectedTheme.gradient }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card/95 backdrop-blur-sm p-6 pb-safe">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-foreground">{selectedTheme.name}</h2>
                  <button onClick={() => setSelectedTheme(null)}>
                    <X className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedTheme.description}</p>

                {/* Preview */}
                <div 
                  className="rounded-2xl p-4 mb-6 h-32"
                  style={{ background: selectedTheme.gradient }}
                >
                  <p 
                    className="font-bold text-lg"
                    style={{ color: selectedTheme.colors.primary }}
                  >
                    预览效果
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUnlock(selectedTheme)}
                  className="w-full py-4 rounded-xl font-bold text-lg text-primary-foreground"
                  style={{
                    background: `linear-gradient(135deg, ${selectedTheme.colors.primary} 0%, ${selectedTheme.colors.accent} 100%)`
                  }}
                >
                  {isUnlocked(selectedTheme.id) 
                    ? (isActive(selectedTheme.id) ? '当前使用中' : '使用此主题')
                    : `¥${selectedTheme.price} 解锁`
                  }
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-[70] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-xs w-full shadow-xl"
            >
              {paymentSuccess ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground">支付成功！</h3>
                  <p className="text-muted-foreground mt-2">主题已解锁并应用</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-foreground text-center mb-4">确认支付</h3>
                  
                  <div className="bg-muted/50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">主题</span>
                      <span className="font-medium text-foreground">{selectedTheme.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">金额</span>
                      <span className="font-bold text-primary text-xl">¥{selectedTheme.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowPayment(false);
                        setSelectedTheme(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                    >
                      取消
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePayment}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-br from-primary to-chart-1 text-primary-foreground font-medium"
                    >
                      确认支付
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar />
    </div>
  );
};

export default ThemeStorePage;
