import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Entry } from '@/context/AppContext';
import BubbleButton from './BubbleButton';

interface PosterGeneratorProps {
  entry: Entry;
  userId: string;
  onClose: () => void;
}

const RATING_EMOJIS = ['', '😊', '😄', '🥳', '🤩', '🥹'];

const PosterGenerator = ({ entry, userId, onClose }: PosterGeneratorProps) => {
  const hiddenContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Wait for fonts to load
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
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
    if (!hiddenContainerRef.current || !fontsLoaded) return;
    
    setIsGenerating(true);
    try {
      // Wait a bit for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(hiddenContainerRef.current, {
        scale: 3, // High resolution for crisp text
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `haiya-${entry.date}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Failed to generate poster:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Hidden container for high-quality image generation */}
      <div
        ref={hiddenContainerRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1080px',
          background: 'linear-gradient(135deg, #FB923C 0%, #F97316 30%, #EA580C 60%, #EC4899 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Inner content wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.3)',
              marginBottom: '24px',
            }}
          >
            嗨呀！✨
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '48px',
            }}
          >
            {formatDate(entry.date)}
          </div>

          {/* Emoji rating */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '48px',
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '32px',
              padding: '24px 64px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            {RATING_EMOJIS[entry.rating]}
          </div>

          {/* Content card */}
          <div
            style={{
              width: '80%',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.95) 100%)',
              borderRadius: '40px',
              padding: '48px 56px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              marginBottom: '48px',
            }}
          >
            <p
              style={{
                fontSize: '32px',
                lineHeight: 1.8,
                color: '#78350F',
                textAlign: 'center',
                margin: 0,
                wordBreak: 'break-word',
              }}
            >
              {entry.content || '今天没有写什么...'}
            </p>
          </div>

          {/* User signature */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            🌸 {userId ? `@${userId}` : '@HiYa'} 🌸
          </div>
        </div>
      </div>

      {/* Visible modal for preview */}
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
          {/* Poster Preview - matches hidden container style */}
          <div
            className="relative overflow-hidden p-8 aspect-square"
            style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #F97316 30%, #EA580C 60%, #EC4899 100%)',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              {/* Title */}
              <h2 
                className="text-4xl font-black text-white mb-2"
                style={{
                  textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                }}
              >
                嗨呀！✨
              </h2>
              
              {/* Date */}
              <div className="text-white/90 text-sm font-semibold mb-4">
                {formatDate(entry.date)}
              </div>
              
              {/* Emoji rating */}
              <div 
                className="text-5xl mb-4 px-6 py-2 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                {RATING_EMOJIS[entry.rating]}
              </div>
              
              {/* Content card */}
              <div 
                className="w-[80%] rounded-2xl p-5 mb-4"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.95) 100%)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                }}
              >
                <p 
                  className="text-sm leading-relaxed text-center"
                  style={{ color: '#78350F' }}
                >
                  {entry.content || '今天没有写什么...'}
                </p>
              </div>
              
              {/* User signature */}
              <div className="text-white/90 text-sm font-bold">
                🌸 {userId ? `@${userId}` : '@HiYa'} 🌸
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div 
            className="p-4 flex gap-3"
            style={{ background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#EA580C',
              }}
            >
              <X className="w-4 h-4" />
              关闭
            </motion.button>
            <BubbleButton
              onClick={handleSave}
              disabled={isGenerating || !fontsLoaded}
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
