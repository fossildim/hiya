import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import WeekGrid from '@/components/WeekGrid';
import SmileRating from '@/components/SmileRating';
import { playHaiya } from '@/lib/sfx';
import { useNotificationReminder } from '@/hooks/useNotificationReminder';
import BottomTabBar from '@/components/BottomTabBar';

const Index = () => {
  const navigate = useNavigate();
  const { getTodayEntry, getWeekEntries } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enable notification reminder
  useNotificationReminder();
  
  const todayEntry = getTodayEntry();
  const weekEntries = getWeekEntries();
  
  const bestEntry = weekEntries.length > 0 
    ? weekEntries.reduce((best, entry) => entry.rating > best.rating ? entry : best, weekEntries[0])
    : null;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const handlePressStart = useCallback(() => {
    playHaiya();
    setIsPressed(true);
    setProgress(0);
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 100));
    }, 100);
    
    pressTimerRef.current = setTimeout(() => {
      navigate('/record');
    }, 2000);
  }, [navigate]);

  const handlePressEnd = useCallback(() => {
    setIsPressed(false);
    setProgress(0);
    
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const orangeMainButton =
    'relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-primary to-chart-1 text-primary-foreground font-bold text-xl shadow-xl overflow-hidden';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background flex flex-col relative overflow-hidden pt-safe pb-20">
      {/* Decorative background - theme gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 67%, hsl(var(--primary) / 0.3) 100%)',
        }}
      />
      
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{ 
            background: 'hsl(var(--primary) / 0.3)', 
            top: '-5%', 
            right: '-10%', 
            filter: 'blur(60px)' 
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full opacity-15"
          style={{ 
            background: 'hsl(var(--chart-1) / 0.4)', 
            bottom: '25%', 
            left: '-8%', 
            filter: 'blur(50px)' 
          }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full opacity-10"
          style={{ 
            background: 'hsl(var(--accent) / 0.5)', 
            top: '40%', 
            right: '5%', 
            filter: 'blur(40px)' 
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 space-y-1 relative z-10 flex justify-between items-start"
      >
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--chart-1)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            嗨呀！
          </h1>
          <span className="text-xs sm:text-sm text-muted-foreground">{formatDate(new Date())}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="p-2.5 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </motion.header>
      
      {/* Best Entry of the Week */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 sm:px-6 mb-4 sm:mb-6 relative z-10"
      >
        <div 
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-md border border-border/50"
          style={{ boxShadow: '0 4px 20px hsl(var(--primary) / 0.08)' }}
        >
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
            <span>🌟</span> 上周最嗨！
          </h2>
          {bestEntry ? (
            <div className="space-y-2 sm:space-y-3">
              <SmileRating value={bestEntry.rating} onChange={() => {}} readonly size="sm" />
              <p className="text-card-foreground text-xs sm:text-sm line-clamp-2">
                {bestEntry.content || '没有写什么...'}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(bestEntry.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs sm:text-sm">还没有记录哦，快来记录吧！✨</p>
          )}
        </div>
      </motion.section>
      
      {/* Week Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 sm:px-6 mb-4 sm:mb-6 relative z-10"
      >
        <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
          <span>📅</span> 本周嗨呀！
        </h2>
        <WeekGrid />
      </motion.section>
      
      {/* Center Record Button */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 relative z-10">
        <motion.div className="relative">
          {/* Glow effect behind button */}
          <div 
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
              transform: 'scale(1.5)',
              filter: 'blur(20px)',
            }}
          />
          <motion.button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={orangeMainButton}
            style={{ boxShadow: '0 8px 30px hsl(var(--primary) / 0.3)' }}
          >
            <div
              className="absolute inset-0 bg-accent-foreground transition-all duration-100"
              style={{ 
                clipPath: `inset(${100 - progress}% 0 0 0)`,
                opacity: 0.3
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <span className="text-2xl sm:text-3xl mb-1">😊</span>
              <span className="text-base sm:text-lg">{todayEntry ? '还有更嗨呀的！' : '嗨呀！'}</span>
              {isPressed && (
                <span className="text-xs mt-1 opacity-80">长按2秒...</span>
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};

export default Index;
