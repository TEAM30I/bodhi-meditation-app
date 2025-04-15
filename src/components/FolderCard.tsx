import React from 'react';

interface FolderCardProps {
  id: string;
  name: string;
  count: number;
  type: string;
  image: string;
  onClick?: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ 
  id, 
  name, 
  count, 
  type, 
  image, 
  onClick 
}) => {
  return (
    <div 
      className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex">
        <div className="w-[120px] h-[120px] flex-shrink-0">
          <img 
            src={image || "https://via.placeholder.com/120"} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-[9px] p-3 flex-1">
          <h2 className="font-bold text-[#2b2828] text-[15px] tracking-[0.30px] leading-[19.5px]">
            {name}
          </h2>
          <p className="font-medium text-[#999999] text-[13px] tracking-[0.26px] leading-[16.9px] mt-1">
            {type} {count}개
          </p>
        </div>
      </div>
    </div>
  );
};

export default FolderCard; 