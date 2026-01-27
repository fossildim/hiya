import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Entry } from '@/context/AppContext';
import SmileRating from './SmileRating';

interface PosterGeneratorProps {
  entry: Entry;
  userId: string;
  onClose: () => void;
}

const PosterGenerator = ({ entry, userId, onClose }: PosterGeneratorProps) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const handleSave = async () => {
    if (!posterRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `haiya-${entry.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate poster:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl overflow-hidden max-w-sm w-full shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Poster Content - Simple white-orange gradient */}
          <div
            ref={posterRef}
            className="relative overflow-hidden p-8"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)',
            }}
          >
            <div className="relative z-10 text-center space-y-5">
              {/* Title - smaller with orange stroke */}
              <h2 
                className="text-3xl font-bold"
                style={{
                  color: '#ea580c',
                  textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 2px 2px 0 #fdba74',
                  letterSpacing: '0.05em',
                }}
              >
                嗨呀！
              </h2>
              
              {/* Date */}
              <div 
                className="text-base font-medium"
                style={{ color: '#78716c' }}
              >
                {formatDate(entry.date)}
              </div>
              
              {/* Emoji rating with boxes */}
              <div className="py-3">
                <SmileRating value={entry.rating} onChange={() => {}} readonly size="md" variant="poster" />
              </div>
              
              {/* Content card */}
              <div 
                className="rounded-2xl p-5 mx-2"
                style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 20px rgba(234, 88, 12, 0.08)'
                }}
              >
                <p 
                  className="leading-relaxed text-sm"
                  style={{ color: '#57534e' }}
                >
                  {entry.content || '今天没有写什么...'}
                </p>
              </div>
              
              {/* User ID with sun */}
              <div className="pt-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: '#ea580c' }}
                >
                  {userId ? `@${userId}` : '@HiYa'} 🌻
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              关闭
            </button>
            <button
              onClick={handleSave}
              disabled={isGenerating}
              className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-br from-primary to-chart-1 text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? '生成中...' : '保存'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PosterGenerator;
