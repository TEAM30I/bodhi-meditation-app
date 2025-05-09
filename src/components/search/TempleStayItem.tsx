import React from 'react';
import { MapPin, Heart, Home, Navigation } from 'lucide-react';
import { TempleStay } from '@/types';
import { toast } from 'sonner';

interface TempleStayItemProps {
  templeStay: {
    id: string;
    templeName: string;
    location: string;
    imageUrl: string;
    price: number;
    likeCount: number;
    distance?: string;
    temple?: {
      id: string;
      name: string;
      region: string;
      address?: string;
      imageUrl?: string;
      latitude?: number;
      longitude?: number;
    };
    direction?: string;
    websiteUrl?: string;
  };
  onClick?: () => void;
  isLiked?: boolean;
  onLikeToggle?: (e: React.MouseEvent) => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick, isLiked, onLikeToggle }) => {
  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeToggle) {
      onLikeToggle(e);
    }
  };

  return (
    <div 
      className="flex border-b-2 border-gray-200 p-4 cursor-pointer" 
      onClick={onClick}
    >
      {/* 고정된 크기의 컨테이너 */}
      <div className="w-full flex">
        {/* 이미지 섹션 - 고정된 크기 */}
        <div className="w-32 h-32 relative flex-shrink-0">
          <img 
            src={templeStay.imageUrl || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay"} 
            alt={templeStay.templeName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="flex-1 ml-4">
          {/* 상단 영역: 제목과 좋아요 */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* 사찰 이름 */}
              {templeStay.temple?.name && (
                <div className="text-sm text-gray-600">
                  <Home className="w-3 h-3 inline mr-1" />
                  {templeStay.temple.name}
                </div>
              )}
              {/* 템플스테이 이름 */}
              <h3 className="font-bold text-base mt-1">{templeStay.templeName}</h3>
            </div>
            {/* 좋아요 버튼 */}
            <button 
              className="flex flex-col items-center ml-2"
              onClick={handleLikeClick}
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-[#ff7730] stroke-[#ff7730]' : 'stroke-gray-600'}`} 
              />
              <span className="text-xs mt-0.5">{templeStay.likeCount || 0}</span>
            </button>
          </div>

          {/* 중간 영역: 위치 */}
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{templeStay.temple?.address || templeStay.location}</span>
          </div>

          {/* 하단 영역: 가격과 거리 */}
          <div className="flex justify-between items-end mt-auto pt-2">
            <div className="text-gray-700 text-sm">
              {templeStay.price.toLocaleString()}원 / 1인
            </div>
            {templeStay.distance && (
              <div className="flex items-center text-gray-600 text-sm">
                <Navigation className="w-3 h-3 mr-1" />
                <span>{templeStay.distance}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
