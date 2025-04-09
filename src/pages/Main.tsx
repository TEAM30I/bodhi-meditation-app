
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BottomNav from '@/components/BottomNav';
import { Search, MapPin, Bell, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTempleList } from '../data/templeData';
import { getTempleStayList } from '../data/templeStayData';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { readingSchedule, scriptures } from '../data/scriptureData';
import { imageRepository } from '../data/imageRepository';

const Main = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // 간단한 로딩 상태
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // 잠시 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, []);

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }
  
  // 홈 화면에 표시할 대표 경전 목록
  const featuredScriptures = readingSchedule.slice(0, 3);
  
  // 추천 사찰 목록
  const templeList = getTempleList();
  const recommendedTemples = templeList.slice(0, 3);
  
  // 추천 템플스테이 목록
  const templeStayList = getTempleStayList();
  const recommendedTempleStays = templeStayList.slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[#F1F3F5]">
      {/* 상단 상태바 - 디자인에 있지만 요청에 따라 삭제 */}
      
      {/* 헤더 */}
      <div className="w-full bg-white border-b border-[#E5E5EC]">
        <div className="flex justify-between items-center px-5 py-[13px] max-w-[480px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#DE7834] text-sm font-mono leading-[140%] tracking-[-0.35px] font-bold">Bodhi</span>
            <div className="flex items-center bg-[rgba(229,233,237,0.87)] rounded-[32px] px-[10px] py-2">
              <div className="flex items-center gap-[6px]">
                <Search className="w-[15px] h-[15px] stroke-[#999999]" />
                <span className="text-[#767676] text-[11px] leading-[140%] tracking-[-0.275px]">검색어를 입력하세요</span>
              </div>
            </div>
          </div>
          
          <button 
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="w-7 h-7" />
            <span className="absolute top-0 right-0 w-[10px] h-[10px] bg-[#DA0000] rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[480px] mx-auto pb-[80px] bg-white">
        <div className="px-5 pt-4 pb-4">
          {/* 사찰 지도 섹션 */}
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 stroke-[#111111]" />
            <span className="font-semibold text-lg text-[#111111] tracking-[-0.45px]">사찰 지도</span>
          </div>
          
          <p className="text-[#767676] text-sm mb-4 tracking-[-0.35px]">
            지도로 사찰을 둘러보고, 관심 사찰로 저장해보세요
          </p>
          
          <div 
            className="w-full h-[150px] bg-[#C9C9C9] rounded-[16px] mb-8 overflow-hidden cursor-pointer"
            onClick={() => navigate('/nearby')}
          >
            <img 
              src={imageRepository.templeBanner.default} 
              alt="사찰 지도" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* 사찰 섹션 */}
          <div className="mb-8">
            <div 
              className="flex items-center gap-[2px] mb-4 cursor-pointer" 
              onClick={() => navigate('/search/temple')}
            >
              <span className="font-semibold text-lg text-black tracking-[-0.45px]">자연이 깃든 사찰, 찾아볼까요?</span>
              <ChevronRight className="w-5 h-5" />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recommendedTemples.map((temple) => (
                <div 
                  key={temple.id} 
                  className="min-w-[100px] h-[100px] flex-shrink-0 rounded-[12px] overflow-hidden bg-[#656565] cursor-pointer"
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
          
          {/* 템플스테이 섹션 */}
          <div className="mb-8">
            <div 
              className="flex items-center gap-[2px] mb-4 cursor-pointer"
              onClick={() => navigate('/search/temple-stay')}
            >
              <span className="font-semibold text-lg text-black tracking-[-0.45px]">쉼이 필요한 당신께, 템플스테이</span>
              <ChevronRight className="w-5 h-5" />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recommendedTempleStays.map((templeStay) => (
                <div 
                  key={templeStay.id} 
                  className="min-w-[100px] h-[100px] flex-shrink-0 rounded-[12px] overflow-hidden bg-[#656565] cursor-pointer"
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
          
          {/* 경전 섹션 */}
          <div className="mb-8">
            <div 
              className="flex items-center gap-[2px] mb-4 cursor-pointer"
              onClick={() => navigate('/scripture')}
            >
              <span className="font-semibold text-lg text-black tracking-[-0.45px]">경전과 함께하는 하루</span>
              <ChevronRight className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col gap-3">
              {featuredScriptures.map((reading, index) => {
                const scriptureColors = [
                  { bg: 'bg-[#21212F]', text: 'text-white' },
                  { bg: 'bg-[#EF4223]', text: 'text-white' },
                  { bg: 'bg-[#0080FF]', text: 'text-white' },
                  { bg: 'bg-[#FFB23F]', text: 'text-white' },
                  { bg: 'bg-[#4CAF50]', text: 'text-white' },
                ];
                
                const colorIndex = index % scriptureColors.length;
                const matchingScripture = Object.values(scriptures).find(s => s.id === reading.scriptureId);
                
                if (!matchingScripture) return null;
                
                return (
                  <div 
                    key={reading.id} 
                    className="w-full bg-white rounded-[32px] p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] cursor-pointer"
                    onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                  >
                    <div className="flex flex-col gap-3">
                      <div className={`inline-flex px-2 py-2 ${scriptureColors[colorIndex].bg} rounded-[12px] w-fit`}>
                        <span className={`text-xs font-medium ${scriptureColors[colorIndex].text} tracking-[-0.3px]`}>
                          {matchingScripture.title}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-[6px]">
                        <h3 className="text-base font-semibold text-[#111] tracking-[-0.4px]">
                          "{reading.title}"
                        </h3>
                        <p className="text-[#767676] text-base font-medium tracking-[-0.4px]">
                          {reading.chapter}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-[2px] justify-end">
                        <span className="text-xs text-[#767676] font-medium tracking-[-0.3px]">
                          시작하기
                        </span>
                        <ChevronRight className="w-3 h-3 stroke-[#767676]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Main;
