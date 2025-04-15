
import React from 'react';
import { MapPin, Heart } from 'lucide-react';
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
        <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
          <p className="text-gray-600">{typedTempleStay.templeName}</p>
        </div>
        {typedTempleStay.likeCount && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
            <Heart className="w-3 h-3 mr-1 fill-white text-white" />
            <span>{typedTempleStay.likeCount}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{typedTempleStay.templeName}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{typedTempleStay.location} • {typedTempleStay.direction}</span>
        </div>
        <div className="text-gray-700 text-sm font-medium">
          {typedTempleStay.price.toLocaleString()}원 / 1인
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
