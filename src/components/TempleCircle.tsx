
import React from 'react';
import { cn } from '@/lib/utils';

interface TempleCircleProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

const TempleCircle: React.FC<TempleCircleProps> = ({ name, imageUrl, className }) => {
  return (
    <div className={cn("flex flex-col items-center flex-shrink-0", className)}>
      <div className="w-[68px] h-[68px] rounded-full overflow-hidden mb-[3px] bg-gray-200">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            사진
          </div>
        )}
      </div>
      <div className="text-[#222] text-[12px] tracking-[-0.025em]">
        {name}
      </div>
    </div>
  );
};

export default TempleCircle;
