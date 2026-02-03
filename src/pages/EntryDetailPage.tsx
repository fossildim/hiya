import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SmileRating from '@/components/SmileRating';
import PosterGenerator from '@/components/PosterGenerator';
import CandyBackground from '@/components/CandyBackground';
import BubbleCard from '@/components/BubbleCard';
import BounceTitle from '@/components/BounceTitle';

const EntryDetailPage = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const { getEntryByDate, settings } = useApp();
  
  const [showPoster, setShowPoster] = useState(false);
  
  const entry = date ? getEntryByDate(date) : null;
  
  if (!entry) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center pt-safe pb-safe relative">
        <CandyBackground />
        <div className="text-center relative z-10">
          <p className="mb-4" style={{ color: '#9A3412' }}>找不到这条记录</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
              boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
            }}
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
      className="min-h-screen max-w-md mx-auto pt-safe pb-safe relative"
    >
      <CandyBackground />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/history')}
            className="p-3 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
              boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
            }}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <BounceTitle className="text-xl">
            记录详情
          </BounceTitle>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPoster(true)}
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
          }}
          data-testid="button-share"
        >
          <Share2 className="w-5 h-5 text-white" />
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
          <h2 className="text-lg sm:text-xl font-bold" style={{ color: '#EA580C' }}>
            {formatDate(entry.date)}
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: '#9A3412' }}>
            记录于 {formatTime(entry.createdAt)}
          </p>
        </motion.div>
        
        {/* Rating */}
        <BubbleCard glow delay={0.2}>
          <SmileRating value={entry.rating} onChange={() => {}} readonly size="lg" />
          <motion.p 
            className="text-center text-sm mt-3 font-bold"
            style={{ color: '#9A3412' }}
          >
            {['', '嗨呀！', '嗨呀！！', '嗨呀呀呀！', '嗨--呀！！', '嗨呀！嗨呀！嗨呀！'][entry.rating]}
          </motion.p>
        </BubbleCard>
        
        {/* Content */}
        <BubbleCard delay={0.3}>
          <p 
            className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap"
            style={{ color: '#78350F' }}
          >
            {entry.content || '这天没有写什么...'}
          </p>
        </BubbleCard>
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
