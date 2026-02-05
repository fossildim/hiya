 import { useRef, useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { X, Download } from 'lucide-react';
 import html2canvas from 'html2canvas';
 import { Entry } from '@/context/AppContext';
 import BubbleButton from './BubbleButton';
 import { useApp } from '@/context/AppContext';
 import { getThemeById } from '@/lib/themes';
 
 interface PosterGeneratorProps {
   entry: Entry;
   userId: string;
   onClose: () => void;
 }
 
 // 3-level rating system
 const RATING_EMOJIS = ['', '😊', '😆', '🤩'];
 const RATING_LABELS = ['', '嗨呀！', '嗨呀呀！！', '嗨呀嗨呀！！！'];
 
 const PosterGenerator = ({ entry, userId, onClose }: PosterGeneratorProps) => {
   const hiddenContainerRef = useRef<HTMLDivElement>(null);
   const [isGenerating, setIsGenerating] = useState(false);
   const [fontsLoaded, setFontsLoaded] = useState(false);
   const { settings } = useApp();
 
   const themeId = settings.currentTheme || 'orange';
   const currentTheme = getThemeById(themeId);
   const isNeonTheme = themeId === 'black';
   const isHoloTheme = themeId === 'white';
   const isYellowTheme = themeId === 'yellow';
 
   // Theme-specific gradients for poster
   const getThemeGradient = () => {
     const gradients: Record<string, string> = {
       'red': 'linear-gradient(135deg, #FCA5A5 0%, #EF4444 30%, #DC2626 60%, #F97316 100%)',
       'orange': 'linear-gradient(135deg, #FDBA74 0%, #FB923C 30%, #F97316 60%, #FBBF24 100%)',
       'yellow': 'linear-gradient(135deg, #FDE68A 0%, #FBBF24 30%, #F59E0B 60%, #FB923C 100%)',
       'green': 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 30%, #22C55E 60%, #10B981 100%)',
       'cyan': 'linear-gradient(135deg, #67E8F9 0%, #22D3EE 30%, #06B6D4 60%, #3B82F6 100%)',
       'blue': 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 30%, #3B82F6 60%, #6366F1 100%)',
       'purple': 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 30%, #8B5CF6 60%, #D946EF 100%)',
       'pink': 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 30%, #EC4899 60%, #F43F5E 100%)',
       'black': 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #020617 100%)',
       'white': 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 30%, #E5E5E5 60%, #FAFAFA 100%)',
     };
     return gradients[themeId] || gradients['orange'];
   };
 
   const getTextColor = () => {
     if (isYellowTheme || isHoloTheme) return '#78350F';
     if (isNeonTheme) return '#4ADE80';
     return '#FFFFFF';
   };
 
   const getCardBgStyle = () => {
     if (isNeonTheme) {
       return {
         background: 'rgba(30, 41, 59, 0.95)',
         border: '2px solid #4ADE80',
         boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
       };
     }
     if (isHoloTheme) {
       return {
         background: 'linear-gradient(white, white), linear-gradient(90deg, #EF4444, #F97316, #FBBF24, #22C55E, #3B82F6, #8B5CF6, #EC4899)',
         backgroundOrigin: 'border-box',
         backgroundClip: 'padding-box, border-box',
         border: '3px solid transparent',
         boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
       };
     }
     return {
       background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.95) 100%)',
       boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
     };
   };
 
   const getCardTextColor = () => {
     const colors: Record<string, string> = {
       'red': '#7F1D1D',
       'orange': '#78350F',
       'yellow': '#713F12',
       'green': '#14532D',
       'cyan': '#164E63',
       'blue': '#1E3A8A',
       'purple': '#4C1D95',
       'pink': '#831843',
       'black': '#4ADE80',
       'white': '#334155',
     };
     return colors[themeId] || '#78350F';
   };
 
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
       await new Promise(resolve => setTimeout(resolve, 100));
       
       const canvas = await html2canvas(hiddenContainerRef.current, {
         scale: 3,
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
 
   const titleStyle = isNeonTheme 
     ? { color: '#4ADE80', textShadow: '0 0 30px #4ADE80, 0 0 60px #4ADE80' }
     : isHoloTheme
     ? { 
         background: 'linear-gradient(90deg, #EF4444, #F97316, #FBBF24, #22C55E, #3B82F6, #8B5CF6, #EC4899)',
         WebkitBackgroundClip: 'text',
         WebkitTextFillColor: 'transparent',
       }
     : { color: getTextColor(), textShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.3)' };
 
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
           background: getThemeGradient(),
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'space-between',
           alignItems: 'center',
           padding: '80px 60px',
           fontFamily: 'system-ui, -apple-system, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif',
         }}
       >
         {/* Section 1: Title + Date */}
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
           <div style={{ fontSize: '96px', fontWeight: 900, marginBottom: '16px', ...titleStyle }}>
             嗨呀！✨
           </div>
           <div style={{ fontSize: '32px', fontWeight: 600, color: getTextColor(), opacity: 0.9 }}>
             {formatDate(entry.date)}
           </div>
         </div>
 
         {/* Section 2: Emoji */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
           <div style={{ fontSize: '160px' }}>{RATING_EMOJIS[entry.rating] || '😊'}</div>
         </div>
 
         {/* Section 3: Content with rounded background */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
           <div style={{ 
             width: '85%', 
             borderRadius: '32px', 
             padding: '36px 48px',
             ...getCardBgStyle(),
           }}>
             <p style={{
               fontSize: '28px',
               lineHeight: 1.7,
               color: getCardTextColor(),
               textAlign: 'center',
               margin: 0,
               wordBreak: 'break-word',
             }}>
               {entry.content || '今天没有写什么...'}
             </p>
           </div>
         </div>
 
         {/* Section 4: User ID */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
           <div style={{
             fontSize: '36px',
             fontWeight: 700,
             color: isNeonTheme ? '#F472B6' : getTextColor(),
             textShadow: isNeonTheme ? '0 0 20px #F472B6' : 'none',
             opacity: 0.9,
           }}>
             ✨ {userId ? `@${userId}` : '@HiYa'} ✨
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
           style={{ boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3), 0 0 50px rgba(0, 0, 0, 0.1)' }}
           onClick={(e) => e.stopPropagation()}
         >
           {/* Poster Preview - 4 equal sections */}
           <div
             className="relative overflow-hidden aspect-square flex flex-col"
             style={{ background: getThemeGradient(), padding: '20px' }}
           >
             {/* Section 1: Title + Date */}
             <div className="flex-1 flex flex-col items-center justify-center">
               <h2 
                 className="text-3xl font-black mb-1"
                 style={titleStyle}
               >
                 嗨呀！✨
               </h2>
               <div 
                 className="text-xs font-semibold"
                 style={{ color: getTextColor(), opacity: 0.9 }}
               >
                 {formatDate(entry.date)}
               </div>
             </div>
 
             {/* Section 2: Emoji */}
             <div className="flex-1 flex items-center justify-center">
               <div className="text-6xl">{RATING_EMOJIS[entry.rating] || '😊'}</div>
             </div>
 
             {/* Section 3: Content with rounded background */}
             <div className="flex-1 flex items-center justify-center">
               <div 
                 className="w-[85%] rounded-xl p-4"
                 style={getCardBgStyle()}
               >
                 <p 
                   className="text-xs leading-relaxed text-center"
                   style={{ color: getCardTextColor() }}
                 >
                   {entry.content || '今天没有写什么...'}
                 </p>
               </div>
             </div>
 
             {/* Section 4: User ID */}
             <div className="flex-1 flex items-center justify-center">
               <div 
                 className="text-sm font-bold"
                 style={{ 
                   color: isNeonTheme ? '#F472B6' : getTextColor(),
                   textShadow: isNeonTheme ? '0 0 10px #F472B6' : 'none',
                   opacity: 0.9,
                 }}
               >
                 ✨ {userId ? `@${userId}` : '@HiYa'} ✨
               </div>
             </div>
           </div>
           
           {/* Actions - No buttons in generated image */}
           <div 
             className="p-4 flex gap-3"
             style={{ background: isNeonTheme ? '#0F172A' : 'hsl(var(--primary))' }}
           >
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.95 }}
               onClick={onClose}
               className="flex-1 py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2"
               style={{
                 background: isNeonTheme ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.9)',
                 color: isNeonTheme ? '#4ADE80' : 'hsl(var(--primary))',
                 border: isNeonTheme ? '2px solid #4ADE80' : 'none',
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