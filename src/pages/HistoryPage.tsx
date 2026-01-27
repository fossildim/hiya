import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BottomTabBar from '@/components/BottomTabBar';

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

  const yellowIconButton =
    'p-2 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground';

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
      
      days.push(
        <motion.button
          key={day}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (entry) {
              navigate(`/entry/${dateStr}`);
            } else {
              // 允许补录过去的日期
              const clickedDate = new Date(year, month, day);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (clickedDate <= today) {
                navigate(`/record?date=${dateStr}`);
              }
            }
          }}
          className={`
            aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-pointer transition-all
            ${isToday(day) ? 'ring-2 ring-primary' : ''}
            ${entry ? 'bg-primary/10' : 'bg-card hover:bg-muted'}
            ${isBest ? 'ring-2 ring-accent-foreground bg-accent' : ''}
          `}
        >
          <span className={`text-xs sm:text-sm font-medium ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </span>
          {entry && (
            <span className="text-xs">{getRatingEmoji(entry.rating)}</span>
          )}
        </motion.button>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background pt-safe pb-20">
      {/* Decorative background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,245,247,0.8) 0%, rgba(255,228,232,0.4) 50%, rgba(254,215,170,0.3) 100%)',
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className={yellowIconButton}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="font-bold text-foreground">开心动态</h1>
      </header>
      
      {/* Month Navigation */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className={yellowIconButton}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <h2 className="text-lg font-bold text-foreground">
          {year}年 {monthNames[month]}
        </h2>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className={yellowIconButton}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Calendar */}
      <div className="relative z-10 p-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="aspect-square flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Legend */}
      <div className="relative z-10 p-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/10" />
          <span>有记录</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent ring-1 ring-accent-foreground" />
          <span>本周最佳</span>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default HistoryPage;
