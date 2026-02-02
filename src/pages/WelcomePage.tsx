import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playHaiya } from '@/lib/sfx';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    playHaiya();
    // Mark as seen
    localStorage.setItem('haiya_welcome_seen', 'true');
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-safe pt-safe"
      style={{
        background: 'linear-gradient(180deg, hsl(27 95% 60% / 0.3) 0%, hsl(0 0% 100%) 60%, hsl(0 0% 98%) 100%)',
      }}
    >
      {/* Breathing glasses smile icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-8xl sm:text-9xl mb-8"
      >
        🤓
      </motion.div>

      {/* Title with gradient */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl sm:text-6xl font-bold mb-2"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(27 95% 60%) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        嗨呀！
      </motion.h1>

      {/* Welcome text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-foreground/80 mb-6 text-center"
      >
        ✨ 你来到了专属于你的"嗨呀时刻"！😋
      </motion.p>

      {/* Quote blockquote */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/10 rounded-2xl px-6 py-4 mb-6 max-w-sm text-center"
      >
        <p className="text-foreground/90 text-sm leading-relaxed">
          <span className="font-medium">@HiYaJoHn 说：</span>
          <br />
          "在这里，所有的开心与数据，都只属于你自己！🔐"
        </p>
      </motion.blockquote>

      {/* Data storage reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 bg-muted/20 rounded-xl px-4 py-3 mb-10 max-w-sm"
      >
        <span className="text-xl bg-muted/30 rounded-lg p-1">📦</span>
        <p className="text-muted-foreground text-xs leading-relaxed">
          <span className="font-medium">小提醒：</span> 本软件的所有数据都存储在本地，换手机记得备份导出哦！🏠
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-br from-primary to-chart-1 text-primary-foreground font-bold text-lg shadow-xl"
        style={{ boxShadow: '0 8px 30px hsl(var(--primary) / 0.4)' }}
      >
        来嗨呀！
      </motion.button>
    </div>
  );
};

export default WelcomePage;
