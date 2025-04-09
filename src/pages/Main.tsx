
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Search, Bell, ChevronRight, Home, Book, UserCircle, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { typedData } from '@/utils/typeUtils';
import { 
  imageRepository, 
  getTempleList, 
  getTempleStayList, 
  readingSchedule, 
  scriptures 
} from '@/utils/repository';

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
  const typedTempleList = typedData<typeof templeList>(templeList);
  const recommendedTemples = typedTempleList.slice(0, 4);
  
  const templeStayList = getTempleStayList();
  const typedTempleStayList = typedData<typeof templeStayList>(templeStayList);
  const recommendedTempleStays = typedTempleStayList.slice(0, 4);

  const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedImageRepository = typedData<typeof imageRepository>(imageRepository);

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
      <div className="w-full bg-white shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 max-w-[480px] mx-auto">
          <div className="text-[#DE7834] text-xl font-['Rubik Mono One']">BODHI</div>
          <div className="flex-1 mx-2">
            <div 
              className="flex items-center bg-[#E5E9ED] bg-opacity-87 rounded-full px-3 py-2 cursor-pointer"
              onClick={() => navigate('/search')}
            >
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-[11px] text-gray-500">검색어를 입력하세요</span>
            </div>
          </div>
          <button 
            className="relative"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-[480px] mx-auto pb-20 px-5">
        <div className="py-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.219 2.44302C16.872 2.95502 17.322 3.78202 17.506 4.64802L17.571 4.67402L19.616 5.62002C19.7302 5.67261 19.8271 5.75674 19.8951 5.86251C19.9631 5.96827 19.9995 6.09127 20 6.21702V18.584C19.9993 18.6868 19.9747 18.7879 19.9284 18.8796C19.882 18.9712 19.815 19.0509 19.7326 19.1123C19.6503 19.1738 19.5548 19.2153 19.4537 19.2336C19.3526 19.2519 19.2487 19.2466 19.15 19.218L13.481 17.618L6.741 19.476C6.61942 19.5096 6.49082 19.5083 6.37 19.472L0.474 17.717C0.337721 17.677 0.21799 17.5941 0.132595 17.4806C0.047201 17.3671 0.00069966 17.2291 0 17.087L0 4.49802C0 4.05802 0.428 3.74202 0.855 3.86602L6.557 5.52702L9.455 4.64002C9.495 4.62802 9.53567 4.61969 9.577 4.61502C9.689 3.95902 10.002 3.32902 10.527 2.71502C11.15 1.98502 12.243 1.55702 13.308 1.50602C14.413 1.45302 15.257 1.68902 16.218 2.44202M1.333 5.38102V16.596L6.203 18.045V6.79802L1.333 5.38102ZM9.542 5.99502L7.536 6.60802V17.887L12.601 16.493V13.198C12.601 12.834 12.9 12.539 13.268 12.539C13.636 12.539 13.934 12.834 13.934 13.199V16.376L18.667 17.711V6.63602L17.547 6.11602C17.5283 6.22602 17.504 6.33369 17.474 6.43902C17.2574 7.2061 16.8925 7.92329 16.4 8.55002L13.923 11.643C13.8578 11.7243 13.7745 11.7893 13.6797 11.8328C13.585 11.8763 13.4814 11.8971 13.3772 11.8935C13.273 11.8899 13.1711 11.862 13.0796 11.8121C12.9881 11.7622 12.9095 11.6916 12.85 11.606L10.535 8.25302C10.1523 7.72036 9.88533 7.24169 9.734 6.81702C9.63885 6.55125 9.57443 6.27545 9.542 5.99502ZM13.372 2.82402C12.646 2.85902 11.9 3.15102 11.545 3.56602C11.118 4.06602 10.908 4.53402 10.866 5.00802C10.816 5.57902 10.85 5.98202 10.992 6.38102C11.097 6.67602 11.306 7.05002 11.629 7.50102L13.44 10.123L15.35 7.73802C15.7356 7.24574 16.0213 6.68287 16.191 6.08102C16.431 5.24102 16.069 4.00702 15.391 3.47702C14.696 2.93202 14.171 2.78502 13.373 2.82402M13.511 3.52102C14.615 3.52102 15.511 4.40602 15.511 5.49802C15.5076 6.02529 15.295 6.52963 14.92 6.90031C14.545 7.27098 14.0383 7.47768 13.511 7.47502C12.407 7.47502 11.511 6.59002 11.511 5.49802C11.511 4.40602 12.407 3.52102 13.511 3.52102ZM13.511 4.83902C13.4239 4.8385 13.3376 4.85512 13.257 4.88796C13.1763 4.92079 13.103 4.96919 13.041 5.03038C12.9791 5.09157 12.9298 5.16437 12.896 5.24461C12.8622 5.32485 12.8445 5.41096 12.844 5.49802C12.844 5.86202 13.143 6.15702 13.511 6.15702C13.5981 6.15742 13.6844 6.14066 13.7649 6.10771C13.8455 6.07475 13.9188 6.02625 13.9807 5.96496C14.0425 5.90367 14.0917 5.8308 14.1254 5.75052C14.1591 5.67023 14.1766 5.58409 14.177 5.49702C14.1757 5.32153 14.1048 5.15372 13.98 5.03038C13.8551 4.90704 13.6865 4.83823 13.511 4.83902Z" 
              fill="#111111"/>
            </svg>
            <h2 className="font-semibold text-lg">
              사찰 지도
            </h2>
          </div>
          
          <p className="text-gray-500 text-sm mb-3">
            도로 사찰을 둘러보고, 관심 사찰로 저장해보세요
          </p>
          
          <div 
            className="w-full h-36 bg-gray-200 rounded-lg mb-1 overflow-hidden cursor-pointer"
            onClick={() => navigate('/nearby')}
          >
            <img 
              src={typedImageRepository.templeBanner.default} 
              alt="사찰 지도" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer" 
            onClick={() => navigate('/search/temple')}
          >
            <h2 className="font-semibold text-lg">자연이 깃든 사찰, 찾아볼까요?</h2>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
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
          
        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => navigate('/search/temple-stay')}
          >
            <h2 className="font-semibold text-lg">쉼이 필요한 당신께, 템플스테이</h2>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
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
          
        <div className="mb-8">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => navigate('/scripture')}
          >
            <h2 className="font-semibold text-lg">경전과 함께하는 하루</h2>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
          
          <div className="space-y-3">
            {typedReadingSchedule.slice(0, 3).map((reading, index) => {
              const scriptureColors = [
                { bg: 'bg-[#21212F]', text: 'text-white' },
                { bg: 'bg-[#EF4223]', text: 'text-white' },
                { bg: 'bg-[#FFB23F]', text: 'text-white' }
              ];
              
              const colorIndex = index % scriptureColors.length;
              const matchingScripture = Object.values(typedScriptures).find(s => s.id === reading.scriptureId);
              
              if (!matchingScripture) return null;
              
              return (
                <div 
                  key={reading.id} 
                  className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm cursor-pointer"
                  onClick={() => navigate(`/scripture/${matchingScripture.id}`)}
                >
                  <div className="flex flex-col gap-3">
                    <div className={`inline-flex px-2 py-2 ${scriptureColors[colorIndex].bg} rounded-xl w-fit`}>
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

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-10">
        <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
          <button className="flex items-center justify-center w-14 h-14 text-[#DE7834]">
            <Home size={28} />
          </button>
          <button className="flex items-center justify-center w-14 h-14 text-gray-400"
            onClick={() => navigate('/scripture')}
          >
            <Book size={28} />
          </button>
          <button className="flex items-center justify-center w-14 h-14 text-gray-400"
            onClick={() => navigate('/search')}
          >
            <Search size={28} />
          </button>
          <button className="flex items-center justify-center w-14 h-14 text-gray-400"
            onClick={() => navigate('/wishlist')}
          >
            <Heart size={28} />
          </button>
          <button className="flex items-center justify-center w-14 h-14 text-gray-400"
            onClick={() => navigate('/profile')}
          >
            <UserCircle size={28} />
          </button>
        </div>
        <div className="h-9 bg-white flex justify-center items-center">
          <div className="w-32 h-1.5 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
