import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { ScriptureCalendarPrev } from '@/components/scripture/ScriptureCalendar_prev';
import ScriptureProgressList from '@/components/scripture/ScriptureProgressList';
import { typedData } from '@/utils/typeUtils';
import {
  searchTemples,
  searchTempleStays,
  getReadingSchedule,
  getScriptureList,
} from '@/lib/repository';
import { TempleStay, Temple, Scripture } from '@/types';
import Footer from '@/components/Footer';
import SurveyPopup from '@/components/SurveyPopup';
import { toast } from '@/components/ui/use-toast';
/**
 * 전역 kakao 객체 타입 선언 (index.html 에 sdk.js?autoload=false 가 로드돼 있어야 함)
 */
declare global {
  interface Window {
    kakao: any;
  }
}

const Main = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);

  /* ------------------------------------------------------------------
   * 팝업 관련 함수
   * ------------------------------------------------------------------ */
  const checkShouldShowPopup = () => {
    // 쿠키에서 팝업 숨김 상태 확인
    const cookies = document.cookie.split(';');
    const hidePopupCookie = cookies.find(cookie => cookie.trim().startsWith('hideSurveyPopup='));
    
    // 쿠키가 없으면 팝업 표시
    return !hidePopupCookie;
  };

  const handleClosePopup = () => {
    setShowSurveyPopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const [templesData, templeStaysData, scripturesData] = await Promise.all([
            searchTemples('', 'popular'),
            searchTempleStays('', 'popular'),
            getScriptureList(),
          ]);

          setTemples(templesData);
          setTempleStays(templeStaysData);
          setScriptures(scripturesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        
        // 데이터 로딩 후 현재 경로가 '/main'인 경우에만 팝업 표시 여부 확인
        if (location.pathname === '/main' && checkShouldShowPopup()) {
          setShowSurveyPopup(true);
        }
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [location.pathname, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }

  const recommendedTemples = temples.slice(0, 8);
  const recommendedTempleStays = templeStays.slice(0, 8);
  const typedReadingSchedule = typedData<typeof getReadingSchedule>(getReadingSchedule);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const handleNavigateToCalendar = () => navigate('/scripture/calendar');

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
      {/* 헤더 */}
      <div className="w-full bg-white shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 max-w-[480px] mx-auto">
          <div className="text-[#DE7834] text-xl font-rubik font-bold">BODHI</div>
          <div className="flex-1 mx-2">
          </div>
          {
            <button className="relative" onClick={() => navigate('/notifications')}>
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
         }
        </div>
      </div>

      {/* 본문 */}
      <div className="w-full max-w-[480px] mx-auto pb-20 py-4 px-5">
        {user && (
          <div className="mb-8 cursor-pointer" onClick={handleNavigateToCalendar}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">경전 캘린더</h2>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="w-full flex justify-center">
              <ScriptureCalendarPrev />
            </div>
          </div>
        )}

        {!user && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-2">보디에 오신 것을 환영합니다</h2>
            <p className="text-gray-600 mb-4">로그인하시면 더 많은 기능을 이용하실 수 있습니다.</p>
            <button 
              className="w-full py-2 bg-[#DE7834] text-white rounded-md"
              onClick={() => navigate('/onboarding1')}
            >
              로그인 / 회원가입
            </button>
          </div>
        )}

        {/* 사찰 지도 대신 메시지 */}
        <div className="py-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-lg">사찰 지도</h2>
          </div>
          <p className="text-gray-500 text-sm mb-3 text-center">
            🚧 지도 기능은 현재 준비중인 기능이에요! 🚧<br />
            조금만 기다려주세요! 🙏
          </p>
        </div>

        {/* 추천 사찰 */}
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
                className="min-w-[100px] w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer relative"
                onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
              >
                <img 
                  src={temple.imageUrl || temple.image_url || '/placeholder-temple.jpg'} 
                  alt={temple.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2">
                  <p className="text-xs text-white font-medium line-clamp-2">{temple.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 템플스테이 */}
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
                className="min-w-[100px] w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer relative"
                onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
              >
                <img 
                  src={templeStay.imageUrl || '/placeholder-temple-stay.jpg'} 
                  alt={templeStay.templeName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-start justify-end p-2">
                  {templeStay.temple && (
                    <p className="text-xs text-gray-200 line-clamp-1">{templeStay.temple.name}</p>
                  )}
                  <p className="text-xs text-white font-medium line-clamp-1">{templeStay.templeName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 경전 진행 리스트 */}
        {(
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex items-center justify-center">
              <div className="bg-white/90 px-6 py-4 rounded-lg shadow-sm">
                <p className="text-gray-700 font-medium text-center">
                  곧 새로운 내용으로
                  <br />업데이트될 예정입니다.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => navigate('/scripture')}>
              <h2 className="font-semibold text-lg">경전과 함께하는 하루</h2>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>

            <ScriptureProgressList
              scriptures={Object.values(typedScriptures)}
              onScriptureClick={(scriptureId, lastPage) => {
                navigate(`/scripture/${scriptureId}${lastPage ? `?page=${lastPage}` : ''}`);
              }}
            />
          </div>
        )}
        
      </div>
      <Footer />
      {<BottomNav />}
      
      {/* 설문 팝업 */}
      {showSurveyPopup && <SurveyPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Main;