import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { ScriptureCalendarPrev } from '@/components/scripture/ScriptureCalendar_prev';
import ScriptureProgressList from '@/components/scripture/ScriptureProgressList';
import { typedData } from '@/utils/typeUtils';
import {
  getTempleList,
  getTempleStayList,
  getReadingSchedule,
  getScriptureList,
} from '@/lib/repository';
import { TempleStay, Temple, Scripture } from '@/types';
import Footer from '@/components/Footer';
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
  const mapRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [scriptures, setScriptures] = useState<Scripture[]>([]);

  /* ------------------------------------------------------------------
   * 데이터 패칭
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templesData, templeStaysData, scripturesData] = await Promise.all([
          getTempleList(),
          getTempleStayList(),
          getScriptureList(),
        ]);

        setTemples(templesData);
        setTempleStays(templeStaysData);
        setScriptures(scripturesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

  /* ------------------------------------------------------------------
   * 카카오맵 초기화 (kakao.js 는 load() 내부에서 자동 로드됨)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!mapRef.current) return; // 컨테이너가 아직 없음

    // kakao.maps.load 는 sdk.js 가 로드되어 있으면 즉시, 아니면 onload 후 실행
    window.kakao.maps.load(() => {
      console.log('kakao.js loaded ✔');
      const map = new window.kakao.maps.Map(mapRef.current as HTMLElement, {
        center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
      });

      // 중심 마커
      new window.kakao.maps.Marker({ position: map.getCenter() }).setMap(map);

      // 레이아웃 재계산 (Flex·Grid 안에서 0px 로 그려지는 문제 방지)
      setTimeout(() => map.relayout(), 0);
    });
  }, []);

  /* ------------------------------ 렌더링 ------------------------------ */
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }

  const recommendedTemples = temples.slice(0, 4);
  const recommendedTempleStays = templeStays.slice(0, 4);
  const typedReadingSchedule = typedData<typeof getReadingSchedule>(getReadingSchedule);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const handleNavigateToCalendar = () => navigate('/scripture/calendar');

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
      {/* 헤더 */}
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
          <button className="relative" onClick={() => navigate('/notifications')}>
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="w-full max-w-[480px] mx-auto pb-20 py-4 px-5">
        {/* 경전 캘린더 */}
        <div className="mb-3 cursor-pointer" onClick={handleNavigateToCalendar}>
          <div className="flex items-center">
            <h2 className="text-lg font-bold">경전 캘린더</h2>
            <ChevronRight size={18} className="text-gray-400 ml-1" />
          </div>
          <div className="mb-6">
            <ScriptureCalendarPrev />
          </div>
        </div>

        {/* 사찰 지도 */}
        <div className="py-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-lg">사찰 지도</h2>
          </div>
          <p className="text-gray-500 text-sm mb-3">도로 사찰을 둘러보고, 관심 사찰로 저장해보세요</p>
          <div
            id="kakao-map"
            ref={mapRef}
            style={{ width: '100%', height: '250px' }}
            className="w-full h-64 bg-gray-200 rounded-lg mb-1 overflow-hidden cursor-pointer"
            onClick={() => navigate('/nearby')}
          />
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
                className="min-w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer relative"
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
                className="min-w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer relative"
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

        {/* 경전 진행 리스트 (곧 업데이트될 예정) */}
        <div className="mb-8 relative">
          {/* 블러 오버레이 */}
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
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Main;
