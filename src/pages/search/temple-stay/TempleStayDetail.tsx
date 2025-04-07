
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Heart, Share, Star, Calendar, User } from 'lucide-react';
import { templeStays } from '@/data/templeStayRepository';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

// Placeholder images for temple stay details
const TEMPLE_STAY_IMAGES = [
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1526602367853-61a536f40855?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
];

// Mock program details
const PROGRAMS = [
  { time: "14:00~15:00", title: "참선", description: "명상의 시간" },
  { time: "16:00~17:00", title: "스님과의 대화", description: "불교의 지혜" },
  { time: "05:00~06:00", title: "새벽예불", description: "평온한 아침" }
];

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [templeStay, setTempleStay] = useState(templeStays.find(t => t.id === id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  
  useEffect(() => {
    if (!templeStay) {
      // If temple stay not found, navigate back to search
      navigate('/search/temple-stay/results');
    }
  }, [templeStay, navigate]);

  if (!templeStay) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-[56px] px-5 bg-white">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <button onClick={() => navigate('/main')}>
            <Home size={24} />
          </button>
        </div>

        {/* Temple Stay Images */}
        <div className="relative w-full h-[255px] bg-[#f5f5f5]">
          <img 
            src={templeStay.imageUrl || TEMPLE_STAY_IMAGES[currentImageIndex]} 
            alt={templeStay.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-5 bg-[rgba(18,3,3,0.5)] px-2 py-1 rounded-full">
            <span className="text-xs font-bold text-white">
              {currentImageIndex + 1}
              <span className="text-[#767676]">/ {TEMPLE_STAY_IMAGES.length}</span>
            </span>
          </div>
        </div>

        {/* Temple Stay Information */}
        <div className="px-5 py-6 bg-white">
          <div className="flex flex-col gap-1.5 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-[#222]">{templeStay.name}</h1>
              <div className="flex items-center gap-2.5">
                <button onClick={() => setFavorite(!favorite)}>
                  <Heart size={18} fill={favorite ? "#FF0000" : "none"} stroke={favorite ? "#FF0000" : "currentColor"} />
                </button>
                <button>
                  <Share size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm ml-1">{templeStay.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({templeStay.reviews})</span>
            </div>
            
            <div className="flex items-center gap-0.5 mt-2">
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.32678 12.895C7.23158 12.9634 7.11733 13.0001 7.00012 13.0001C6.88291 13.0001 6.76865 12.9634 6.67345 12.895C3.85653 10.8872 0.866949 6.75717 3.8892 3.77283C4.7189 2.95666 5.83627 2.49949 7.00012 2.5C8.16678 2.5 9.2862 2.95792 10.111 3.77225C13.1333 6.75658 10.1437 10.886 7.32678 12.895Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.00016 7.49999C7.30958 7.49999 7.60633 7.37707 7.82512 7.15828C8.04391 6.93949 8.16683 6.64274 8.16683 6.33332C8.16683 6.0239 8.04391 5.72716 7.82512 5.50837C7.60633 5.28957 7.30958 5.16666 7.00016 5.16666C6.69074 5.16666 6.394 5.28957 6.17521 5.50837C5.95641 5.72716 5.8335 6.0239 5.8335 6.33332C5.8335 6.64274 5.95641 6.93949 6.17521 7.15828C6.394 7.37707 6.69074 7.49999 7.00016 7.49999Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-[#111]">{templeStay.location}</span>
            </div>
          </div>

          {/* Price Information */}
          <div className="mt-6 pb-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-[#222] mb-2">가격</h2>
            <p className="text-lg font-bold text-[#DE7834]">{formatPrice(templeStay.price)}</p>
            <p className="text-xs text-gray-500">총 {templeStay.duration} (세금 포함)</p>
          </div>

          {/* Description */}
          <div className="mt-6 pb-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-[#222] mb-4">프로그램 소개</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              {templeStay.description}
            </p>
          </div>

          {/* Program Schedule */}
          <div className="mt-6 pb-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-[#222] mb-4">프로그램 일정</h2>
            <div className="space-y-3">
              {PROGRAMS.map((program, index) => (
                <div key={index} className="flex">
                  <div className="w-24 text-sm font-medium">{program.time}</div>
                  <div>
                    <p className="text-sm font-medium">{program.title}</p>
                    <p className="text-xs text-gray-500">{program.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-6 pb-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-[#222] mb-4">시설 및 서비스</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="text-sm">화장실</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="text-sm">샤워시설</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="text-sm">주차장</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="text-sm">와이파이</span>
              </div>
            </div>
          </div>

          {/* Reservation Button */}
          <div className="mt-6">
            <Button className="w-full h-12 text-base font-bold bg-[#DE7834] hover:bg-[#C56A2E]">
              예약하기
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TempleStayDetail;
