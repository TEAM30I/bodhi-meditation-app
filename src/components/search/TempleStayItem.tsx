
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TempleStay } from '@/data/templeStayRepository';

interface TempleStayItemProps {
  templeStay: TempleStay;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/temple-stay/${templeStay.id}`);
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  return (
    <div className="flex gap-4 mb-6 cursor-pointer" onClick={handleClick}>
      <div className="w-[109px] h-[126px] overflow-hidden rounded-[6px]">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-base font-bold text-[#222] font-pretendard mb-1">{templeStay.name}</h3>
        <p className="text-sm text-[#8B8B8B] font-pretendard mb-4">
          {templeStay.location}
        </p>
        <p className="text-sm font-semibold text-[#222] font-pretendard mb-2">
          {formatPrice(templeStay.price)} / {templeStay.duration}
        </p>
        <div className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1.5L8.67594 4.94429L12.5 5.48471L9.75 8.15071L10.3519 12L7 10.1943L3.64813 12L4.25 8.15071L1.5 5.48471L5.32406 4.94429L7 1.5Z" fill="#FFD600" stroke="#FFD600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs text-[#222] font-pretendard">{templeStay.rating} ({templeStay.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
