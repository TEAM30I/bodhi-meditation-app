
import React from 'react';
import { cn } from '@/lib/utils';

interface BodhiButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'kakao' | 'naver';
  className?: string;
  onClick?: () => void;
}

const BodhiButton: React.FC<BodhiButtonProps> = ({ 
  children, 
  variant = 'primary',
  className,
  onClick
}) => {
  const baseStyles = "w-full h-[60px] rounded-[18px] font-semibold text-lg flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-bodhi-orange text-white",
    secondary: "bg-bodhi-gray text-white",
    kakao: "bg-[#FDDC3F] text-[#341F1E] relative",
    naver: "bg-[#00C73C] text-white relative"
  };

  return (
    <button 
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default BodhiButton;
