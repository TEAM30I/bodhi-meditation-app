
import React from 'react';
import { MapPin } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { TempleStay } from '/public/data/templeStayData/templeStayRepository';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  const typedTempleStay = typedData<TempleStay>(templeStay);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={typedTempleStay.imageUrl} 
          alt={typedTempleStay.templeName} 
          className="w-full h-40 object-cover" 
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{typedTempleStay.templeName}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{typedTempleStay.location} • {typedTempleStay.direction}</span>
        </div>
        <div className="text-gray-700 text-sm font-medium">
          다른 날짜 확인
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
