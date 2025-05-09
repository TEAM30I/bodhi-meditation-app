import React from 'react';
import { MapPin, Heart, Share } from 'lucide-react';
import { Temple } from '@/types';

interface TempleItemProps {
  temple: Temple;
  onClick?: () => void;
  isLiked?: boolean;
  onLikeToggle?: () => void;
  showLikeCount?: boolean;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick, isLiked, onLikeToggle, showLikeCount = true }) => {
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
        
        
        {/* Title and actions */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{temple.name}</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-1 flex flex-col items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLikeToggle) onLikeToggle();
                }}
              >
                <Heart 
                  className={`w-5 h-5 ${isLiked ? 'fill-[#ff7730] stroke-[#ff7730]' : 'stroke-gray-600'}`} 
                />
                {showLikeCount && (
                  <span className="text-xs mt-1">{temple.follower_count || temple.likeCount || 0}</span>
                )}
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
      
      <div className="flex items-center justify-between p-3">
        <div className="flex-1">
          {/* ... existing code ... */}
        </div>
        
      </div>
    </div>
  );
};

export default TempleItem;