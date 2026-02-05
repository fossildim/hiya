import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';
import CandyBackground from '@/components/CandyBackground';
import confetti from 'canvas-confetti';
import { getThemeById } from '@/lib/themes';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { entries, getEntryByDate, settings } = useApp();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const themeId = settings.currentTheme || 'orange';
  const isNeonTheme = themeId === 'black';
  const isHoloTheme = themeId === 'white';
  const isYellowTheme = themeId === 'yellow';
  
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
  
  const getWeekBestDays = () => {
    const bestDays: { [key: string]: boolean } = {};
    const weeks: { [key: number]: typeof entries } = {};
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
        const weekNum = Math.floor((entryDate.getDate() + firstDay - 1) / 7);
        if (!weeks[weekNum]) weeks[weekNum] = [];
        weeks[weekNum].push(entry);
      }
    });
    
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
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
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
          className="aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all"
          style={{
            background: entry 
              ? isBest 
                ? 'linear-gradient(135deg, #FBBF24 0%, #F97316 100%)'
                : 'linear-gradient(135deg, #FDBA74 0%, #FB923C 100%)'
              : 'rgba(255,255,255,0.7)',
            boxShadow: isBest 
              ? '0 0 25px rgba(251, 146, 60, 0.6), 0 8px 20px rgba(251, 146, 60, 0.4)' 
              : entry
                ? '0 4px 15px rgba(251, 146, 60, 0.3)'
                : '0 2px 10px rgba(0,0,0,0.05)',
            border: today ? '3px solid #EA580C' : entry ? 'none' : '2px solid rgba(255,255,255,0.5)',
          }}
        >
          {isBest && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)' }}
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
          
          <span 
            className="text-xs sm:text-sm font-bold relative z-10"
            style={{ 
              color: entry ? 'white' : today ? '#EA580C' : '#78350F',
              textShadow: entry ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {day}
          </span>
          
          {entry && (
            <motion.span 
              className="text-xs relative z-10"
              animate={isBest ? { scale: [1, 1.2, 1] } : undefined}
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

  return (
    <div className="min-h-screen max-w-md mx-auto pt-safe pb-20 relative overflow-hidden">
      <CandyBackground />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
          }}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.h1 
          className="font-black text-xl"
          style={{ color: '#EA580C' }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(254,237,213,0.9) 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)',
          }}
        >
          <Rocket className="w-5 h-5 rotate-180" style={{ color: '#EA580C' }} />
        </motion.button>
        
        <motion.h2 
          className="text-xl font-black"
          style={{ color: '#9A3412' }}
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
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(254,237,213,0.9) 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)',
          }}
        >
          <Rocket className="w-5 h-5" style={{ color: '#EA580C' }} />
        </motion.button>
      </div>
      
      {/* Calendar Card */}
      <div className="relative z-10 p-4">
        <motion.div 
          className="rounded-3xl p-4 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.9) 100%)',
            boxShadow: '0 15px 50px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '2px solid rgba(251, 146, 60, 0.2)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map(day => (
              <div key={day} className="aspect-square flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: '#EA580C' }}>{day}</span>
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
      <div className="relative z-10 p-4 flex items-center justify-center gap-4 text-sm">
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(254,237,213,0.9) 100%)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div 
            className="w-5 h-5 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FDBA74 0%, #FB923C 100%)' }}
          >
            <span className="text-[8px]">🙂</span>
          </div>
          <span className="font-medium" style={{ color: '#9A3412' }}>有记录</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(254,237,213,0.9) 100%)',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div 
            className="w-5 h-5 rounded-lg flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F97316 100%)' }}
          >
            <span className="text-[8px]">👑</span>
          </div>
          <span className="font-medium" style={{ color: '#9A3412' }}>本周最佳</span>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default HistoryPage;
