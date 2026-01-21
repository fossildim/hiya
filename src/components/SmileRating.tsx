import { motion } from 'framer-motion';

interface SmileRatingProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const smileFaces = [
  { emoji: '😊', label: '嗨呀！' },
  { emoji: '😄', label: '嗨呀！！' },
  { emoji: '🤗', label: '嗨呀呀呀！' },
  { emoji: '🥰', label: '嗨--呀！！' },
  { emoji: '🥳', label: '嗨呀！嗨呀！嗨呀！' },
];

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
};

const SmileRating = ({ value, onChange, readonly = false, size = 'lg' }: SmileRatingProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {smileFaces.map((face, index) => {
        const rating = index + 1;
        const isSelected = value === rating;
        
        return (
          <motion.button
            key={rating}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange(rating)}
            className={`
              ${sizeClasses[size]}
              transition-all duration-200
              ${isSelected ? 'scale-125' : 'opacity-50 hover:opacity-80'}
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
            `}
            whileHover={!readonly ? { scale: isSelected ? 1.25 : 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.95 } : {}}
            aria-label={face.label}
          >
            {face.emoji}
          </motion.button>
        );
      })}
    </div>
  );
};

export default SmileRating;
