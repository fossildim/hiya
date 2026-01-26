import { motion } from 'framer-motion';

interface SmileRatingProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'poster';
}

const smileFaces = [
  { emoji: '😊', label: '嗨呀！', bg: 'bg-orange-100' },
  { emoji: '😄', label: '嗨呀！！', bg: 'bg-amber-100' },
  { emoji: '🥰', label: '嗨呀呀呀！', bg: 'bg-orange-200' },
  { emoji: '😍', label: '嗨--呀！！', bg: 'bg-amber-200' },
  { emoji: '🤩', label: '嗨呀！嗨呀！嗨呀！', bg: 'bg-yellow-100' },
];

const sizeClasses = {
  sm: { text: 'text-xl', box: 'w-10 h-10 rounded-lg' },
  md: { text: 'text-2xl', box: 'w-12 h-12 rounded-xl' },
  lg: { text: 'text-3xl', box: 'w-14 h-14 rounded-xl' },
};

const SmileRating = ({ value, onChange, readonly = false, size = 'lg', variant = 'default' }: SmileRatingProps) => {
  const showBoxes = variant === 'poster';
  
  return (
    <div className="flex items-center justify-center gap-2">
      {smileFaces.map((face, index) => {
        const rating = index + 1;
        const isSelected = value === rating;
        const sizeConfig = sizeClasses[size];
        
        if (showBoxes) {
          // Poster variant with colored boxes
          return (
            <div
              key={rating}
              className={`
                ${sizeConfig.box} ${face.bg}
                flex items-center justify-center
                ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60'}
                transition-all duration-200
              `}
            >
              <span className={sizeConfig.text}>{face.emoji}</span>
            </div>
          );
        }
        
        // Default variant
        return (
          <motion.button
            key={rating}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange(rating)}
            className={`
              ${sizeConfig.text}
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
