import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { themes, ThemeDefinition } from '@/lib/themes';
import { useApp } from '@/context/AppContext';

interface MysteryBoxProps {
  onThemeUnlocked?: (theme: ThemeDefinition, isDuplicate: boolean) => void;
}

const MysteryBox = ({ onThemeUnlocked }: MysteryBoxProps) => {
  const { settings, updateSettings } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<{
    theme: ThemeDefinition;
    isDuplicate: boolean;
  } | null>(null);

  const unlockedThemes = settings.unlockedThemes || ['default'];
  const haiyaPoints = settings.haiyaPoints || 0;

  const triggerHaptic = () => {
    // Simulate haptic feedback with CSS animation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleOpenBox = useCallback(() => {
    setIsOpening(true);
    triggerHaptic();

    // Simulate payment processing
    setTimeout(() => {
      // Random pick from all themes
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      const isDuplicate = unlockedThemes.includes(randomTheme.id);

      if (isDuplicate) {
        // Convert to points
        updateSettings({ haiyaPoints: haiyaPoints + 1 });
      } else {
        // Unlock new theme
        updateSettings({
          unlockedThemes: [...unlockedThemes, randomTheme.id],
        });
      }

      fireConfetti();
      setResult({ theme: randomTheme, isDuplicate });
      setIsOpening(false);
      setShowPayment(false);

      if (onThemeUnlocked) {
        onThemeUnlocked(randomTheme, isDuplicate);
      }
    }, 1500);
  }, [unlockedThemes, haiyaPoints, updateSettings, onThemeUnlocked]);

  const closeResult = () => {
    setResult(null);
  };

  return (
    <>
      {/* Mystery Box */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Wobble animation for the box */}
        <motion.div
          animate={{
            rotate: [0, -3, 3, -3, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="relative"
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-50 blur-xl"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
              transform: 'scale(1.3)',
            }}
          />

          {/* Box */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic();
              setShowPayment(true);
            }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl cursor-pointer overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--chart-1)) 100%)',
              boxShadow: '0 10px 40px hsl(var(--primary) / 0.3)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-primary-foreground" />
            </div>

            {/* Sparkle effects */}
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 right-3"
            >
              <Sparkles className="w-5 h-5 text-primary-foreground/80" />
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-3 left-3"
            >
              <Sparkles className="w-4 h-4 text-primary-foreground/80" />
            </motion.div>
          </motion.div>
        </motion.div>

        <h3 className="mt-4 text-lg font-bold text-foreground">嗨呀！惊喜盲盒</h3>
        <p className="text-sm text-muted-foreground mt-1">随机获取一个主题</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            triggerHaptic();
            setShowPayment(true);
          }}
          className="mt-4 px-6 py-3 rounded-full font-bold text-primary-foreground bg-gradient-to-br from-primary to-chart-1 shadow-lg"
        >
          0.01元 惊喜开盒
        </motion.button>

        {haiyaPoints > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            嗨呀积分：{haiyaPoints}
          </p>
        )}
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-[80] p-4"
            onClick={() => !isOpening && setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-xs w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {isOpening ? (
                <div className="text-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"
                  />
                  <p className="text-foreground font-medium">正在开盒...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">确认支付</h3>
                    <button onClick={() => setShowPayment(false)}>
                      <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">商品</span>
                      <span className="font-medium text-foreground">嗨呀！惊喜盲盒</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">金额</span>
                      <span className="font-bold text-primary text-xl">¥0.01</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPayment(false)}
                      className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                    >
                      取消
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenBox}
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

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-[90] p-4"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-card rounded-3xl p-8 max-w-xs w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: result.isDuplicate
                    ? 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)'
                    : `linear-gradient(135deg, ${result.theme.preview.primary} 0%, ${result.theme.preview.accent} 100%)`,
                }}
              >
                {result.isDuplicate ? (
                  <Sparkles className="w-10 h-10 text-muted-foreground" />
                ) : (
                  <Check className="w-10 h-10 text-primary-foreground" />
                )}
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                {result.isDuplicate ? '获得重复主题！' : '恭喜！获得新主题！'}
              </h3>

              <p
                className="text-lg font-medium mb-2"
                style={{ color: result.theme.preview.primary }}
              >
                {result.theme.name}
              </p>

              {result.isDuplicate ? (
                <p className="text-sm text-muted-foreground mb-6">
                  已转化为 1 个嗨呀积分
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-6">
                  主题已自动解锁！
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeResult}
                className="px-8 py-3 rounded-full font-bold text-primary-foreground bg-gradient-to-br from-primary to-chart-1"
              >
                太嗨呀！🧡
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MysteryBox;
