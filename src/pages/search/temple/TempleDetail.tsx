import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Heart, Share, MapPin, Globe, Calendar } from 'lucide-react';
import { temples } from '../../../data/templeData';
import BottomNav from '@/components/BottomNav';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [temple, setTemple] = useState(temples.find(t => t.id === id));
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (!temple) {
      // If temple not found, navigate back to search
      navigate('/search/temple/results');
    }
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [temple, navigate]);

  if (!temple) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-[56px] px-5 bg-white">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={28} />
          </button>
          <button onClick={() => navigate('/main')}>
            <Home size={28} />
          </button>
        </div>

        {/* Temple Image */}
        <div className="w-full h-[255px] bg-gray-200">
          <img 
            src={temple.imageUrl} 
            alt={temple.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Temple Information */}
        <div className="px-5 py-4 bg-white">
          <div className="flex justify-between items-start mb-1.5">
            <h1 className="text-base font-bold text-[#222]">{temple.name}</h1>
            <div className="flex items-center gap-2.5">
              <button onClick={() => setIsFavorite(!isFavorite)}>
                <Heart size={18} fill={isFavorite ? "#FF0000" : "none"} stroke={isFavorite ? "#FF0000" : "#111111"} />
              </button>
              <button>
                <Share size={18} />
              </button>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 mb-4">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-xs text-[#111111]">
              {temple.location}
            </span>
          </div>
          
          {/* Description */}
          <div className="mb-7">
            <p className="text-sm text-[#555] leading-relaxed">
              {temple.description || '사찰에 대한 설명이 없습니다.'}
            </p>
          </div>
          
          {/* Additional Information */}
          <h2 className="text-base font-bold text-[#222] mb-4">추가 정보</h2>
          <div className="space-y-3 mb-6">
            <div className="flex">
              <div className="w-24 text-sm font-medium">개방 시간</div>
              <div>
                <p className="text-sm font-medium">{temple.openingHours || '정보 없음'}</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-24 text-sm font-medium">주차 여부</div>
              <div>
                <p className="text-sm font-medium">{temple.hasParkingLot ? '주차 가능' : '주차 불가'}</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-24 text-sm font-medium">템플스테이</div>
              <div>
                <p className="text-sm font-medium">{temple.hasTempleStay ? '운영' : '미운영'}</p>
              </div>
            </div>
          </div>
          
          {/* Contact Button */}
          <button className="w-full bg-[#DE7834] text-white py-3 rounded-md text-base font-bold">
            문의하기
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TempleDetail;
