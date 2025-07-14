import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 10,
  size = 'default',
  className
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverValue || value);
        
        return (
          <button
            key={index}
            type="button"
            className={cn(
              "transition-all duration-200 hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              "rounded-sm"
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                isActive 
                  ? "fill-primary text-primary" 
                  : "text-muted-foreground hover:text-primary/70"
              )}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium text-foreground">
        {value}/{max}
      </span>
    </div>
  );
};