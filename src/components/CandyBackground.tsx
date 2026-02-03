import { motion } from 'framer-motion';

interface CandyBackgroundProps {
  children?: React.ReactNode;
}

const CandyBackground = ({ children }: CandyBackgroundProps) => {
  return (
    <>
      {/* Vibrant orange to pink diagonal gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 25%, #FDBA74 50%, #FCA5A5 75%, #FDA4AF 100%)',
        }}
      />
      
      {/* Floating decorations layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Orange 1 - top right */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: 360,
          }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
          className="absolute top-[10%] right-[5%] text-4xl opacity-40"
        >
          <span role="img" aria-label="orange">🍊</span>
        </motion.div>
        
        {/* Sun - top left */}
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: -360,
          }}
          transition={{ 
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" }
          }}
          className="absolute top-[5%] left-[10%] text-3xl opacity-30"
        >
          <span role="img" aria-label="sun">☀️</span>
        </motion.div>
        
        {/* Star - center right */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] right-[8%] text-2xl opacity-50"
        >
          <span role="img" aria-label="star">✨</span>
        </motion.div>
        
        {/* Smile - bottom left */}
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            x: [0, 5, 0],
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[30%] left-[5%] text-3xl opacity-35"
        >
          <span role="img" aria-label="smile">🙂</span>
        </motion.div>
        
        {/* Orange 2 - bottom right */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: -360,
          }}
          transition={{ 
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" }
          }}
          className="absolute bottom-[15%] right-[15%] text-3xl opacity-25"
        >
          <span role="img" aria-label="orange">🍊</span>
        </motion.div>
        
        {/* Star 2 - top center */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[25%] left-[50%] text-xl"
        >
          <span role="img" aria-label="star">✨</span>
        </motion.div>
      </div>
      
      {children}
    </>
  );
};

export default CandyBackground;
