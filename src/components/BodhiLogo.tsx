
import React from 'react';
import { cn } from '@/lib/utils';

interface BodhiLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BodhiLogo: React.FC<BodhiLogoProps> = ({ 
  size = 'medium',
  className 
}) => {
  const sizeClasses = {
    small: "text-2xl",
    medium: "text-3xl",
    large: "text-4xl"
  };
  
  return (
    <div className={cn(
      "font-rubik text-bodhi-darkOrange leading-[22px]", 
      sizeClasses[size],
      className
    )}>
      BODHI
    </div>
  );
};

export default BodhiLogo;
