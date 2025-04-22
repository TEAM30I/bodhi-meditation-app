
import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { TempleStay } from '@/types/templeStay';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={templeStay.imageUrl || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay"} 
          alt={templeStay.templeName}
          className="w-full h-40 object-cover"
        />
        {templeStay.likeCount !== undefined && templeStay.likeCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
            <Heart className="w-3 h-3 mr-1 fill-white text-white" />
            <span>{templeStay.likeCount}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{templeStay.templeName}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{templeStay.location} • {templeStay.direction}</span>
        </div>
        {templeStay.distance && (
          <div className="text-gray-500 text-sm mb-2">
            거리: {templeStay.distance}
          </div>
        )}
        <div className="text-gray-700 text-sm font-medium">
          {templeStay.price.toLocaleString()}원 / 1인
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
