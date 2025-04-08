
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Heart, Share, MapPin, Globe, Calendar } from 'lucide-react';
import { templeStays } from '@/data/templeStayRepository';
import BottomNav from '@/components/BottomNav';

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [templeStay, setTempleStay] = useState(templeStays.find(t => t.id === id));
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (!templeStay) {
      // If temple stay not found, navigate back to search
      navigate('/search/temple-stay/results');
    }
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [templeStay, navigate]);

  if (!templeStay) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  // Mock schedule times for the temple stay
  const scheduleTimes = [
    { time: "10:00", activity: "도착 및 안내" },
    { time: "10:30~11:40", activity: "참선 명상" },
    { time: "11:50~13:00", activity: "스님과의 대화" }
  ];

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

        {/* Temple Stay Image */}
        <div className="w-full h-[255px] bg-gray-200">
          <img 
            src={templeStay.imageUrl} 
            alt={templeStay.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Temple Stay Information */}
        <div className="px-5 py-4 bg-white">
          <div className="flex justify-between items-start mb-1.5">
            <h1 className="text-base font-bold text-[#222]">{templeStay.name}</h1>
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
              {templeStay.location} · 속리산터미널에서 도보 10분
            </span>
          </div>
          
          {/* Website */}
          <div className="flex items-center gap-1 mb-7">
            <Globe size={10} className="text-gray-500" />
            <span className="text-xs text-[#111111]">www.bodhis.com</span>
          </div>
          
          {/* Schedule Box */}
          <div className="w-full border border-[rgba(153,153,153,0.2)] rounded-xl p-3 mb-6 shadow-sm">
            <div className="flex justify-between gap-2.5">
              {scheduleTimes.map((schedule, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center bg-[#21212F] rounded-full px-1.5 py-0.5"
                >
                  <span className="text-white text-[8px] font-medium">{schedule.time}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-[99px] h-[51px] bg-[#C6C6C6]"></div>
              ))}
            </div>
          </div>
          
          {/* Price Information */}
          <h2 className="text-base font-bold text-[#222] mb-4">이용요금</h2>
          <div className="mb-6">
            <p className="text-lg font-bold text-[#DE7834]">{formatPrice(templeStay.price || 50000)}</p>
            <p className="text-xs text-gray-500">총 {templeStay.duration || '1박 2일'} (세금 포함)</p>
          </div>
          
          {/* Notes */}
          <h2 className="text-base font-bold text-[#222] mb-4">유의사항</h2>
          <div className="mb-6">
            <p className="text-sm text-[#555] leading-relaxed">
              {templeStay.description || '해당 템플스테이는 예약 시 진행되는 프로그램과 일정이 변경될 수 있습니다. 자세한 내용은 예약 전 문의 바랍니다.'}
            </p>
          </div>
          
          {/* Program Schedule */}
          <h2 className="text-base font-bold text-[#222] mb-4">프로그램 일정</h2>
          <div className="space-y-3 mb-6">
            {scheduleTimes.map((schedule, index) => (
              <div key={index} className="flex">
                <div className="w-24 text-sm font-medium">{schedule.time}</div>
                <div>
                  <p className="text-sm font-medium">{schedule.activity}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Book Button */}
          <button className="w-full bg-[#DE7834] text-white py-3 rounded-md text-base font-bold">
            예약하기
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TempleStayDetail;
