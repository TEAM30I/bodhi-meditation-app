import React from 'react';
import { MapPin, Heart, Navigation } from 'lucide-react';
import { Temple } from '@/types';
import { toast } from 'sonner';

interface TempleItemProps {
  temple: Temple;
  onClick: () => void;
  isLiked: boolean;
  onLikeToggle: (e: React.MouseEvent) => void | Promise<void>;
  showLikeCount?: boolean;
  distance?: string;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick, isLiked, onLikeToggle, showLikeCount = true, distance }) => {
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
            src={temple.imageUrl || temple.image_url || "/placeholder-temple.jpg"} 
            alt={temple.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="flex-1 ml-4">
          {/* 상단 영역: 제목과 좋아요 */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-base">{temple.name}</h3>
            </div>
            <button 
              className="flex flex-col items-center ml-2"
              onClick={handleLikeClick}
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-[#ff7730] stroke-[#ff7730]' : 'stroke-gray-600'}`} 
              />
              {showLikeCount && (
                <span className="text-xs mt-0.5">{temple.follower_count || temple.likeCount || 0}</span>
              )}
            </button>
          </div>

          {/* 중간 영역: 위치 */}
          <div className="flex items-center text-gray-600 text-sm mt-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{temple.address || temple.region || '주소 정보 없음'}</span>
          </div>

          {/* 하단 영역: 설명과 거리 */}
          <div className="flex justify-between items-end mt-auto pt-2">
            <div className="text-gray-700 text-sm line-clamp-1 flex-1 mr-4">
              {temple.description}
            </div>
            {distance && (
              <div className="flex items-center text-gray-600 text-sm flex-shrink-0">
                <Navigation className="w-3 h-3 mr-1" />
                <span>{distance}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleItem;