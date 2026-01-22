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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到这条记录</p>
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            返回历史
          </button>
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
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/history')}
            className="p-2 rounded-full bg-secondary text-secondary-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-bold text-foreground">记录详情</h1>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPoster(true)}
          className={orangeIconButton}
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </header>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Date and Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-1"
        >
          <h2 className="text-xl font-bold text-foreground">{formatDate(entry.date)}</h2>
          <p className="text-sm text-muted-foreground">记录于 {formatTime(entry.createdAt)}</p>
        </motion.div>
        
        
        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-4"
        >
        <SmileRating value={entry.rating} onChange={() => {}} readonly size="lg" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {['', '嗨呀！', '嗨呀！！', '嗨呀呀呀！', '嗨--呀！！', '嗨呀！嗨呀！嗨呀！'][entry.rating]}
          </p>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-5 shadow-sm"
        >
          <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
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
