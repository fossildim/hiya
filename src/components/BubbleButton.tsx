import { motion } from 'framer-motion';
import { useState } from 'react';

interface BubbleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary';
  'data-testid'?: string;
}

const BubbleButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  size = 'md',
  variant = 'primary',
  'data-testid': testId,
}: BubbleButtonProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 600);
    
    onClick?.();
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm rounded-xl',
    md: 'py-3 px-6 text-base rounded-2xl',
    lg: 'py-4 px-8 text-lg rounded-2xl',
    xl: 'py-5 px-10 text-xl rounded-3xl',
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)',
      boxShadow: '0 8px 30px rgba(251, 146, 60, 0.5), 0 0 20px rgba(251, 146, 60, 0.3)',
      color: 'white',
    },
    secondary: {
      background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      boxShadow: '0 4px 20px rgba(251, 146, 60, 0.3)',
      color: '#9A3412',
    },
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative font-bold ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={variantStyles[variant]}
      data-testid={testId}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-inherit opacity-60 blur-md -z-10"
        style={{ 
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)'
            : 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
          borderRadius: 'inherit',
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{ 
                opacity: 0, 
                scale: 1,
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 text-xs"
              style={{ 
                color: ['#FB923C', '#EA580C', '#FBBF24', '#F472B6', '#A855F7'][i % 5],
              }}
            >
              {['✨', '🎉', '⭐', '💫', '🌟'][i % 5]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default BubbleButton;
