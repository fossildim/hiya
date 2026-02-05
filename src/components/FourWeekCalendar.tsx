import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const FourWeekCalendar = () => {
  const { getEntryByDate } = useApp();
  const navigate = useNavigate();
  
  // Get 4 weeks of dates with current week in the 3rd row
  const getCalendarDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Find this week's Sunday
    const thisWeekSunday = new Date(today);
    thisWeekSunday.setDate(today.getDate() - dayOfWeek);
    
    // Start 2 weeks before this week's Sunday (so current week is row 3)
    const startDate = new Date(thisWeekSunday);
    startDate.setDate(thisWeekSunday.getDate() - 14);
    
    const weeks: Date[][] = [];
    
    for (let week = 0; week < 4; week++) {
      const weekDates: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        weekDates.push(date);
      }
      weeks.push(weekDates);
    }
    
    return weeks;
  };
  
  const weeks = getCalendarDates();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const getRatingColor = (rating: number) => {
    // 3-level rating system
    const colors: Record<number, string> = {
      1: 'bg-accent',
      2: 'bg-primary/70',
      3: 'bg-primary',
    };
    return colors[rating] || 'bg-secondary';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentWeek = (weekIndex: number) => {
    return weekIndex === 2; // Current week is the 3rd row (index 2)
  };
  
  return (
    <div className="space-y-1">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <div 
          key={weekIndex} 
          className={`grid grid-cols-7 gap-1 ${isCurrentWeek(weekIndex) ? 'ring-2 ring-primary/30 rounded-lg p-0.5 -mx-0.5' : ''}`}
        >
          {week.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const entry = getEntryByDate(dateStr);
            const today = isToday(date);
            
            return (
              <motion.button
                key={dateStr}
                onClick={() => navigate('/history')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex flex-col items-center justify-center p-1.5 rounded-lg transition-all min-h-[44px]
                  ${today ? 'ring-2 ring-primary' : ''}
                  ${entry ? getRatingColor(entry.rating) : 'bg-card'}
                `}
              >
                <span className={`text-xs font-bold ${entry && entry.rating >= 4 ? 'text-primary-foreground' : 'text-card-foreground'}`}>
                  {date.getDate()}
                </span>
                {entry && (
                  <span className="text-[11px] leading-none">
                    {['', '😊', '😆', '🤩'][entry.rating]}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
      
      {/* Legend removed as requested */}
    </div>
  );
};

export default FourWeekCalendar;
