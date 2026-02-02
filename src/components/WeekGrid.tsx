import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const WeekGrid = () => {
  const { getEntryByDate } = useApp();
  const navigate = useNavigate();
  
  // Get dates from this Sunday to next Saturday
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Find this week's Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    
    // Generate Sunday to Saturday
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const weekDates = getWeekDates();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const getRatingColor = (rating: number) => {
    const colors = [
      'bg-secondary',
      'bg-chart-5',
      'bg-chart-4',
      'bg-chart-2',
      'bg-chart-1',
      'bg-primary',
    ];
    return colors[rating] || colors[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date) => {
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
              flex flex-col items-center p-2 rounded-lg transition-all
              ${today ? 'ring-2 ring-primary' : ''}
              ${entry ? getRatingColor(entry.rating) : 'bg-card'}
            `}
          >
            <span className={`text-xs font-medium ${entry && entry.rating >= 4 ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              {weekDays[date.getDay()]}
            </span>
            <span className={`text-lg font-bold ${entry && entry.rating >= 4 ? 'text-primary-foreground' : 'text-card-foreground'}`}>
              {date.getDate()}
            </span>
            {entry && (
              <span className="text-xs mt-0.5">
                {['', '😢', '😕', '😐', '😊', '🥳'][entry.rating]}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default WeekGrid;
