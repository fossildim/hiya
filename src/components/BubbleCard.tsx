import { motion } from 'framer-motion';

interface BubbleCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  delay?: number;
  onClick?: () => void;
}

const BubbleCard = ({ 
  children, 
  className = '', 
  glow = false,
  delay = 0,
  onClick,
}: BubbleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`relative rounded-3xl p-4 sm:p-5 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,251,245,0.9) 100%)',
        boxShadow: glow 
          ? '0 10px 40px rgba(251, 146, 60, 0.25), 0 0 30px rgba(251, 146, 60, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
          : '0 8px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: glow 
          ? '2px solid rgba(251, 146, 60, 0.3)'
          : '2px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Glossy highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
          borderRadius: 'inherit',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default BubbleCard;
