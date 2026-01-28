import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SmileRating from '@/components/SmileRating';
import PosterGenerator from '@/components/PosterGenerator';
import { Entry } from '@/context/AppContext';
import { useSearchParams } from 'react-router-dom';

const RecordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addEntry, settings } = useApp();
  
  const [rating, setRating] = useState(3);
  const [content, setContent] = useState('');
  const [showPoster, setShowPoster] = useState(false);
  const [savedEntry, setSavedEntry] = useState<Entry | null>(null);
  
  // 支持通过 URL 参数指定日期（用于补录）
  const urlDate = searchParams.get('date');
  const targetDate = urlDate ? new Date(urlDate + 'T00:00:00') : new Date();
  const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
  const isBackfill = !!urlDate;

  const orangeButton = 'bg-gradient-to-br from-primary to-chart-1 text-primary-foreground';
  
  const formatDate = () => {
    return targetDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmit = () => {
    const entry = addEntry({
      date: dateStr,
      rating,
      content,
    });
    setSavedEntry(entry);
    setShowPoster(true);
  };

  const handleClosePoster = () => {
    setShowPoster(false);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen max-w-md mx-auto bg-background flex flex-col pt-safe pb-safe"
    >
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
          className="p-2 rounded-full bg-secondary text-secondary-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="font-bold text-foreground">{isBackfill ? '补充嗨呀！' : '记录今天'}</h1>
          <span className="text-sm text-muted-foreground">{formatDate()}</span>
        </div>
      </header>
      
      {/* Content */}
      <div className="relative z-10 flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Rating Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-base sm:text-lg font-medium text-foreground text-center">今天的心情</h2>
          <SmileRating value={rating} onChange={setRating} />
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            {['', '嗨呀！', '嗨呀！！', '嗨呀呀呀！', '嗨--呀！！', '嗨呀！嗨呀！嗨呀！'][rating]}
          </p>
        </motion.section>
        
        
        {/* Text Input */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-xs sm:text-sm font-medium text-foreground">
            今天发生了什么？
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 200))}
            placeholder="记录一下今天的心情和事情..."
            className="w-full h-32 sm:h-40 p-3 sm:p-4 rounded-xl bg-card text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm sm:text-base"
          />
          <div className="text-right text-xs text-muted-foreground">
            {content.length}/200
          </div>
        </motion.section>
      </div>
      
      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 p-4 sm:p-6"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className={`w-full py-3 sm:py-4 rounded-xl ${orangeButton} font-bold text-base sm:text-lg shadow-lg`}
        >
          嗨呀！✨
        </motion.button>
      </motion.div>
      
      {/* Poster Modal */}
      {showPoster && savedEntry && (
        <PosterGenerator
          entry={savedEntry}
          userId={settings.userId}
          onClose={handleClosePoster}
        />
      )}
    </motion.div>
  );
};

export default RecordPage;
