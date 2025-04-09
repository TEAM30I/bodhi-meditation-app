import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BottomNav from '@/components/BottomNav';
import { Search, MapPin, Bell, ChevronRight, CalendarDays } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTempleList } from '/public/data/templeData/templeRepository';
import { getTempleStayList } from '/public/data/templeStayData/templeStayRepository';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { readingSchedule, scriptures } from '/public/data/scriptureData/scriptureRepository';
import { imageRepository } from '/public/data/imageRepository';

const Main = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }

  const templeList = getTempleList();
  const recommendedTemples = templeList.slice(0, 3);
  
  const templeStayList = getTempleStayList();
  const recommendedTempleStays = templeStayList.slice(0, 3);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const currentDate = today.getDate();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(currentDate - 3 + i);
    return {
      day: weekDays[date.getDay()],
      date: date.getDate(),
      active: i === 3,
    };
  });

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8]">
      <div className="w-full bg-white shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 max-w-[480px] mx-auto">
          <div className="text-[#DE7834] text-xl font-bold">BODHI</div>
          <div className="flex-1 mx-2">
            <div className="flex items-center bg-[#F5F5F5] rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-[13px] text-gray-400">검색어를 입력하세요</span>
            </div>
          </div>
          <button 
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="w-full bg-white px-5 py-3 mb-2">
        <div className="max-w-[480px] mx-auto">
          <div className="flex justify-between">
            {dates.map((date, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center"
              >
                <span className="text-xs text-gray-500 mb-1">{date.day}</span>
                <div className={`w-7 h-7 flex items-center justify-center rounded-full ${date.active ? 'bg-[#DE7834] text-white' : 'text-black'}`}>
                  {date.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[480px] mx-auto pb-20">
        <div className="bg-white px-5 py-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-base">
              사찰 지도
            </h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            지도로 사찰을 둘러보고, 관심 사찰로 저장해보세요
          </p>
          
          <div 
            className="w-full h-32 bg-gray-200 rounded-lg mb-1 overflow-hidden cursor-pointer"
            onClick={() => navigate('/nearby')}
          >
            <img 
              src={imageRepository.templeBanner.default} 
              alt="사찰 지도" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white px-5 py-4 mb-2">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer" 
            onClick={() => navigate('/search/temple')}
          >
            <h2 className="font-semibold text-base">자연이 깃든 사찰, 찾아볼까요?</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recommendedTemples.map((temple) => (
              <div 
                key={temple.id} 
                className="min-w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
              >
                <img 
                  src={temple.imageUrl} 
                  alt={temple.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
          
        <div className="bg-white px-5 py-4 mb-2">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => navigate('/search/temple-stay')}
          >
            <h2 className="font-semibold text-base">쉼이 필요한 당신께, 템플스테이</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recommendedTempleStays.map((templeStay) => (
              <div 
                key={templeStay.id} 
                className="min-w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
              >
                <img 
                  src={templeStay.imageUrl} 
                  alt={templeStay.templeName} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
          
        <div className="bg-white px-5 py-4 mb-2">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => navigate('/scripture')}
          >
            <h2 className="font-semibold text-base">경전과 함께하는 하루</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {readingSchedule.slice(0, 2).map((reading, index) => {
              const scriptureColors = [
                { bg: 'bg-[#DE7834]', text: 'text-white' },
                { bg: 'bg-[#FFA94D]', text: 'text-white' }
              ];
              
              const colorIndex = index % scriptureColors.length;
              const matchingScripture = Object.values(scriptures).find(s => s.id === reading.scriptureId);
              
              if (!matchingScripture) return null;
              
              return (
                <div 
                  key={reading.id} 
                  className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm cursor-pointer"
                  onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                >
                  <div className="flex flex-col gap-3">
                    <div className={`inline-flex px-3 py-1 ${scriptureColors[colorIndex].bg} rounded-full w-fit`}>
                      <span className={`text-xs font-medium ${scriptureColors[colorIndex].text}`}>
                        {matchingScripture.title}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-[6px]">
                      <h3 className="text-sm font-medium text-gray-800">
                        "{reading.title}"
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {reading.chapter}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xs text-gray-400">
                        시작하기
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Main;
