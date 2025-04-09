
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { TempleStay } from '@/data/templeStayData';

interface TempleStayItemProps {
  templeStay: TempleStay;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search/temple-stay/detail/${templeStay.id}`);
  };

  return (
    <div 
      className="flex flex-col w-full rounded-lg overflow-hidden shadow-sm bg-white cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-[160px] relative">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-base mb-1">{templeStay.templeName}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-3 h-3 mr-1 shrink-0" />
          <span className="text-xs truncate">{templeStay.location}</span>
        </div>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{templeStay.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            {templeStay.duration}
          </div>
          <div className="font-bold text-orange-500">
            {templeStay.price.toLocaleString('ko-KR')}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
