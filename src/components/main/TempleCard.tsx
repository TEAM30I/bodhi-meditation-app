
import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { Temple } from '../../public/data/templeData/templeRepository';

interface TempleCardProps {
  temple: Temple;
  onClick: () => void;
}

const TempleCard: React.FC<TempleCardProps> = ({ temple, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-gray-100">
        <img 
          src={temple.imageUrl || "https://via.placeholder.com/400x300"} 
          alt={temple.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2">{temple.name}</h3>
        <div className="flex items-center text-gray-500 text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{temple.location}</span>
        </div>
        {temple.likeCount !== undefined && temple.likeCount > 0 && (
          <div className="flex items-center text-amber-500 text-xs mt-1">
            <Heart className="w-3 h-3 mr-1 fill-amber-500" />
            <span>{temple.likeCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleCard;
