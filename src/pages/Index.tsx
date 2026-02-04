import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FourWeekCalendar from '@/components/FourWeekCalendar';
import SmileRating from '@/components/SmileRating';
import { playHaiya } from '@/lib/sfx';
import { useNotificationReminder } from '@/hooks/useNotificationReminder';
import BottomTabBar from '@/components/BottomTabBar';
import CandyBackground from '@/components/CandyBackground';
import BounceTitle from '@/components/BounceTitle';
import BubbleCard from '@/components/BubbleCard';

const Index = () => {
  const navigate = useNavigate();
  const { getTodayEntry, getWeekEntries } = useApp();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
      setShowConfetti(true);
      setTimeout(() => {
        navigate('/record');
      }, 300);
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
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative overflow-hidden pt-safe pb-20">
      <CandyBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 space-y-1 relative z-10 flex justify-between items-start"
      >
        <div>
          <BounceTitle className="text-3xl sm:text-4xl">
            嗨呀！
          </BounceTitle>
          <span className="text-xs sm:text-sm" style={{ color: '#9A3412' }}>
            {formatDate(new Date())}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
          }}
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.button>
      </motion.header>
      
      {/* Best Entry of the Week */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6 relative z-10">
        <BubbleCard glow delay={0.1}>
          <h2 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 flex items-center gap-2" style={{ color: '#EA580C' }}>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌟
            </motion.span>
            上周最嗨！
          </h2>
          {bestEntry ? (
            <div className="space-y-2 sm:space-y-3">
              <SmileRating value={bestEntry.rating} onChange={() => {}} readonly size="sm" />
              <p className="text-xs sm:text-sm line-clamp-2" style={{ color: '#78350F' }}>
                {bestEntry.content || '没有写什么...'}
              </p>
              <span className="text-xs" style={{ color: '#9A3412' }}>
                {new Date(bestEntry.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm" style={{ color: '#9A3412' }}>
              还没有记录哦，快来记录吧！✨
            </p>
          )}
        </BubbleCard>
      </div>
      
      {/* Four Week Calendar */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6 relative z-10">
        <h2 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 flex items-center gap-2" style={{ color: '#EA580C' }}>
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🗓️
          </motion.span>
          这是你的嗨呀！
        </h2>
        <BubbleCard delay={0.2}>
          <FourWeekCalendar />
        </BubbleCard>
      </div>
      
      {/* Center Record Button - Happy Bomb */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 relative z-10">
        <motion.div className="relative">
          {/* Pulsing glow effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, transparent 70%)',
              transform: 'scale(1.8)',
              filter: 'blur(30px)',
            }}
          />
          
          {/* Main button */}
          <motion.button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            animate={isPressed ? { scale: 0.95 } : { scale: [1, 1.03, 1] }}
            transition={isPressed ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full font-bold text-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)',
              boxShadow: '0 15px 50px rgba(234, 88, 12, 0.5), 0 0 40px rgba(251, 146, 60, 0.4), inset 0 -5px 20px rgba(0,0,0,0.1)',
              border: '4px solid rgba(255,255,255,0.3)',
            }}
            data-testid="button-record"
            data-sfx="off"
          >
            {/* Glossy highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                borderRadius: 'inherit',
              }}
            />
            
            {/* Progress fill */}
            <div
              className="absolute inset-0 transition-all duration-100"
              style={{ 
                background: 'rgba(255,255,255,0.3)',
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
              <motion.span 
                className="text-4xl sm:text-5xl mb-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                😊
              </motion.span>
              <span className="text-lg sm:text-xl font-black">
                {todayEntry ? '还有更嗨呀的！' : '嗨呀！'}
              </span>
              {isPressed && (
                <span className="text-xs mt-1 opacity-80">长按2秒...</span>
              )}
            </div>
          </motion.button>
          
          {/* Confetti burst */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: Math.cos(i * 30 * Math.PI / 180) * 100,
                    y: Math.sin(i * 30 * Math.PI / 180) * 100,
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-1/2 left-1/2 text-2xl"
                >
                  {['✨', '🎉', '⭐', '💫', '🌟', '🍊'][i % 6]}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default Index;
