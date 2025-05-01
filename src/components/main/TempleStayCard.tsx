
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
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-100">
          <img 
            src={templeStay.imageUrl || "https://via.placeholder.com/400x300"} 
            alt={templeStay.templeName}
            className="w-full h-full object-cover"
          />
        </div>
        {templeStay.likeCount > 0 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Heart className="w-3 h-3 mr-1 fill-white stroke-white" />
            <span>{templeStay.likeCount}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2">{templeStay.templeName}</h3>
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{templeStay.location}</span>
        </div>
        <div className="text-gray-900 font-medium">
          {templeStay.price.toLocaleString()}원
          <span className="text-sm text-gray-500 ml-1">/ 1인</span>
        </div>
      </div>
    </div>
  );
};

export default TempleStayCard;
