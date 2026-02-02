import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import MyWardrobe from '@/components/MyWardrobe';
import UnlockCelebration from '@/components/UnlockCelebration';
import { useApp } from '@/context/AppContext';

const ThemeStorePage = () => {
  const { getDaysUsed, settings } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);

  const daysUsed = getDaysUsed();
  const devMode = settings.devMode ?? false;
  const isUnlocked = devMode || daysUsed >= 20;

  // Check if we should show celebration on first unlock
  useEffect(() => {
    if (isUnlocked) {
      const celebrationShown = localStorage.getItem('haiya_celebration_shown');
      if (!celebrationShown) {
        setShowCelebration(true);
        localStorage.setItem('haiya_celebration_shown', 'true');
      }
    }
  }, [isUnlocked]);

  // Handle double tap to show celebration again
  const handleDoubleTap = () => {
    if (!isUnlocked) return;
    
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setShowCelebration(true);
    }
    setLastTapTime(now);
  };

  return (
    <div 
      className="min-h-screen bg-background pb-24 pt-safe"
      onClick={handleDoubleTap}
    >
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 67%, hsl(var(--primary) / 0.3) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">嗨呀！主题</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">选择你喜欢的主题风格</p>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 space-y-8">
        {/* My Wardrobe */}
        <MyWardrobe />

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      <BottomTabBar />

      {/* Unlock Celebration Modal */}
      <UnlockCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
};

export default ThemeStorePage;
