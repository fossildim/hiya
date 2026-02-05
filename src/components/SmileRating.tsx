import { motion } from 'framer-motion';

interface SmileRatingProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'poster';
}

// 3-level rating system
const smileFaces = [
  { emoji: '😊', label: '嗨呀！' },
  { emoji: '😆', label: '嗨呀呀！！' },
  { emoji: '🤩', label: '嗨呀嗨呀！！！' },
];

const sizeClasses = {
  sm: { text: 'text-2xl', box: 'w-12 h-12 rounded-xl' },
  md: { text: 'text-4xl', box: 'w-16 h-16 rounded-2xl' },
  lg: { text: 'text-5xl', box: 'w-20 h-20 rounded-3xl' },
};

const SmileRating = ({ value, onChange, readonly = false, size = 'lg', variant = 'default' }: SmileRatingProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {smileFaces.map((face, index) => {
        const rating = index + 1;
        const isSelected = value === rating;
        const sizeConfig = sizeClasses[size];

        return (
          <motion.button
            key={rating}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange(rating)}
            className={`relative p-3 rounded-full transition-all duration-300 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            style={{
              background: isSelected 
                ? 'linear-gradient(145deg, hsl(var(--primary) / 0.2) 0%, hsl(var(--primary) / 0.1) 100%)'
                : 'transparent',
              boxShadow: isSelected 
                ? '0 0 30px hsl(var(--primary) / 0.4), 0 8px 25px hsl(var(--primary) / 0.3)'
                : 'none',
              border: isSelected ? '3px solid hsl(var(--primary))' : '3px solid transparent',
            }}
            animate={isSelected ? {
              scale: [1, 1.08, 1],
              rotate: [0, -3, 3, 0],
            } : { scale: 1, rotate: 0 }}
            transition={isSelected ? {
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 1,
            } : {}}
            whileHover={!readonly ? { scale: 1.15 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            aria-label={face.label}
          >
            <span className={`${sizeConfig.text} ${isSelected ? '' : 'opacity-50'}`}>
              {face.emoji}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default SmileRating;
