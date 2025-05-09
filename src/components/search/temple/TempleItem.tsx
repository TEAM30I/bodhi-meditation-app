import React from 'react';
import { MapPin, Heart, Share } from 'lucide-react';
import { Temple } from '@/types';

interface TempleItemProps {
  temple: Temple;
  onClick?: () => void;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer mb-4"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={temple.imageUrl || temple.image_url || "/placeholder-temple.jpg"} 
          alt={temple.name}
          className="w-full h-56 object-cover"
        />
        
        {/* Image indicator (1/4) */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          1/4
        </div>
        
        {/* Title and actions */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{temple.name}</h3>
            </div>
            <div className="flex space-x-2">
              <button className="p-1">
                <Heart className={`w-5 h-5 ${temple.likeCount && temple.likeCount > 0 ? 'fill-[#DE7834] text-[#DE7834]' : 'text-gray-500'}`} />
              </button>
              <button className="p-1">
                <Share className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mt-1 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{temple.address || temple.region || '주소 정보 없음'}</span>
          </div>
          
          {/* Description (if available) */}
          {temple.description && (
            <div className="text-gray-700 text-sm mt-2 line-clamp-2">
              {temple.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempleItem;
