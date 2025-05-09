import React from 'react';
import { MapPin, Heart, Share, Home } from 'lucide-react';
import { TempleStay } from '@/types';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer mb-4"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={templeStay.imageUrl || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay"} 
          alt={templeStay.templeName}
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
              {/* 사찰 이름 표시 */}
              {templeStay.temple?.name && (
                <div className="text-sm text-gray-600 mb-1">
                  <Home className="w-3 h-3 inline mr-1" />
                  {templeStay.temple.name}
                </div>
              )}
              {/* 템플스테이 프로그램 이름 */}
              <h3 className="font-bold text-lg">{templeStay.templeName}</h3>
            </div>
            <div className="flex space-x-2">
              <button className="p-1">
                <Heart className={`w-5 h-5 ${templeStay.likeCount && templeStay.likeCount > 0 ? 'fill-[#DE7834] text-[#DE7834]' : 'text-gray-500'}`} />
              </button>
              <button className="p-1">
                <Share className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mt-1 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{templeStay.temple?.address || templeStay.location} • {templeStay.direction }</span>
          </div>
          
          {/* Website */}
          {templeStay.websiteUrl && (
            <div className="text-gray-500 text-sm mb-3">
              {templeStay.websiteUrl}
            </div>
          )}
          
          {/* Usage fee section */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">이용요금</h4>
            <div className="text-gray-700 text-sm">
              {typeof templeStay.price === 'number' 
                ? templeStay.price.toLocaleString() 
                : (typeof templeStay.price === 'string' 
                  ? parseInt(templeStay.price.replace(/[^\d]/g, '')).toLocaleString() 
                  : '0')}원 / 1인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
