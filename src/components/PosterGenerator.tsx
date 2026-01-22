import { useMemo, useRef, useState } from 'react';
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

  // 每次打开分享弹窗都随机一套背景（用于“白橙渐变 + 每次随机背景”）
  const bg = useMemo(() => {
    const variants = [
      {
        wrap: 'bg-gradient-to-br from-background via-primary/10 to-primary/5',
        blobs: [
          { cls: 'bg-primary/20', w: 220, h: 220, x: -40, y: -50, blur: 'blur-3xl' },
          { cls: 'bg-accent/25', w: 180, h: 180, x: 190, y: 40, blur: 'blur-3xl' },
          { cls: 'bg-primary/15', w: 260, h: 260, x: 120, y: 260, blur: 'blur-3xl' },
        ],
      },
      {
        wrap: 'bg-gradient-to-br from-background via-primary/5 to-accent/20',
        blobs: [
          { cls: 'bg-accent/25', w: 260, h: 260, x: -80, y: 120, blur: 'blur-3xl' },
          { cls: 'bg-primary/18', w: 200, h: 200, x: 160, y: -60, blur: 'blur-3xl' },
          { cls: 'bg-primary/12', w: 220, h: 220, x: 210, y: 260, blur: 'blur-3xl' },
        ],
      },
      {
        wrap: 'bg-gradient-to-br from-background via-accent/15 to-primary/10',
        blobs: [
          { cls: 'bg-primary/18', w: 260, h: 260, x: -60, y: -80, blur: 'blur-3xl' },
          { cls: 'bg-accent/25', w: 210, h: 210, x: 190, y: 120, blur: 'blur-3xl' },
          { cls: 'bg-primary/12', w: 240, h: 240, x: 60, y: 300, blur: 'blur-3xl' },
        ],
      },
    ] as const;
    return variants[Math.floor(Math.random() * variants.length)];
  }, []);

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
          {/* Poster Content */}
          <div
            ref={posterRef}
            className={`relative overflow-hidden p-6 ${bg.wrap}`}
          >
            {/* Random background blobs */}
            <div className="absolute inset-0">
              {bg.blobs.map((b, idx) => (
                <div
                  key={idx}
                  className={`absolute rounded-full ${b.cls} ${b.blur}`}
                  style={{
                    width: b.w,
                    height: b.h,
                    left: b.x,
                    top: b.y,
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-background/40" />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">嗨呀！</h2>
                
                <div className="text-sm text-muted-foreground">
                  {formatDate(entry.date)}
                </div>
                
                <div className="py-4">
                  <SmileRating value={entry.rating} onChange={() => {}} readonly size="md" />
                </div>
                
                <p className="text-card-foreground leading-relaxed text-sm">
                  {entry.content || '今天没有写什么...'}
                </p>
                
                <div className="pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {userId ? `@${userId}` : '嗨呀！'}
                  </span>
                </div>
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
