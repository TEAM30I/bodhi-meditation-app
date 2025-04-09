
import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { Temple } from '/public/data/templeData/templeRepository';

interface TempleItemProps {
  temple: Temple;
  onClick?: () => void;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick }) => {
  const typedTemple = typedData<Temple>(temple);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex">
        <div className="relative w-24 h-24">
          <img 
            src={typedTemple.imageUrl} 
            alt={typedTemple.name} 
            className="w-full h-full object-cover" 
          />
          {typedTemple.likeCount && (
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
              <Heart className="w-3 h-3 mr-1 fill-white text-white" />
              <span>{typedTemple.likeCount}</span>
            </div>
          )}
        </div>
        
        <div className="p-3 flex-1">
          <h3 className="font-semibold text-base text-gray-800 mb-1">{typedTemple.name}</h3>
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{typedTemple.location} • {typedTemple.direction}</span>
          </div>
          <p className="text-gray-600 text-xs line-clamp-2">
            {typedTemple.facilities?.join(" • ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TempleItem;
