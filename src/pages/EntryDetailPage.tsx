import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SmileRating from '@/components/SmileRating';
import PosterGenerator from '@/components/PosterGenerator';

const EntryDetailPage = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const { getEntryByDate, settings } = useApp();
  
  const [showPoster, setShowPoster] = useState(false);

  const orangeIconButton = 'p-2 rounded-full bg-gradient-to-br from-primary to-chart-1 text-primary-foreground';
  
  const entry = date ? getEntryByDate(date) : null;
  
  if (!entry) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-background flex items-center justify-center pt-safe pb-safe">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到这条记录</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/history')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            返回历史
          </motion.button>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };
  
  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen max-w-md mx-auto bg-background pt-safe pb-safe"
    >
      {/* Decorative background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,245,247,0.8) 0%, rgba(255,228,232,0.4) 50%, rgba(254,215,170,0.3) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/history')}
            className="p-2 rounded-full bg-secondary text-secondary-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-bold text-foreground">记录详情</h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPoster(true)}
          className={orangeIconButton}
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </header>
      
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Date and Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{formatDate(entry.date)}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">记录于 {formatTime(entry.createdAt)}</p>
        </motion.div>
        
        
        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-4"
        >
        <SmileRating value={entry.rating} onChange={() => {}} readonly size="lg" />
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
            {['', '嗨呀！', '嗨呀！！', '嗨呀呀呀！', '嗨--呀！！', '嗨呀！嗨呀！嗨呀！'][entry.rating]}
          </p>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-sm border border-border/50"
        >
          <p className="text-card-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {entry.content || '这天没有写什么...'}
          </p>
        </motion.div>
      </div>
      
      {/* Poster Modal */}
      {showPoster && (
        <PosterGenerator
          entry={entry}
          userId={settings.userId}
          onClose={() => setShowPoster(false)}
        />
      )}
    </motion.div>
  );
};

export default EntryDetailPage;
