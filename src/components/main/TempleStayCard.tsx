
import React from 'react';
import { MapPin, Heart } from 'lucide-react';

interface TempleStayCardProps {
  templeStay: {
    id: string;
    templeName: string;
    location: string;
    imageUrl: string;
    price: number;
    likeCount: number;
  };
  onClick: () => void;
}

const TempleStayCard: React.FC<TempleStayCardProps> = ({ templeStay, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName}
          className="w-full h-32 object-cover"
        />
        {templeStay.likeCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Heart className="w-3 h-3 mr-1 fill-white stroke-white" />
            <span>{templeStay.likeCount}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2">{templeStay.templeName}</h3>
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{templeStay.location}</span>
        </div>
        <div className="text-gray-900 text-sm font-medium">
          {templeStay.price.toLocaleString()}원 / 1인
        </div>
      </div>
    </div>
  );
};

export default TempleStayCard;
