
import React from 'react';

interface TempleCircleProps {
  name: string;
  imageUrl?: string;
}

const TempleCircle: React.FC<TempleCircleProps> = ({ name, imageUrl }) => {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden mb-[5px]">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        )}
      </div>
      <span className="text-[13px] font-medium text-center">{name}</span>
    </div>
  );
};

export default TempleCircle;
