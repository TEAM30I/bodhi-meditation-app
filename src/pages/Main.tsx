
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BottomNav from '@/components/BottomNav';
import { Search, MapPin, Bell, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { temples } from '@/data/templeRepository';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { readingSchedule, scriptures } from '@/data/scriptureRepository';
import { imageRepository } from '@/data/imageRepository';

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

  // Icon menu items with updated order
  const iconMenuItems = [
    {
      label: "경전읽기",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2f87545372fe9582fde4b5e3604644d1ec5ec5d",
      onClick: () => navigate('/scripture')
    },
    {
      label: "사찰 찾기",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2f87545372fe9582fde4b5e3604644d1ec5ec5d",
      onClick: () => navigate('/find-temple')
    },
    {
      label: "템플 스테이",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ec3def58b7540a2b54f8f5fdcdea89b6f0e64824",
      onClick: () => navigate('/temple-stay')
    },
    {
      label: "선명상",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d3d60511456bf29305fe928345308ba6f90cace3",
      onClick: () => navigate('/meditation')
    },
    {
      label: "오늘의 운세",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f9634e0cca626d9a904e87a56fa4b9e54f423808",
      onClick: () => navigate('/fortune')
    }
  ];

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }
  
  // 홈 화면에 표시할 대표 경전 목록 (최대 3개)
  const featuredScriptures = readingSchedule.slice(0, 3);

  const SectionTitle = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <div 
      className="flex justify-between items-center mb-[10px] cursor-pointer" 
      onClick={onClick}
    >
      <h2 className="text-[15px] font-bold">{children}</h2>
      <div className="flex items-center text-gray-500">
        <span className="text-xs mr-1">더보기</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] pb-[80px]">
          {/* Header */}
          <div className="flex justify-between items-center px-[24px] py-[15px]">
            <BodhiLogo />
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/search')}>
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => navigate('/notifications')}>
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center px-[24px] mb-[15px]">
            <MapPin className="w-5 h-5 text-bodhi-orange mr-1" />
            <span className="text-sm font-medium text-gray-700">한남동/용산구</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Banner */}
          <div className="w-full px-[24px] mb-[20px]">
            <div className="w-full h-[130px] rounded-[10px] bg-gray-200 relative overflow-hidden">
              <img 
                src={imageRepository.templeBanner.default} 
                alt="메인 배너" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                1/3
              </div>
            </div>
          </div>

          {/* Temple Section */}
          <div className="px-[24px] mb-[25px]">
            <SectionTitle onClick={() => navigate('/find-temple')}>
              자연이 깃든 사찰, 찾아볼까요?
            </SectionTitle>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3">
              {temples.slice(0, 3).map((temple, index) => (
                <div 
                  key={temple.id} 
                  className="cursor-pointer"
                  onClick={() => navigate(`/temple/${temple.id}`)}
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Temple Stay Section */}
          <div className="px-[24px] mb-[25px]">
            <SectionTitle onClick={() => navigate('/temple-stay')}>
              쉼이 필요한 당신께, 템플스테이
            </SectionTitle>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3">
              {temples.slice(0, 3).map((temple, index) => (
                <div 
                  key={`stay-${temple.id}`} 
                  className="cursor-pointer"
                  onClick={() => navigate(`/temple-stay/${temple.id}`)}
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scripture Reading Section */}
          <div className="px-[24px] mb-[20px]">
            <SectionTitle onClick={() => navigate('/scripture')}>
              경전과 함께하는 하루
            </SectionTitle>

            <div className="flex flex-col gap-3">
              {featuredScriptures.map((reading) => {
                // 해당 카테고리에 맞는 경전 찾기
                const matchingScripture = scriptures.find(s => s.categories.includes(reading.category));
                
                if (!matchingScripture) return null;
                
                return (
                  <div 
                    key={reading.id} 
                    className="flex items-center p-3 rounded-lg cursor-pointer"
                    onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                  >
                    <div className={`w-[60px] h-[60px] rounded-md ${reading.color} flex items-center justify-center ${reading.textColor}`}>
                      <span className="text-sm font-bold">{reading.category}</span>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-bold">{reading.title}</h3>
                      <p className="text-xs text-gray-500">{reading.chapter}</p>
                    </div>
                    <div className="text-gray-500">
                      <span className="text-xs">자세히</span>
                      <ChevronRight className="w-4 h-4 inline-block" />
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
