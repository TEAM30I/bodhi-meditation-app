
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Heart, Share } from 'lucide-react';
import { temples } from '/public/data/templeRepository';
import BottomNav from '@/components/BottomNav';

// Placeholder images for temple details
const TEMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
];

// Mock program times data
const PROGRAM_TIMES = [
  "10:00",
  "10:30~11:40",
  "11:50~13:00"
];

const TempleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [temple, setTemple] = useState(temples.find(t => t.id === id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  
  useEffect(() => {
    if (!temple) {
      // If temple not found, navigate back to search
      navigate('/search/temple/results');
    }
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
            <ArrowLeft size={24} />
          </button>
          <button onClick={() => navigate('/main')}>
            <Home size={24} />
          </button>
        </div>

        {/* Temple Images */}
        <div className="relative w-full h-[255px] bg-[#f5f5f5]">
          <img 
            src={TEMPLE_IMAGES[currentImageIndex]} 
            alt={temple.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-5 bg-[rgba(18,3,3,0.5)] px-2 py-1 rounded-full">
            <span className="text-xs font-bold text-white">
              {currentImageIndex + 1}
              <span className="text-[#767676]">/ {TEMPLE_IMAGES.length}</span>
            </span>
          </div>
        </div>

        {/* Temple Information */}
        <div className="px-5 py-6 bg-white">
          <div className="flex flex-col gap-1.5 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-[#222]">{temple.name}</h1>
              <div className="flex items-center gap-2.5">
                <button onClick={() => setFavorite(!favorite)}>
                  <Heart size={18} fill={favorite ? "#FF0000" : "none"} stroke={favorite ? "#FF0000" : "currentColor"} />
                </button>
                <button>
                  <Share size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-0.5">
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.32678 12.895C7.23158 12.9634 7.11733 13.0001 7.00012 13.0001C6.88291 13.0001 6.76865 12.9634 6.67345 12.895C3.85653 10.8872 0.866949 6.75717 3.8892 3.77283C4.7189 2.95666 5.83627 2.49949 7.00012 2.5C8.16678 2.5 9.2862 2.95792 10.111 3.77225C13.1333 6.75658 10.1437 10.886 7.32678 12.895Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.00016 7.49999C7.30958 7.49999 7.60633 7.37707 7.82512 7.15828C8.04391 6.93949 8.16683 6.64274 8.16683 6.33332C8.16683 6.0239 8.04391 5.72716 7.82512 5.50837C7.60633 5.28957 7.30958 5.16666 7.00016 5.16666C6.69074 5.16666 6.394 5.28957 6.17521 5.50837C5.95641 5.72716 5.8335 6.0239 5.8335 6.33332C5.8335 6.64274 5.95641 6.93949 6.17521 7.15828C6.394 7.37707 6.69074 7.49999 7.00016 7.49999Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs text-[#111]">{temple.location} · {temple.distance || '속리산터미널에서 도보 10분'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-2.5">
              <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_temple)">
                  <path d="M9.64289 5.5C9.64289 6.73137 9.15374 7.9123 8.28303 8.783C7.41233 9.65371 6.2314 10.1429 5.00004 10.1429C3.76867 10.1429 2.58774 9.65371 1.71704 8.783C0.846335 7.9123 0.357178 6.73137 0.357178 5.5M9.64289 5.5C9.64289 4.26864 9.15374 3.08771 8.28303 2.21701C7.41233 1.3463 6.2314 0.857147 5.00004 0.857147C3.76867 0.857147 2.58774 1.3463 1.71704 2.21701C0.846335 3.08771 0.357178 4.26864 0.357178 5.5M9.64289 5.5H0.357178" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.78578 5.5C6.69807 7.19786 6.0727 8.82383 5.00007 10.1429C3.92744 8.82383 3.30207 7.19786 3.21436 5.5C3.30207 3.80215 3.92744 2.17618 5.00007 0.857147C6.0727 2.17618 6.69807 3.80215 6.78578 5.5Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_temple">
                    <rect width="10" height="10" fill="white" transform="translate(0 0.5)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-xs text-[#111]">www.{temple.id}.com</span>
            </div>
          </div>

          {/* Program Times */}
          <div className="w-full rounded-xl border border-[rgba(153,153,153,0.2)] shadow-sm p-3">
            <div className="flex gap-2.5 mb-3">
              {PROGRAM_TIMES.map((time, index) => (
                <div key={index} className="inline-flex px-1 py-0.5 rounded-full bg-[#21212F]">
                  <span className="text-[8px] text-white">{time}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5">
              <div className="w-[99px] h-[51px] bg-[#C6C6C6]"></div>
              <div className="w-[99px] h-[51px] bg-[#C6C6C6]"></div>
              <div className="w-[99px] h-[51px] bg-[#C6C6C6]"></div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-[#222] mb-4">운영시간</h2>
            <p className="text-sm text-[#555]">
              평일: 09:00 ~ 17:00<br />
              주말: 09:00 ~ 18:00<br />
              공휴일: 10:00 ~ 16:00
            </p>
          </div>

          {/* Temple Description */}
          <div className="mt-6">
            <h2 className="text-base font-bold text-[#222] mb-4">사찰 소개</h2>
            <p className="text-sm text-[#555] leading-relaxed">
              {temple.description || `${temple.name}는 아름다운 자연 속에 위치한 전통 사찰로, 깊은 역사와 풍부한 문화유산을 자랑합니다. 평화로운 분위기에서 명상과 사색을 즐길 수 있으며, 다양한 불교 문화 체험 프로그램을 제공합니다.`}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {temple.tags ? 
              temple.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-[#F7F7F7] rounded-full text-xs text-[#555]">
                  #{tag}
                </span>
              )) : 
              ["전통", "문화재", "템플스테이운영"].map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-[#F7F7F7] rounded-full text-xs text-[#555]">
                  #{tag}
                </span>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TempleDetail;
