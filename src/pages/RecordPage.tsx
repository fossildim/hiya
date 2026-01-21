import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp, getRandomWeather } from '@/context/AppContext';
import SmileRating from '@/components/SmileRating';
import PosterGenerator from '@/components/PosterGenerator';
import { Entry } from '@/context/AppContext';

const RecordPage = () => {
  const navigate = useNavigate();
  const { addEntry, settings } = useApp();
  
  const [rating, setRating] = useState(3);
  const [content, setContent] = useState('');
  const [weather] = useState(getRandomWeather());
  const [showPoster, setShowPoster] = useState(false);
  const [savedEntry, setSavedEntry] = useState<Entry | null>(null);
  
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const formatDate = () => {
    return today.toLocaleDateString('zh-CN', {
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
      weather,
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
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-secondary text-secondary-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="font-bold text-foreground">记录今天</h1>
          <span className="text-sm text-muted-foreground">{formatDate()}</span>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Rating Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-medium text-foreground text-center">今天的心情</h2>
          <SmileRating value={rating} onChange={setRating} />
          <p className="text-center text-sm text-muted-foreground">
            {['', '很难过', '有点低落', '一般般', '还不错', '超开心'][rating]}
          </p>
        </motion.section>
        
        {/* Weather Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card text-card-foreground shadow-sm">
            {weather}
          </span>
        </motion.section>
        
        {/* Text Input */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-foreground">
            今天发生了什么？
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 200))}
            placeholder="记录一下今天的心情和事情..."
            className="w-full h-40 p-4 rounded-xl bg-card text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
        className="p-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg"
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
