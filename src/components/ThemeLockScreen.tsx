import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ThemeLockScreenProps {
  daysRecorded: number;
  onClose: () => void;
}

const ThemeLockScreen = ({ daysRecorded, onClose }: ThemeLockScreenProps) => {
  const navigate = useNavigate();
  const remainingDays = 20 - daysRecorded;
  const progress = Math.min((daysRecorded / 20) * 100, 100);

  const handleGoRecord = () => {
    onClose();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal content with bounce animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="relative bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border/50 overflow-hidden"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Animated emoji */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-7xl mb-4"
          >
            <span role="img" aria-label="seedling">🌱</span>
          </motion.div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-primary mb-2">
            嗨呀！惊喜正在酝酿中...
          </h2>
          
          {/* Subtitle */}
          <p className="text-sm text-muted-foreground mb-4">
            心理学发现，21天能重塑大脑的快乐回路。
          </p>
          
          {/* Motivation text */}
          <p className="text-card-foreground mb-6">
            你已经坚持了 <span className="font-bold text-primary">{daysRecorded}</span> 天！
            再坚持 <span className="font-bold text-accent">{remainingDays}</span> 天，
            独家主题库将为你开通！
          </p>
          
          {/* Progress bar container */}
          <div className="mb-6">
            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
              {/* Progress fill with gradient and shine effect */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
                }}
              >
                {/* Shine effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                  className="absolute inset-0 w-1/2"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  }}
                />
              </motion.div>
              
              {/* Progress text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-foreground drop-shadow-sm">
                  {daysRecorded} / 20
                </span>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoRecord}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
            }}
            data-testid="button-go-record"
          >
            去记录今天的开心！
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeLockScreen;
