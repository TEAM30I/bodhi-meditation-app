
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Temple } from '@/data/templeRepository';

interface TempleItemProps {
  temple: Temple;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/temple/${temple.id}`);
  };

  return (
    <div className="flex gap-4 mb-6 cursor-pointer" onClick={handleClick}>
      <div className="w-[109px] h-[126px] overflow-hidden rounded-[6px]">
        <img 
          src={temple.imageUrl} 
          alt={temple.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-bold text-[#222] font-pretendard mb-1">{temple.name}</h3>
        <p className="text-sm text-[#8B8B8B] font-pretendard mb-8">
          {temple.location} {temple.distance && `· ${temple.distance}`}
        </p>
        {temple.tags && (
          <p className="text-xs text-[#8B8B8B] font-pretendard">
            {temple.tags.map((tag, i) => `#${tag}`).join(' ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default TempleItem;
