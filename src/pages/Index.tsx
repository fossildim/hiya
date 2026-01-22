import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, Palette } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import WeekGrid from '@/components/WeekGrid';
import SmileRating from '@/components/SmileRating';

const Index = () => {
  const navigate = useNavigate();
  const { getTodayEntry, getWeekEntries, getDaysUsed } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const todayEntry = getTodayEntry();
  const weekEntries = getWeekEntries();
  const daysUsed = getDaysUsed();
  const canAccessTheme = daysUsed >= 20;
  
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-2"
      >
        <h1 className="text-2xl font-bold text-foreground">嗨呀！</h1>
        <span className="text-sm text-muted-foreground">{formatDate(new Date())}</span>
      </motion.header>
      
      {/* Best Entry of the Week */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 mb-6"
      >
        <div className="bg-card rounded-2xl p-5 shadow-md">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">上周最嗨！</h2>
          {bestEntry ? (
            <div className="space-y-3">
              <SmileRating value={bestEntry.rating} onChange={() => {}} readonly size="sm" />
              <p className="text-card-foreground text-sm line-clamp-2">
                {bestEntry.content || '没有写什么...'}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(bestEntry.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">还没有记录哦，快来记录吧！</p>
          )}
        </div>
      </motion.section>
      
      {/* Week Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-8"
      >
        <h2 className="text-sm font-medium text-muted-foreground mb-3">过去一周</h2>
        <WeekGrid />
      </motion.section>
      
      {/* Center Record Button */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.button
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          whileHover={{ scale: 1.05 }}
          className="relative w-40 h-40 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-lg overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-accent-foreground transition-all duration-100"
            style={{ 
              clipPath: `inset(${100 - progress}% 0 0 0)`,
              opacity: 0.3
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="text-2xl mb-1">😊</span>
            <span>{todayEntry ? '还有更嗨呀的！' : '嗨呀！'}</span>
            {isPressed && (
              <span className="text-xs mt-1 opacity-80">长按2秒...</span>
            )}
          </div>
        </motion.button>
      </div>
      
      {/* Footer Navigation */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 flex justify-between items-center"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => canAccessTheme ? navigate('/theme') : null}
          className={`p-3 rounded-full ${canAccessTheme ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground opacity-50'}`}
        >
          <Palette className="w-6 h-6" />
        </motion.button>
        
        {!canAccessTheme && (
          <span className="text-xs text-muted-foreground">
            再使用 {20 - daysUsed} 天解锁主题
          </span>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="p-3 rounded-full bg-secondary text-secondary-foreground"
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </motion.footer>
    </div>
  );
};

export default Index;
