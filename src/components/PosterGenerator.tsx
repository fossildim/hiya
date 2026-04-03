import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveCanvasAsImage } from '@/lib/fileSaver';
import { Entry } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';
import { getThemeById } from '@/lib/themes';

interface PosterGeneratorProps {
  entry: Entry;
  userId: string;
  onClose: () => void;
}

const RATING_EMOJIS = ['', '😊', '😆', '🤩'];
const RATING_LABELS = ['', '嗨呀！', '嗨呀呀！！', '嗨呀嗨呀！！！'];

// Theme-specific decorative elements for the poster
const getThemeDecorations = (themeId: string) => {
  const decos: Record<string, { accent: string; deco: string; pattern: string }> = {
    red:    { accent: '#FCA5A5', deco: '🔥', pattern: '❤️' },
    orange: { accent: '#FDBA74', deco: '🍊', pattern: '✨' },
    yellow: { accent: '#FDE68A', deco: '🌻', pattern: '⭐' },
    green:  { accent: '#86EFAC', deco: '🍀', pattern: '🌿' },
    cyan:   { accent: '#67E8F9', deco: '🧊', pattern: '💎' },
    blue:   { accent: '#93C5FD', deco: '🌊', pattern: '🦋' },
    purple: { accent: '#C4B5FD', deco: '🔮', pattern: '🪻' },
    pink:   { accent: '#FBCFE8', deco: '🌸', pattern: '💗' },
    black:  { accent: '#4ADE80', deco: '⚡', pattern: '🖤' },
    white:  { accent: '#A3A3A3', deco: '🤍', pattern: '🕊️' },
  };
  return decos[themeId] || decos.orange;
};

const PosterGenerator = ({ entry, userId, onClose }: PosterGeneratorProps) => {
  const hiddenContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { settings } = useApp();

  const themeId = settings.currentTheme || 'orange';
  const isNeonTheme = themeId === 'black';
  const isHoloTheme = themeId === 'white';
  const isYellowTheme = themeId === 'yellow';
  const themeDeco = getThemeDecorations(themeId);

  const getThemeGradient = () => {
    const gradients: Record<string, string> = {
      red:    'linear-gradient(160deg, #FCA5A5 0%, #EF4444 40%, #DC2626 70%, #B91C1C 100%)',
      orange: 'linear-gradient(160deg, #FDBA74 0%, #FB923C 40%, #F97316 70%, #EA580C 100%)',
      yellow: 'linear-gradient(160deg, #FDE68A 0%, #FBBF24 40%, #F59E0B 70%, #D97706 100%)',
      green:  'linear-gradient(160deg, #86EFAC 0%, #4ADE80 40%, #22C55E 70%, #16A34A 100%)',
      cyan:   'linear-gradient(160deg, #67E8F9 0%, #22D3EE 40%, #06B6D4 70%, #0891B2 100%)',
      blue:   'linear-gradient(160deg, #93C5FD 0%, #60A5FA 40%, #3B82F6 70%, #2563EB 100%)',
      purple: 'linear-gradient(160deg, #C4B5FD 0%, #A78BFA 40%, #8B5CF6 70%, #7C3AED 100%)',
      pink:   'linear-gradient(160deg, #FBCFE8 0%, #F9A8D4 40%, #EC4899 70%, #DB2777 100%)',
      black:  'linear-gradient(160deg, #1E293B 0%, #0F172A 50%, #020617 100%)',
      white:  'linear-gradient(160deg, #FAFAFA 0%, #F5F5F5 40%, #E5E5E5 70%, #FAFAFA 100%)',
    };
    return gradients[themeId] || gradients.orange;
  };

  const getTextColor = () => {
    if (isYellowTheme || isHoloTheme) return '#78350F';
    if (isNeonTheme) return '#4ADE80';
    return '#FFFFFF';
  };

  const getSubTextColor = () => {
    if (isYellowTheme || isHoloTheme) return '#92400E';
    if (isNeonTheme) return '#86EFAC';
    return 'rgba(255,255,255,0.75)';
  };

  const getCardBgStyle = () => {
    if (isNeonTheme) return {
      background: 'rgba(30, 41, 59, 0.9)',
      border: '2px solid #4ADE80',
      boxShadow: '0 0 30px rgba(74, 222, 128, 0.2)',
    };
    if (isHoloTheme) return {
      background: 'linear-gradient(white, white), linear-gradient(90deg, #EF4444, #F97316, #FBBF24, #22C55E, #3B82F6, #8B5CF6, #EC4899)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: '3px solid transparent',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    };
    return {
      background: 'rgba(255,255,255,0.92)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    };
  };

  const getCardTextColor = () => {
    const colors: Record<string, string> = {
      red: '#7F1D1D', orange: '#78350F', yellow: '#713F12', green: '#14532D',
      cyan: '#164E63', blue: '#1E3A8A', purple: '#4C1D95', pink: '#831843',
      black: '#4ADE80', white: '#334155',
    };
    return colors[themeId] || '#78350F';
  };

  useEffect(() => { document.fonts.ready.then(() => setFontsLoaded(true)); }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  const handleSave = async () => {
    if (!hiddenContainerRef.current || !fontsLoaded) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(hiddenContainerRef.current, {
        scale: 3, backgroundColor: null, useCORS: true, allowTaint: true, logging: false,
      });
      const result = await saveCanvasAsImage(canvas, `haiya-${entry.date}.png`);
      if (!result.success) {
        console.error('Save failed');
      }
    } catch (error) {
      console.error('Failed to generate poster:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const titleStyle: React.CSSProperties = isNeonTheme
    ? { color: '#4ADE80', textShadow: '0 0 30px #4ADE80, 0 0 60px #4ADE80' }
    : isHoloTheme
    ? { background: 'linear-gradient(90deg, #EF4444, #F97316, #FBBF24, #22C55E, #3B82F6, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
    : { color: getTextColor(), textShadow: '3px 3px 0 rgba(0,0,0,0.15)' };

  // Shared poster content (used for both hidden render and preview)
  const PosterContent = ({ scale = 1 }: { scale?: number }) => {
    const s = (v: number) => v * scale;
    return (
      <div style={{
        width: `${s(1080)}px`,
        height: `${s(1440)}px`,
        background: getThemeGradient(),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${s(60)}px ${s(60)}px`,
        fontFamily: 'system-ui, -apple-system, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative corner elements */}
        <div style={{ position: 'absolute', top: s(30), left: s(30), fontSize: `${s(36)}px`, opacity: 0.4 }}>{themeDeco.pattern}</div>
        <div style={{ position: 'absolute', top: s(30), right: s(30), fontSize: `${s(36)}px`, opacity: 0.4 }}>{themeDeco.pattern}</div>
        <div style={{ position: 'absolute', bottom: s(30), left: s(30), fontSize: `${s(36)}px`, opacity: 0.4 }}>{themeDeco.pattern}</div>
        <div style={{ position: 'absolute', bottom: s(30), right: s(30), fontSize: `${s(36)}px`, opacity: 0.4 }}>{themeDeco.pattern}</div>

        {/* Top: Date */}
        <div style={{ paddingTop: s(40), paddingBottom: s(20), textAlign: 'center' }}>
          <div style={{ fontSize: `${s(30)}px`, fontWeight: 600, color: getSubTextColor(), letterSpacing: `${s(2)}px` }}>
            {formatDate(entry.date)}
          </div>
        </div>

        {/* Upper 1/3: "嗨呀！" + emoji */}
        <div style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${s(20)}px`,
        }}>
          <div style={{ fontSize: `${s(80)}px`, fontWeight: 900, ...titleStyle }}>
            {RATING_LABELS[entry.rating] || '嗨呀！'}
          </div>
          <div style={{ fontSize: `${s(80)}px` }}>
            {RATING_EMOJIS[entry.rating] || '😊'}
          </div>
          <div style={{ fontSize: `${s(20)}px`, opacity: 0.5, color: getTextColor() }}>
            {themeDeco.deco} {themeDeco.deco} {themeDeco.deco}
          </div>
        </div>

        {/* Lower 1/3: Content card */}
        <div style={{
          flex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          <div style={{
            width: '88%',
            borderRadius: `${s(28)}px`,
            padding: `${s(36)}px ${s(44)}px`,
            ...getCardBgStyle(),
          }}>
            <p style={{
              fontSize: `${s(26)}px`,
              lineHeight: 1.8,
              color: getCardTextColor(),
              textAlign: 'center',
              margin: 0,
              wordBreak: 'break-word',
            }}>
              {entry.content || '今天没有写什么...'}
            </p>
          </div>
        </div>

        {/* Bottom: @ID */}
        <div style={{
          paddingTop: s(16),
          paddingBottom: s(30),
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: `${s(28)}px`,
            fontWeight: 700,
            color: isNeonTheme ? '#F472B6' : getSubTextColor(),
            textShadow: isNeonTheme ? '0 0 20px #F472B6' : 'none',
          }}>
            {themeDeco.pattern} {userId ? `@${userId}` : '@HiYa'} {themeDeco.pattern}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {/* Hidden container for high-quality export (1080x1440, 3:4) */}
      <div
        ref={hiddenContainerRef}
        style={{ position: 'fixed', left: '-9999px', top: 0 }}
      >
        <PosterContent scale={1} />
      </div>

      {/* Visible modal preview */}
      <motion.div
        key="poster-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          key="poster-card"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-3xl overflow-hidden max-w-xs w-full"
          style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Preview scaled down - use CSS aspect ratio container */}
          <div className="w-full relative" style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1080px',
              height: '1440px',
              transform: 'scale(var(--poster-scale))',
              transformOrigin: 'top left',
            }} ref={(el) => {
              if (el) {
                const parent = el.parentElement;
                if (parent) {
                  const scale = parent.offsetWidth / 1080;
                  el.style.setProperty('--poster-scale', String(scale));
                  const ro = new ResizeObserver(() => {
                    el.style.setProperty('--poster-scale', String(parent.offsetWidth / 1080));
                  });
                  ro.observe(parent);
                }
              }
            }}>
              <PosterContent scale={1} />
            </div>
          </div>

          {/* Actions */}
          <div
            className="p-3 flex gap-3"
            style={{ background: isNeonTheme ? '#0F172A' : 'hsl(var(--primary))' }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
              style={{
                background: isNeonTheme ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.9)',
                color: isNeonTheme ? '#4ADE80' : 'hsl(var(--primary))',
                border: isNeonTheme ? '2px solid #4ADE80' : 'none',
              }}
            >
              <X className="w-4 h-4" /> 关闭
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isGenerating || !fontsLoaded}
              className="flex-1 py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
              style={{
                background: isNeonTheme
                  ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                  : isHoloTheme
                  ? 'linear-gradient(135deg, #EF4444, #F97316, #FBBF24, #22C55E, #3B82F6, #8B5CF6, #EC4899)'
                  : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85))',
                color: isYellowTheme ? '#78350F' : '#FFFFFF',
                border: isNeonTheme ? '2px solid #4ADE80' : 'none',
                boxShadow: isNeonTheme ? '0 0 20px rgba(74,222,128,0.3)' : '0 4px 15px hsl(var(--primary) / 0.3)',
              }}
            >
              <Download className="w-4 h-4" /> {isGenerating ? '生成中...' : '保存'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PosterGenerator;
