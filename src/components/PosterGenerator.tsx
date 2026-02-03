import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Entry } from '@/context/AppContext';
import SmileRating from './SmileRating';
import BubbleButton from './BubbleButton';

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
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-3xl overflow-hidden max-w-sm w-full"
          style={{
            boxShadow: '0 25px 80px rgba(251, 146, 60, 0.4), 0 0 50px rgba(251, 146, 60, 0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Poster Content - Golden Medal Style */}
          <div
            ref={posterRef}
            className="relative overflow-hidden p-8"
            style={{
              background: 'linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 30%, #FDE68A 60%, #FCD34D 100%)',
            }}
          >
            {/* Golden glow border effect */}
            <div 
              className="absolute inset-3 rounded-2xl pointer-events-none"
              style={{
                border: '4px solid rgba(251, 191, 36, 0.6)',
                boxShadow: '0 0 30px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(251, 191, 36, 0.2)',
              }}
            />
            
            {/* Decorative corners */}
            <div className="absolute top-5 left-5 text-2xl opacity-60">✨</div>
            <div className="absolute top-5 right-5 text-2xl opacity-60">✨</div>
            <div className="absolute bottom-5 left-5 text-2xl opacity-60">✨</div>
            <div className="absolute bottom-5 right-5 text-2xl opacity-60">✨</div>
            
            <div className="relative z-10 text-center space-y-5">
              {/* Title - Medal style */}
              <div className="relative inline-block">
                <h2 
                  className="text-4xl font-black"
                  style={{
                    color: '#B45309',
                    textShadow: '2px 2px 0 #FDE68A, -1px -1px 0 #FDE68A, 1px -1px 0 #FDE68A, -1px 1px 0 #FDE68A',
                  }}
                >
                  嗨呀！
                </h2>
                <span className="absolute -top-2 -right-6 text-xl">🏆</span>
              </div>
              
              {/* Date */}
              <div 
                className="text-base font-medium"
                style={{ color: '#92400E' }}
              >
                {formatDate(entry.date)}
              </div>
              
              {/* Emoji rating */}
              <div className="py-3">
                <SmileRating value={entry.rating} onChange={() => {}} readonly size="md" variant="poster" />
              </div>
              
              {/* Content card - glossy bubble */}
              <div 
                className="rounded-2xl p-5 mx-2"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.9) 100%)',
                  boxShadow: '0 8px 30px rgba(180, 83, 9, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '2px solid rgba(251, 191, 36, 0.4)',
                }}
              >
                <p 
                  className="leading-relaxed text-sm"
                  style={{ color: '#78350F' }}
                >
                  {entry.content || '今天没有写什么...'}
                </p>
              </div>
              
              {/* User ID with medal */}
              <div className="pt-2">
                <span 
                  className="text-sm font-bold"
                  style={{ color: '#B45309' }}
                >
                  {userId ? `@${userId}` : '@HiYa'} 🌟
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div 
            className="p-4 flex gap-3"
            style={{ background: 'linear-gradient(145deg, #FEF3C7 0%, #FDE68A 100%)' }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(254,243,199,0.9) 100%)',
                color: '#92400E',
                border: '2px solid rgba(251, 191, 36, 0.4)',
              }}
            >
              <X className="w-4 h-4" />
              关闭
            </motion.button>
            <BubbleButton
              onClick={handleSave}
              disabled={isGenerating}
              size="md"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? '生成中...' : '保存'}
            </BubbleButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PosterGenerator;
