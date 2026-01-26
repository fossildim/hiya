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
          {/* Poster Content - Pink gradient style like reference */}
          <div
            ref={posterRef}
            className="relative overflow-hidden p-8"
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #fdf2f8 100%)',
            }}
          >
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute w-24 h-24 rounded-full opacity-40"
                style={{ background: 'rgba(255,255,255,0.8)', top: '10%', left: '5%', filter: 'blur(20px)' }}
              />
              <div 
                className="absolute w-32 h-32 rounded-full opacity-30"
                style={{ background: 'rgba(255,255,255,0.9)', top: '60%', right: '-5%', filter: 'blur(25px)' }}
              />
              <div 
                className="absolute w-20 h-20 rounded-full opacity-35"
                style={{ background: 'rgba(255,255,255,0.7)', bottom: '15%', left: '10%', filter: 'blur(18px)' }}
              />
              <div 
                className="absolute w-16 h-16 rounded-full opacity-25"
                style={{ background: 'rgba(255,255,255,0.8)', top: '30%', right: '15%', filter: 'blur(15px)' }}
              />
            </div>

            <div className="relative z-10 text-center space-y-5">
              {/* Title with gradient and stroke effect */}
              <h2 
                className="text-5xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #fb7185 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(255,255,255,0.8)',
                  letterSpacing: '0.05em',
                }}
              >
                嗨呀！
              </h2>
              
              {/* Date */}
              <div 
                className="text-base font-medium"
                style={{ color: '#9ca3af' }}
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
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <p 
                  className="leading-relaxed text-sm"
                  style={{ color: '#6b7280' }}
                >
                  {entry.content || '今天没有写什么...'}
                </p>
              </div>
              
              {/* User ID with flower */}
              <div className="pt-2">
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    background: 'linear-gradient(135deg, #9ca3af 0%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {userId ? `@${userId}` : '@HiYa'} 🌸
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
