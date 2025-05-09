import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Search, Bell, ChevronRight, MapPin } from 'lucide-react';
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
  searchNearbyTemples,
} from '@/lib/repository';
import { TempleStay, Temple, Scripture } from '@/types';
import Footer from '@/components/Footer';
import SurveyPopup from '@/components/SurveyPopup';
import { getCurrentLocation } from '@/utils/locationUtils';
import { toast } from 'sonner';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);
  const [nearbyTemples, setNearbyTemples] = useState<Temple[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [centerMarker, setCenterMarker] = useState<any>(null);

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

  // 카카오맵 초기화 함수 수정
  const initializeKakaoMap = (lat: number, lng: number) => {
    console.log('initializeKakaoMap 호출됨:', { lat, lng });
    
    if (!window.kakao) {
      console.error('Kakao SDK not loaded');
      return;
    }
    
    if (!window.kakao.maps) {
      console.error('Kakao maps module not loaded');
      return;
    }
    
    if (!mapRef.current) {
      console.error('Map container ref not available');
      return;
    }

    try {
      console.log('지도 생성 시도');
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 7  // 지도 확대 레벨 (높을수록 넓은 지역 표시)
      };

      // 지도 생성 전 컨테이너 확인
      console.log('지도 컨테이너 크기:', {
        width: mapRef.current.clientWidth,
        height: mapRef.current.clientHeight
      });

      const map = new window.kakao.maps.Map(mapRef.current, options);
      console.log('지도 생성 성공');
      kakaoMapRef.current = map;
      setMapCenter({lat, lng});

      // 지도 중심 마커 추가
      const centerContent = `<div style="padding:5px; background:#fff; border-radius:50%; border:2px solid #FF3B30; display:flex; justify-content:center; align-items:center; width:24px; height:24px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                            <div style="background:#FF3B30; width:12px; height:12px; border-radius:50%;"></div>
                          </div>`;
      
      const centerOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        content: centerContent,
        map: map,
        zIndex: 10
      });
      
      setCenterMarker(centerOverlay);

      // 지도 이동 이벤트 리스너 추가
      window.kakao.maps.event.addListener(map, 'dragend', function() {
        const center = map.getCenter();
        const newLat = center.getLat();
        const newLng = center.getLng();
        
        // 중심 마커 위치 업데이트
        centerOverlay.setPosition(new window.kakao.maps.LatLng(newLat, newLng));
        setMapCenter({lat: newLat, lng: newLng});
        
        // 지도 중심 위치 기준으로 주변 사찰 검색
        searchNearbyTemples(newLat, newLng)
          .then(nearbyTemplesData => {
            setNearbyTemples(nearbyTemplesData);
            // 마커 추가
            setTimeout(() => {
              if (kakaoMapRef.current) {
                addTempleMarkersToMap(kakaoMapRef.current);
              }
            }, 100);
          })
          .catch(error => {
            console.error('Error fetching nearby temples:', error);
          });
      });

      // 지도 로드 완료 상태 설정
      setMapLoaded(true);
      
      // 지도 크기 재조정 (렌더링 문제 해결을 위해)
      setTimeout(() => {
        console.log('지도 크기 재조정');
        map.relayout();
      }, 100);
    } catch (mapError) {
      console.error('Error initializing map:', mapError);
      setMapLoaded(false);
    }
  };

  // 주변 사찰 마커 추가 함수
  const addTempleMarkersToMap = (map: any) => {
    if (!nearbyTemples || nearbyTemples.length === 0) {
      console.log('No nearby temples to add markers for');
      return;
    }
    
    console.log(`Adding markers for ${nearbyTemples.length} temples`);
    
    // 사찰 마커 추가
    nearbyTemples.forEach(temple => {
      if (temple.latitude && temple.longitude) {
        try {
          console.log(`Adding temple marker: ${temple.name} at ${temple.latitude}, ${temple.longitude}`);
          
          const markerPosition = new window.kakao.maps.LatLng(temple.latitude, temple.longitude);
          
          // 사찰 마커 이미지 설정
          const markerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 40) }
          );
          
          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map,
            image: markerImage,
            title: temple.name
          });
          
          // 마커 클릭 이벤트 리스너 추가
          window.kakao.maps.event.addListener(marker, 'click', function() {
            navigate(`/search/temple/detail/${temple.id}`);
          });
        } catch (error) {
          console.error(`Error adding marker for temple ${temple.id}:`, error);
        }
      } else {
        console.warn(`Temple ${temple.id} (${temple.name}) has no coordinates`);
      }
    });
  };

  // 위치 정보 및 주변 사찰 가져오기 함수 수정
  const fetchUserLocationAndNearbyTemples = async () => {
    try {
      setLoading(true);
      
      // 위치 정보 가져오기 시도
      const location = await getCurrentLocation();
      console.log('위치 정보 수신 성공:', location);
      setUserLocation(location);
      
      // 주변 사찰 검색
      const nearbyTemplesData = await searchNearbyTemples(location.latitude, location.longitude);
      setNearbyTemples(nearbyTemplesData);
      
      // 카카오맵 초기화
      if (mapRef.current) {
        // 카카오맵 SDK가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
          initializeKakaoMap(location.latitude, location.longitude);
        } else {
          // SDK가 로드될 때까지 기다림
          console.log('카카오맵 SDK 로딩 대기 중...');
          const waitForKakaoMaps = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
              clearInterval(waitForKakaoMaps);
              console.log('카카오맵 SDK 로드 완료');
              initializeKakaoMap(location.latitude, location.longitude);
            }
          }, 100);
          
          // 10초 후에도 로드되지 않으면 인터벌 정리
          setTimeout(() => {
            clearInterval(waitForKakaoMaps);
            console.error('카카오맵 SDK 로드 타임아웃');
            setLoading(false);
          }, 10000);
        }
      } else {
        console.error('지도 컨테이너가 준비되지 않았습니다.');
      }
    } catch (error) {
      console.error('Error getting location or nearby temples:', error);
      toast.error('위치 정보를 가져오는데 실패했습니다.');
      
      // 위치 정보를 가져오지 못한 경우 기본 위치(서울 시청)로 지도 초기화
      const defaultLat = 37.5665;
      const defaultLng = 126.9780;
      
      if (mapRef.current && window.kakao && window.kakao.maps) {
        initializeKakaoMap(defaultLat, defaultLng);
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect에서 카카오맵 SDK 로드 확인
  useEffect(() => {
    // 카카오맵 SDK 로드 확인
    const script = document.querySelector('script[src*="kakao.maps.sdk"]');
    if (!script) {
      console.error('카카오맵 SDK 스크립트를 찾을 수 없습니다.');
      const kakaoScript = document.createElement('script');
      kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false`;
      kakaoScript.async = true;
      document.head.appendChild(kakaoScript);
      
      kakaoScript.onload = () => {
        window.kakao.maps.load(() => {
          console.log('카카오맵 SDK 로드 완료');
          if (userLocation) {
            initializeKakaoMap(userLocation.latitude, userLocation.longitude);
          }
        });
      };
    }
    
    fetchUserLocationAndNearbyTemples();
  }, []);

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
    
    // 위치 정보 및 주변 사찰 가져오기
    fetchUserLocationAndNearbyTemples();
    
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
            {/* 검색바 주석 처리 */}
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
        <div className="mb-8 cursor-pointer" onClick={handleNavigateToCalendar}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">경전 캘린더</h2>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div className="w-full flex justify-center">
            <ScriptureCalendarPrev />
          </div>
        </div>

        {/* 사찰 지도 */}
        <div className="py-4 mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="font-semibold text-lg">사찰 지도</h2>
            <button 
              className="text-sm text-[#DE7834] flex items-center"
              onClick={() => navigate('/map/temples')}
            >
              지도에서 사찰/템플스테이 더보기 <ChevronRight size={16} />
            </button>
          </div>
          
          {/* 카카오맵 컨테이너 */}
          <div 
            ref={mapRef} 
            className="w-full h-[200px] rounded-lg shadow-sm overflow-hidden relative bg-gray-100 border border-gray-300"
            style={{ minHeight: '200px' }}
          >
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
              </div>
            ) : null}
          </div>
          
          {/* 주변 사찰 리스트 */}
          {nearbyTemples.length > 0 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {nearbyTemples.slice(0, 5).map((temple) => (
                <div
                  key={temple.id}
                  className="min-w-[120px] w-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm cursor-pointer"
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                >
                  <div className="h-[80px] overflow-hidden">
                    <img 
                      src={temple.imageUrl || temple.image_url || '/placeholder-temple.jpg'} 
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-1">{temple.name}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <MapPin size={10} className="mr-1" />
                      <span className="line-clamp-1">{temple.distance || '거리 정보 없음'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-3 text-center">
              {mapCenter ? '지도 중심 주변에 사찰이 없습니다.' : '주변 사찰을 불러오는 중입니다...'}
            </p>
          )}
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
      </div>
      <Footer />
      <BottomNav />
      
      {/* 설문 팝업 */}
      {showSurveyPopup && <SurveyPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Main;