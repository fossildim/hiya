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
import { getThemeById } from '@/lib/themes';

const EntryDetailPage = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const { getEntryByDate, settings } = useApp();
  
  const [showPoster, setShowPoster] = useState(false);
  
  const entry = date ? getEntryByDate(date) : null;
  
  const themeId = settings.currentTheme || 'orange';
  const isNeonTheme = themeId === 'black';
  const isHoloTheme = themeId === 'white';
  const isYellowTheme = themeId === 'yellow';
  
  const getButtonStyle = () => ({
    background: isNeonTheme 
      ? 'linear-gradient(135deg, hsl(142 71% 45%) 0%, hsl(142 76% 36%) 100%)'
      : isHoloTheme
      ? 'linear-gradient(135deg, #EF4444 0%, #F97316 20%, #FBBF24 40%, #22C55E 60%, #3B82F6 80%, #8B5CF6 100%)'
      : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
    boxShadow: isNeonTheme 
      ? '0 0 20px hsl(142 71% 45% / 0.5)'
      : '0 4px 15px hsl(var(--primary) / 0.4)',
  });
  
  const getIconColor = () => isNeonTheme ? '#0F172A' : isYellowTheme ? '#78350F' : '#FFFFFF';
  const getTextColor = () => isNeonTheme ? '#4ADE80' : isYellowTheme ? '#78350F' : 'hsl(var(--primary))';
  
  if (!entry) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center pt-safe pb-safe relative">
        <CandyBackground />
        <div className="text-center relative z-10">
          <p className="mb-4 text-muted-foreground">找不到这条记录</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/history')}
            className="px-6 py-3 rounded-2xl font-bold"
            style={{
              ...getButtonStyle(),
              color: getIconColor(),
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
            style={getButtonStyle()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: getIconColor() }} />
          </motion.button>
          <BounceTitle className="text-xl">
            这天嗨呀！
          </BounceTitle>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPoster(true)}
          className="p-3 rounded-full shadow-lg"
          style={getButtonStyle()}
          data-testid="button-share"
        >
          <Share2 className="w-5 h-5" style={{ color: getIconColor() }} />
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
          <h2 className="text-lg sm:text-xl font-bold" style={{ color: getTextColor() }}>
            {formatDate(entry.date)}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            记录于 {formatTime(entry.createdAt)}
          </p>
        </motion.div>
        
        {/* Rating */}
        <BubbleCard glow delay={0.2}>
          <SmileRating value={entry.rating} onChange={() => {}} readonly size="lg" />
          <motion.p 
            className="text-center text-sm mt-3 font-bold"
            style={{ color: getTextColor() }}
          >
            {['', '嗨呀！', '嗨呀呀！！', '嗨呀嗨呀！！！'][entry.rating]}
          </motion.p>
        </BubbleCard>
        
        {/* Content */}
        <BubbleCard delay={0.3}>
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-card-foreground">
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
