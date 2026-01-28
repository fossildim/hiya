import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
}

const UnlockModal = ({ isOpen, onClose, daysRemaining }: UnlockModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative overflow-hidden rounded-3xl max-w-xs w-full shadow-2xl"
            style={{
              background:
                'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 55%, hsl(var(--primary) / 0.14) 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Heart className="w-8 h-8 text-primary" />
            </div>

            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--chart-1)) 100%)',
                  boxShadow: '0 10px 26px hsl(var(--primary) / 0.22)',
                }}
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              {/* Title */}
              <h2 
                className="text-2xl font-bold mb-3 text-foreground"
              >
                嗨呀！商店
              </h2>

              {/* Message */}
              <p 
                className="text-base mb-6 leading-relaxed text-muted-foreground"
              >
                还差 <span className="font-bold text-xl text-primary">{daysRemaining}</span> 天
                <br />
                即可开启嗨呀！商店！
              </p>

              {/* Encouragement */}
              <p 
                className="text-sm mb-6 text-muted-foreground"
              >
                坚持记录每天的开心事~
                <br />
                好东西在等着你哦 ✨
              </p>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 rounded-full font-bold text-primary-foreground shadow-lg bg-gradient-to-br from-primary to-chart-1"
              >
                好嗨呀！🧡
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnlockModal;
