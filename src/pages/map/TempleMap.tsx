import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, X } from 'lucide-react';
import { searchNearbyTemples, searchNearbyTempleStays } from '@/lib/repository';
import { Temple, TempleStay } from '@/types';
import { getCurrentLocation, formatDistance } from '@/utils/locationUtils';
import { toast } from 'sonner';
import TempleItem from '@/components/search/TempleItem';
import TempleStayItem from '@/components/search/TempleStayItem';
import { useAuth } from '@/context/AuthContext';
import { isTempleFollowed, isTempleStayFollowed, toggleTempleFollow, toggleTempleStayFollow } from '@/lib/repository';
import { calculateDistance } from '@/utils/locationUtils';
// 전역 kakao 객체 타입 선언
declare global {
  interface Window {
    kakao: any;
    openedInfoWindow: any;
  }
}

const TempleMap: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [nearbyTemples, setNearbyTemples] = useState<Temple[]>([]);
  const [nearbyTempleStays, setNearbyTempleStays] = useState<TempleStay[]>([]);
  const [selectedItem, setSelectedItem] = useState<{type: 'temple' | 'temple-stay', id: string} | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [selectedTempleStay, setSelectedTempleStay] = useState<TempleStay | null>(null);
  const [likedTemples, setLikedTemples] = useState<Record<string, boolean>>({});
  const [likedTempleStays, setLikedTempleStays] = useState<Record<string, boolean>>({});
  const [searchRadius, setSearchRadius] = useState<number>(5); // 기본 검색 반경 5km
  const [activeTab, setActiveTab] = useState<'all' | 'temples' | 'templeStays'>('all');
  const [centerMarker, setCenterMarker] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [clusteredTemples, setClusteredTemples] = useState<string[]>([]);
  const [clusteredTempleStays, setClusteredTempleStays] = useState<string[]>([]);
  const [showClusterModal, setShowClusterModal] = useState(false);
  const radiusCircle = useRef<any>(null);
  
  // 검색 반경 원 설정 함수
  const setRadiusCircle = (circle: any) => {
    // 기존 원 제거
    if (radiusCircle.current) {
      radiusCircle.current.setMap(null);
    }
    
    radiusCircle.current = circle;
  };
  
  // 카카오맵 SDK 로딩 확인 함수 추가
  const waitForKakaoMaps = (maxWaitTime = 10000): Promise<boolean> => {
    return new Promise((resolve) => {
      // 이미 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('카카오맵 SDK가 이미 로드되어 있습니다.');
        resolve(true);
        return;
      }

      let waited = 0;
      const interval = 100;
      
      // 로드될 때까지 대기
      const checkKakaoMaps = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          console.log('카카오맵 SDK 로드 완료');
          clearInterval(checkKakaoMaps);
          resolve(true);
          return;
        }
        
        waited += interval;
        if (waited >= maxWaitTime) {
          console.error('카카오맵 SDK 로드 타임아웃');
          clearInterval(checkKakaoMaps);
          resolve(false);
        }
      }, interval);
    });
  };
  
  // 카카오맵 초기화 함수
  const initializeKakaoMap = (lat: number, lng: number) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao maps SDK not loaded');
      return;
    }

    if (!mapRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 8  // 지도 확대 레벨 (높을수록 넓은 지역 표시)
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    kakaoMapRef.current = map;
    setMapCenter({lat, lng});

    // 현재 위치 마커 추가 (사용자 위치)
    const userMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      map: map
    });

    // 사용자 위치 표시를 위한 커스텀 오버레이
    const userContent = `<div style="padding:5px; background:#fff; border-radius:50%; border:2px solid #DE7834; display:flex; justify-content:center; align-items:center; width:15px; height:15px;">
                          <div style="background:#DE7834; width:7px; height:7px; border-radius:50%;"></div>
                        </div>`;
    
    const userOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(lat, lng),
      content: userContent,
      map: map
    });

    // 중심 마커 추가
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
    
    // 검색 반경 원 추가
    const circle = new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(lat, lng),
      radius: searchRadius * 1000, // 미터 단위로 변환
      strokeWeight: 1,
      strokeColor: '#DE7834',
      strokeOpacity: 0.3,
      strokeStyle: 'solid',
      fillColor: '#DE7834',
      fillOpacity: 0.1
    });
    circle.setMap(map);
    setRadiusCircle(circle);

    // 지도 이동 이벤트 리스너 추가
    window.kakao.maps.event.addListener(map, 'dragend', function() {
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();
      
      // 중심 마커 위치 업데이트
      centerOverlay.setPosition(new window.kakao.maps.LatLng(newLat, newLng));
      setMapCenter({lat: newLat, lng: newLng});
      
      // 검색 반경 원 위치 업데이트
      if (radiusCircle.current) {
        radiusCircle.current.setPosition(new window.kakao.maps.LatLng(newLat, newLng));
      }
      
      // 지도 중심 위치 기준으로 주변 사찰 및 템플스테이 다시 검색
      fetchNearbyItems(newLat, newLng, searchRadius);
    });
    
    // 지도 확대/축소 이벤트 리스너 추가
    window.kakao.maps.event.addListener(map, 'zoom_changed', function() {
      const center = map.getCenter();
      const newLat = center.getLat();
      const newLng = center.getLng();
      const level = map.getLevel();
      
      // 지도 레벨에 따른 검색 반경 자동 조정 (각 레벨마다 2배씩 증가)
      let newRadius = 1; // 기본값
      
      // 카카오맵 레벨은 1~14까지 있음
      switch(level) {
        case 1: newRadius = 0.5; break;  // 가장 가까운 줌
        case 2: newRadius = 1; break;
        case 3: newRadius = 2; break;
        case 4: newRadius = 4; break;
        case 5: newRadius = 8; break;
        case 6: newRadius = 16; break;
        case 7: newRadius = 32; break;
        case 8: newRadius = 64; break;
        case 9: newRadius = 128; break;
        default: newRadius = 256; break; // 매우 먼 줌
      }
      
      // 반경이 변경된 경우에만 업데이트
      if (newRadius !== searchRadius) {
        setSearchRadius(newRadius);
        
        // 검색 반경 원 업데이트
        if (radiusCircle.current) {
          radiusCircle.current.setRadius(newRadius * 1000);
        }
        
        // 새 반경으로 주변 검색
        fetchNearbyItems(newLat, newLng, newRadius);
      }
    });

    setMapLoaded(true);
  };
  
  // 마커 추가 함수 수정
  const addMarkersToMap = (map: any) => {
    console.log('마커 추가 시작');
    
    // 이미 마커가 추가되어 있으면 중복 실행 방지
    if (markersRef.current.length > 0) {
      console.log('마커가 이미 추가되어 있습니다.');
      return;
    }
    
    try {
      // 사찰 마커 추가
      nearbyTemples.forEach(temple => {
        if (temple.latitude && temple.longitude) {
          try {
            const markerPosition = new window.kakao.maps.LatLng(temple.latitude, temple.longitude);
            
            // 사찰 마커 이미지 설정
            const markerImage = new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              new window.kakao.maps.Size(24, 35)
            );
            
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
              image: markerImage,
              title: temple.name
            });
            
            // 마커 클릭 이벤트 리스너 추가
            window.kakao.maps.event.addListener(marker, 'click', function() {
              setSelectedItem({type: 'temple', id: temple.id});
              setSelectedTemple(temple);
              setSelectedTempleStay(null);
            });
            
            markersRef.current.push(marker);
          } catch (error) {
            console.error(`사찰 마커 추가 오류 (${temple.id}):`, error);
          }
        }
      });
      
      // 템플스테이 마커 추가
      nearbyTempleStays.forEach(templeStay => {
        if (templeStay.latitude && templeStay.longitude) {
          try {
            const markerPosition = new window.kakao.maps.LatLng(templeStay.latitude, templeStay.longitude);
            
            // 템플스테이 마커 이미지 설정
            const markerImage = new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
              new window.kakao.maps.Size(24, 35)
            );
            
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
              image: markerImage,
              title: templeStay.templeName || templeStay.temple_name
            });
            
            // 마커 클릭 이벤트 리스너 추가
            window.kakao.maps.event.addListener(marker, 'click', function() {
              setSelectedItem({type: 'temple-stay', id: templeStay.id});
              setSelectedTemple(null);
              setSelectedTempleStay(templeStay);
            });
            
            markersRef.current.push(marker);
          } catch (error) {
            console.error(`템플스테이 마커 추가 오류 (${templeStay.id}):`, error);
          }
        }
      });
      
      console.log(`총 ${markersRef.current.length}개 마커 추가 완료`);
    } catch (error) {
      console.error('마커 추가 중 오류 발생:', error);
    }
  };
  
  // 주변 사찰 및 템플스테이 검색 함수 수정
  const fetchNearbyItems = async (lat: number, lng: number, radius: number) => {
    try {
      // 기존 마커 제거
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];
      
      // 주변 사찰 검색
      const temples = await searchNearbyTemples(lat, lng, radius);
      
      // 주변 템플스테이 검색
      const templeStays = await searchNearbyTempleStays(lat, lng, radius);
      
      console.log(`검색 결과: 사찰 ${temples.length}개, 템플스테이 ${templeStays.length}개`);
      
      // 거리 계산 및 정렬
      const templesWithDistance = temples.map(temple => {
        const distance = calculateDistance(
          lat, lng, 
          temple.latitude || 0, 
          temple.longitude || 0
        );
        return {
          ...temple,
          distance: formatDistance(distance)
        };
      }).sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
        const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
        return distA - distB;
      });
      
      const templeStaysWithDistance = templeStays.map(templeStay => {
        const distance = calculateDistance(
          lat, lng, 
          templeStay.latitude || 0, 
          templeStay.longitude || 0
        );
        return {
          ...templeStay,
          distance: formatDistance(distance)
        };
      }).sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
        const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
        return distA - distB;
      });
      
      setNearbyTemples(templesWithDistance);
      setNearbyTempleStays(templeStaysWithDistance);
      
      // 지도가 로드된 경우에만 마커 추가
      if (kakaoMapRef.current) {
        console.log('지도 로드 완료, 마커 추가 시도');
        addMarkersToMap(kakaoMapRef.current);
      }
      
      // 좋아요 상태 확인
      if (user) {
        checkLikedStatus(templesWithDistance, templeStaysWithDistance);
      }
    } catch (error) {
      console.error('주변 검색 오류:', error);
      toast.error('주변 검색에 실패했습니다.');
    }
  };
  
  // 지도 초기화 후 마커 추가를 위한 useEffect 추가
  useEffect(() => {
    if (mapLoaded && kakaoMapRef.current && (nearbyTemples.length > 0 || nearbyTempleStays.length > 0)) {
      console.log('지도 로드 완료, 마커 추가 시도');
      addMarkersToMap(kakaoMapRef.current);
    }
  }, [mapLoaded, nearbyTemples, nearbyTempleStays]);
  
  // 위치 정보 및 지도 초기화 함수 수정
  const initializeMapWithLocation = async () => {
    try {
      setLoading(true);
      
      // 카카오맵 SDK 로딩 대기
      const isKakaoLoaded = await waitForKakaoMaps();
      if (!isKakaoLoaded) {
        toast.error('지도를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
        setLoading(false);
        return;
      }
      
      // 현재 위치 가져오기
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // 위치 정보가 기본값(서울 시청)인지 확인
      const isDefaultLocation = 
        location.latitude === 37.5665 && location.longitude === 126.9780;
      
      if (isDefaultLocation) {
        toast.warning('위치 정보를 가져올 수 없어 서울 시청 주변을 검색합니다.');
      }
      
      console.log('위치 정보 수신 성공:', location);
      
      // 카카오맵 초기화
      initializeKakaoMap(location.latitude, location.longitude);
      
      // 주변 사찰 및 템플스테이 검색
      await fetchNearbyItems(location.latitude, location.longitude, searchRadius);
      
      setMapLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error('지도 초기화 오류:', error);
      toast.error('위치 정보를 가져오는데 실패했습니다.');
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      if (isMounted) {
        await initializeMapWithLocation();
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      
      // 컴포넌트 언마운트 시 마커 및 원 제거
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      
      if (radiusCircle.current) {
        radiusCircle.current.setMap(null);
      }
    };
  }, []);
  
  // 사용자 위치 가져오기 및 주변 사찰/템플스테이 검색
  const fetchUserLocationAndNearbyItems = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // 주변 사찰 및 템플스테이 검색
      await fetchNearbyItems(location.latitude, location.longitude, searchRadius);
      
      // 카카오맵 초기화
      initializeKakaoMap(location.latitude, location.longitude);
    } catch (error) {
      console.error('Error getting location or nearby items:', error);
      toast.error('위치 정보를 가져오는데 실패했습니다.');
      
      // 위치 정보를 가져오지 못한 경우 기본 위치(서울 시청)로 지도 초기화
      const defaultLat = 37.5665;
      const defaultLng = 126.9780;
      
      try {
        // 기본 위치 주변 사찰 및 템플스테이 검색
        await fetchNearbyItems(defaultLat, defaultLng, searchRadius);
        
        // 기본 위치로 지도 초기화
        initializeKakaoMap(defaultLat, defaultLng);
      } catch (fallbackError) {
        console.error('Error initializing with default location:', fallbackError);
      }
    }
  };
  
  // 사찰 좋아요 토글 핸들러
  const handleTempleToggle = async (e: React.MouseEvent, templeId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }
    
    try {
      const newStatus = await toggleTempleFollow(user.id, templeId);
      
      // 좋아요 상태 업데이트
      setLikedTemples(prev => ({
        ...prev,
        [templeId]: newStatus
      }));
      
      // 좋아요 카운트 업데이트
      setNearbyTemples(prev => 
        prev.map(temple => 
          temple.id === templeId 
            ? { 
                ...temple, 
                follower_count: (temple.follower_count || 0) + (newStatus ? 1 : -1)
              } 
            : temple
        )
      );
      
      toast.success(newStatus ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
    } catch (error) {
      console.error('Error toggling temple like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 템플스테이 좋아요 토글 핸들러
  const handleTempleStayToggle = async (e: React.MouseEvent, templeStayId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }
    
    try {
      const newStatus = await toggleTempleStayFollow(user.id, templeStayId);
      
      // 좋아요 상태 업데이트
      setLikedTempleStays(prev => ({
        ...prev,
        [templeStayId]: newStatus
      }));
      
      // 좋아요 카운트 업데이트
      setNearbyTempleStays(prev => 
        prev.map(templeStay => 
          templeStay.id === templeStayId 
            ? { 
                ...templeStay, 
                likeCount: (templeStay.likeCount || 0) + (newStatus ? 1 : -1)
              } 
            : templeStay
        )
      );
      
      toast.success(newStatus ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
    } catch (error) {
      console.error('Error toggling temple stay like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 좋아요 상태 확인 함수 추가
  const checkLikedStatus = async (temples: Temple[], templeStays: TempleStay[]) => {
    try {
      const templeStatus: Record<string, boolean> = {};
      const templeStayStatus: Record<string, boolean> = {};
      
      for (const temple of temples) {
        try {
          templeStatus[temple.id] = await isTempleFollowed(user.id, temple.id);
        } catch (error) {
          console.error(`사찰 좋아요 상태 확인 오류 (${temple.id}):`, error);
        }
      }
      
      for (const templeStay of templeStays) {
        try {
          templeStayStatus[templeStay.id] = await isTempleStayFollowed(user.id, templeStay.id);
        } catch (error) {
          console.error(`템플스테이 좋아요 상태 확인 오류 (${templeStay.id}):`, error);
        }
      }
      
      setLikedTemples(templeStatus);
      setLikedTempleStays(templeStayStatus);
    } catch (error) {
      console.error('좋아요 상태 확인 오류:', error);
    }
  };
  
  // 클러스터 모달 컴포넌트
  const ClusterModal = () => {
    const clusterTemples = nearbyTemples.filter(temple => 
      clusteredTemples.includes(temple.id)
    );
    
    const clusterTempleStays = nearbyTempleStays.filter(templeStay => 
      clusteredTempleStays.includes(templeStay.id)
    );
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">
                이 위치의 사찰/템플스테이 ({clusterTemples.length + clusterTempleStays.length}개)
              </h3>
              <button onClick={() => setShowClusterModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[60vh] p-2">
            {clusterTemples.length > 0 && (
              <>
                <div className="font-medium text-sm text-gray-500 mb-2 px-2">
                  사찰 ({clusterTemples.length}개)
                </div>
                <div className="space-y-2 mb-4">
                  {clusterTemples.map(temple => (
                    <TempleItem
                      key={temple.id}
                      temple={{
                        ...temple,
                        follower_count: temple.follower_count || temple.likeCount || 0
                      }}
                      onClick={() => {
                        navigate(`/search/temple/detail/${temple.id}`);
                        setShowClusterModal(false);
                      }}
                      isLiked={likedTemples[temple.id] || false}
                      onLikeToggle={(e) => handleTempleToggle(e, temple.id)}
                      showLikeCount={true}
                      hideDistance={true}
                    />
                  ))}
                </div>
              </>
            )}
            
            {clusterTempleStays.length > 0 && (
              <>
                <div className="font-medium text-sm text-gray-500 mb-2 px-2">
                  템플스테이 ({clusterTempleStays.length}개)
                </div>
                <div className="space-y-2">
                  {clusterTempleStays.map(templeStay => (
                    <TempleStayItem
                      key={templeStay.id}
                      templeStay={{
                        ...templeStay,
                        templeName: templeStay.templeName || templeStay.temple_name || '이름 없음',
                        location: templeStay.location || templeStay.temple?.address || '주소 정보 없음',
                        price: templeStay.price || 0,
                        formattedPrice: templeStay.formattedPrice || 
                                       (typeof templeStay.price === 'number' ? `${templeStay.price.toLocaleString()}원` : 
                                       (typeof templeStay.price === 'string' ? templeStay.price : '가격 정보 없음')),
                        follower_count: templeStay.likeCount || 0,
                        imageUrl: templeStay.imageUrl || templeStay.image_url || '/placeholder-temple.jpg'
                      }}
                      onClick={() => {
                        navigate(`/search/temple-stay/detail/${templeStay.id}`);
                        setShowClusterModal(false);
                      }}
                      isLiked={likedTempleStays[templeStay.id] || false}
                      onLikeToggle={(e) => handleTempleStayToggle(e, templeStay.id)}
                      showLikeCount={true}
                      hideDistance={true}
                      formattedPrice={templeStay.formattedPrice || 
                                     (typeof templeStay.price === 'number' ? `${templeStay.price.toLocaleString()}원` : 
                                     (typeof templeStay.price === 'string' ? templeStay.price : '가격 정보 없음'))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border-t">
            <button 
              className="w-full py-2 bg-[#DE7834] text-white rounded-md"
              onClick={() => setShowClusterModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
      {/* 헤더 */}
      <div className="w-full bg-white shadow-sm">
        <div className="flex justify-between items-center px-5 py-3 max-w-[480px] mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="font-medium">주변 사찰 지도</span>
          </button>
        </div>
      </div>
      
      {/* 본문 */}
      <div className="w-full max-w-[480px] mx-auto pb-20">
        {/* 카카오맵 컨테이너 */}
        <div 
          ref={mapRef} 
          className="w-full h-[60vh] shadow-sm overflow-hidden relative"
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          )}
        </div>
        
        {/* 선택된 아이템 정보 */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <>
              {selectedItem ? (
                <div>
                  <h3 className="font-semibold text-lg mb-4">선택한 장소 정보</h3>
                  
                  {selectedItem.type === 'temple' && selectedTemple && (
                    <TempleItem
                      temple={{
                        ...selectedTemple,
                        follower_count: selectedTemple.follower_count || selectedTemple.likeCount || 0
                      }}
                      onClick={() => navigate(`/search/temple/detail/${selectedTemple.id}`)}
                      isLiked={likedTemples[selectedTemple.id] || false}
                      onLikeToggle={(e) => handleTempleToggle(e, selectedTemple.id)}
                      showLikeCount={true}
                      hideDistance={true}
                    />
                  )}
                  
                  {selectedItem.type === 'temple-stay' && selectedTempleStay && (
                    <TempleStayItem
                      key={selectedTempleStay.id}
                      templeStay={{
                        ...selectedTempleStay,
                        templeName: selectedTempleStay.templeName || selectedTempleStay.temple_name || '이름 없음',
                        location: selectedTempleStay.location || selectedTempleStay.temple?.address || '주소 정보 없음',
                        price: selectedTempleStay.price || 0,
                        formattedPrice: selectedTempleStay.formattedPrice || 
                                       (typeof selectedTempleStay.price === 'number' ? `${selectedTempleStay.price.toLocaleString()}원` : 
                                       (typeof selectedTempleStay.price === 'string' ? selectedTempleStay.price : '가격 정보 없음')),
                        follower_count: selectedTempleStay.likeCount || 0,
                        imageUrl: selectedTempleStay.imageUrl || selectedTempleStay.image_url || '/placeholder-temple.jpg'
                      }}
                      onClick={() => navigate(`/search/temple-stay/detail/${selectedTempleStay.id}`)}
                      isLiked={likedTempleStays[selectedTempleStay.id] || false}
                      onLikeToggle={(e) => handleTempleStayToggle(e, selectedTempleStay.id)}
                      showLikeCount={true}
                      hideDistance={true}
                      formattedPrice={selectedTempleStay.formattedPrice || 
                                     (typeof selectedTempleStay.price === 'number' ? `${selectedTempleStay.price.toLocaleString()}원` : 
                                     (typeof selectedTempleStay.price === 'string' ? selectedTempleStay.price : '가격 정보 없음'))}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">지도에서 사찰이나 템플스테이를 선택해주세요.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* 주변 사찰 및 템플스테이 목록 */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3 px-4">
            <h3 className="font-semibold text-lg">주변 사찰 및 템플스테이</h3>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="flex border-b mb-3">
            <button 
              className={`flex-1 py-2 font-medium text-sm ${activeTab === 'all' ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('all')}
            >
              전체 ({nearbyTemples.length + nearbyTempleStays.length})
            </button>
            <button 
              className={`flex-1 py-2 font-medium text-sm ${activeTab === 'temples' ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('temples')}
            >
              사찰 ({nearbyTemples.length})
            </button>
            <button 
              className={`flex-1 py-2 font-medium text-sm ${activeTab === 'templeStays' ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('templeStays')}
            >
              템플스테이 ({nearbyTempleStays.length})
            </button>
          </div>
          
          {/* 목록 */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {activeTab === 'all' || activeTab === 'temples' ? (
              nearbyTemples.map(temple => (
                <TempleItem
                  key={temple.id}
                  temple={{
                    ...temple,
                    follower_count: temple.follower_count || temple.likeCount || 0
                  }}
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                  isLiked={likedTemples[temple.id] || false}
                  onLikeToggle={(e) => handleTempleToggle(e, temple.id)}
                  showLikeCount={true}
                  hideDistance={true}
                />
              ))
            ) : null}
            
            {activeTab === 'all' || activeTab === 'templeStays' ? (
              nearbyTempleStays.map(templeStay => (
                <TempleStayItem
                  key={templeStay.id}
                  templeStay={{
                    ...templeStay,
                    templeName: templeStay.templeName || templeStay.temple_name || '이름 없음',
                    location: templeStay.location || templeStay.temple?.address || '주소 정보 없음',
                    price: templeStay.price || 0,
                    formattedPrice: templeStay.formattedPrice || 
                                   (typeof templeStay.price === 'number' ? `${templeStay.price.toLocaleString()}원` : 
                                   (typeof templeStay.price === 'string' ? templeStay.price : '가격 정보 없음')),
                    follower_count: templeStay.likeCount || 0,
                    imageUrl: templeStay.imageUrl || templeStay.image_url || '/placeholder-temple.jpg'
                  }}
                  onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
                  isLiked={likedTempleStays[templeStay.id] || false}
                  onLikeToggle={(e) => handleTempleStayToggle(e, templeStay.id)}
                  showLikeCount={true}
                  hideDistance={true}
                  formattedPrice={templeStay.formattedPrice || 
                                 (typeof templeStay.price === 'number' ? `${templeStay.price.toLocaleString()}원` : 
                                 (typeof templeStay.price === 'string' ? templeStay.price : '가격 정보 없음'))}
                />
              ))
            ) : null}
            
            {((activeTab === 'all' && nearbyTemples.length === 0 && nearbyTempleStays.length === 0) ||
              (activeTab === 'temples' && nearbyTemples.length === 0) ||
              (activeTab === 'templeStays' && nearbyTempleStays.length === 0)) && (
              <div className="text-center py-8 text-gray-500">
                주변에 {activeTab === 'temples' ? '사찰' : activeTab === 'templeStays' ? '템플스테이' : '사찰/템플스테이'}이(가) 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 클러스터 모달 */}
      {showClusterModal && <ClusterModal />}
    </div>
  );
};

export default TempleMap; 