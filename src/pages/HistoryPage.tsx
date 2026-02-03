import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';
import confetti from 'canvas-confetti';

// Floating decoration component
const FloatingDecoration = ({ emoji, delay, duration, x, y }: { emoji: string; delay: number; duration: number; x: number; y: number }) => (
  <motion.div
    className="absolute text-2xl opacity-30 pointer-events-none select-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

const HistoryPage = () => {
  const navigate = useNavigate();
  const { entries, getEntryByDate } = useApp();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Get best entry for each week
  const getWeekBestDays = () => {
    const bestDays: { [key: string]: boolean } = {};
    
    // Group entries by week
    const weeks: { [key: number]: typeof entries } = {};
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
        const weekNum = Math.floor((entryDate.getDate() + firstDay - 1) / 7);
        if (!weeks[weekNum]) weeks[weekNum] = [];
        weeks[weekNum].push(entry);
      }
    });
    
    // Find best in each week
    Object.values(weeks).forEach(weekEntries => {
      if (weekEntries.length > 0) {
        const best = weekEntries.reduce((a, b) => a.rating > b.rating ? a : b);
        bestDays[best.date] = true;
      }
    });
    
    return bestDays;
  };
  
  const weekBestDays = getWeekBestDays();
  
  const getRatingEmoji = (rating: number) => {
    return ['', '😊', '😄', '🥰', '😍', '🤩'][rating];
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#f97316', '#fb923c', '#fdba74', '#fef3c7', '#fbbf24'],
      scalar: 0.6,
      ticks: 50,
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = getEntryByDate(dateStr);
      const isBest = weekBestDays[dateStr];
      const today = isToday(day);
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            if (entry) {
              triggerConfetti(e);
              setTimeout(() => navigate(`/entry/${dateStr}`), 200);
            } else {
              const clickedDate = new Date(year, month, day);
              const todayDate = new Date();
              todayDate.setHours(0, 0, 0, 0);
              if (clickedDate <= todayDate) {
                navigate(`/record?date=${dateStr}`);
              }
            }
          }}
          className={`
            aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all
            ${entry 
              ? isBest 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-300/50' 
                : 'bg-gradient-to-br from-orange-300 to-orange-400 shadow-md shadow-orange-200/50'
              : 'bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-white/50'
            }
            ${today ? 'ring-4 ring-primary ring-offset-2 ring-offset-transparent' : ''}
          `}
          style={{
            boxShadow: isBest 
              ? '0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(251, 146, 60, 0.3)' 
              : undefined
          }}
        >
          {/* Glow effect for best days */}
          {isBest && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-300/30 to-orange-400/30"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Today indicator - spinning ring */}
          {today && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                borderStyle: 'dashed',
              }}
            />
          )}
          
          {/* Crown for best days */}
          {isBest && (
            <motion.span 
              className="absolute -top-1 -right-1 text-xs"
              animate={{ 
                y: [0, -2, 0],
                rotate: [-5, 5, -5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              👑
            </motion.span>
          )}
          
          <span className={`text-xs sm:text-sm font-bold relative z-10 ${
            entry ? 'text-white drop-shadow-sm' : today ? 'text-primary' : 'text-foreground/70'
          }`}>
            {day}
          </span>
          
          {entry && (
            <motion.span 
              className="text-xs relative z-10"
              animate={isBest ? { 
                scale: [1, 1.2, 1],
              } : undefined}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getRatingEmoji(entry.rating)}
            </motion.span>
          )}
        </motion.button>
      );
    }
    
    return days;
  };

  // Floating decorations data
  const decorations = [
    { emoji: '🍊', delay: 0, duration: 4, x: 5, y: 15 },
    { emoji: '☀️', delay: 0.5, duration: 5, x: 85, y: 10 },
    { emoji: '🙂', delay: 1, duration: 4.5, x: 10, y: 60 },
    { emoji: '✨', delay: 1.5, duration: 3.5, x: 90, y: 55 },
    { emoji: '🍊', delay: 2, duration: 4, x: 80, y: 80 },
    { emoji: '⭐', delay: 0.3, duration: 5, x: 15, y: 85 },
    { emoji: '🌟', delay: 0.8, duration: 4.2, x: 50, y: 5 },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto pt-safe pb-20 relative overflow-hidden">
      {/* Vibrant gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.7) 0%, hsl(var(--chart-1) / 0.6) 50%, hsl(var(--accent) / 0.8) 100%)',
        }}
      />
      
      {/* Floating decorations */}
      {decorations.map((dec, i) => (
        <FloatingDecoration key={i} {...dec} />
      ))}
      
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        {/* Bouncy title */}
        <motion.h1 
          className="font-black text-xl text-white drop-shadow-lg"
          animate={{ 
            y: [0, -3, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨ 嗨呀！动态 ✨
        </motion.h1>
      </header>
      
      {/* Month Navigation */}
      <div className="relative z-10 px-4 py-2 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.2, rotate: -10 }}
          whileTap={{ scale: 0.8 }}
          onClick={prevMonth}
          className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-primary"
        >
          <Rocket className="w-5 h-5 rotate-180" />
        </motion.button>
        
        <motion.h2 
          className="text-xl font-black text-white drop-shadow-lg"
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {year}年 {monthNames[month]}
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.8 }}
          onClick={nextMonth}
          className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-primary"
        >
          <Rocket className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Calendar Card */}
      <div className="relative z-10 p-4">
        <motion.div 
          className="bg-white/70 backdrop-blur-md rounded-3xl p-4 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map(day => (
              <div key={day} className="aspect-square flex items-center justify-center">
                <span className="text-xs font-bold text-primary/70">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {renderCalendarDays()}
          </div>
        </motion.div>
      </div>
      
      {/* Legend */}
      <div className="relative z-10 p-4 flex items-center justify-center gap-6 text-sm">
        <motion.div 
          className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full shadow"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center">
            <span className="text-[8px]">🙂</span>
          </div>
          <span className="text-foreground/80 font-medium">有记录</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full shadow"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center relative">
            <span className="text-[8px]">👑</span>
          </div>
          <span className="text-foreground/80 font-medium">本周最佳</span>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default HistoryPage;
