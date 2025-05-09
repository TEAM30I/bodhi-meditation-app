import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTempleStays, isTempleStayFollowed, searchNearbyTempleStays } from '@/lib/repository';
import { TempleStay, TempleStaySort } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TempleStayItem from '@/components/search/TempleStayItem';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { toggleTempleStayFollow } from '@/lib/repository';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/locationUtils';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TempleStaySort>('popular');
  const [searchValue, setSearchValue] = useState('');
  const [likedTempleStays, setLikedTempleStays] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  // URL 쿼리 파라미터를 먼저 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearbyParam = queryParams.get('nearby') === 'true';
  const lat = parseFloat(queryParams.get('lat') || '0');
  const lng = parseFloat(queryParams.get('lng') || '0');
  const addressParam = queryParams.get('address') || '';
  const sortByParam = queryParams.get('sort') as TempleStaySort || 'popular';
  
  // 현재 활성화된 탭 (temple 또는 temple-stay)
  const isTempleStayTab = location.pathname.includes('temple-stay');

  // 템플스테이 탭으로 이동
  const handleTempleStayTab = () => {
    navigate('/search/temple-stay');
  };

  // 사찰 탭으로 이동
  const handleTempleTab = () => {
    navigate('/search/temple');
  };
  
  // 검색어 초기화
  useEffect(() => {
    if (query) {
      setSearchValue(query);
    } else if (addressParam) {
      setSearchValue(addressParam); // 주소가 있으면 검색창에 표시
    }
  }, [query, addressParam]);
  
  const [sortBy, setSortBy] = useState<TempleStaySort>(sortByParam);
  
  // 주변 검색 관련 상태 변수
  const [nearby, setNearby] = useState<boolean>(nearbyParam);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(
    lat && lng ? { latitude: lat, longitude: lng } : null
  );
  const [address, setAddress] = useState<string>(addressParam);
  
  // 템플스테이 데이터 로드
  useEffect(() => {
    const loadTempleStays = async () => {
      setLoading(true);
      try {
        let data: TempleStay[] = [];
        
        // 주변 검색인 경우
        if (nearby && lat && lng) {
          // 주변 템플스테이 데이터 가져오기 (이미 거리순으로 정렬된 상위 10개)
          data = await searchNearbyTempleStays(lat, lng);
          
          // 정렬 방식에 따라 재정렬
          if (sortBy === 'popular') {
            // 인기순 정렬 (좋아요 수 기준)
            data.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          } else if (sortBy === 'price_low') {
            // 가격 낮은순 정렬
            data.sort((a, b) => {
              const priceA = typeof a.price === 'number' ? a.price : 
                            (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '') || '0') : 0);
              const priceB = typeof b.price === 'number' ? b.price : 
                            (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '') || '0') : 0);
              return priceA - priceB;
            });
          } else if (sortBy === 'price_high') {
            // 가격 높은순 정렬
            data.sort((a, b) => {
              const priceA = typeof a.price === 'number' ? a.price : 
                            (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '') || '0') : 0);
              const priceB = typeof b.price === 'number' ? b.price : 
                            (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '') || '0') : 0);
              return priceB - priceA;
            });
          }
          // distance는 이미 정렬되어 있음
        } else {
          // 일반 검색
          data = await searchTempleStays(query, sortBy);
          
          // 쿼리가 없을 때 최대 30개로 제한
          if (!query) {
            data = data.slice(0, 20);
          }
          
          // 모든 정렬 방식에서 거리 정보 추가
          try {
            const position = await getCurrentLocation();
            const { latitude, longitude } = position;
            
            // 각 템플스테이에 거리 정보 추가
            for (const templeStay of data) {
              if (templeStay.temple?.latitude && templeStay.temple?.longitude) {
                const distance = calculateDistance(
                  latitude, longitude,
                  templeStay.temple.latitude,
                  templeStay.temple.longitude
                );
                templeStay.distance = formatDistance(distance);
              }
            }
          } catch (error) {
            console.error('Error calculating distances:', error);
          }
        }
        
        setTempleStays(data);
        
        // 사용자가 로그인한 경우 좋아요 상태 확인
        if (user) {
          const likedStatus: Record<string, boolean> = {};
          for (const templeStay of data) {
            likedStatus[templeStay.id] = await isTempleStayFollowed(user.id, templeStay.id);
          }
          setLikedTempleStays(likedStatus);
        }
      } catch (error) {
        console.error('Error loading temple stays:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTempleStays();
  }, [query, sortBy, nearby, lat, lng, user]);
  
  const handleFilterChange = (value: string) => {
    const newFilter = value as TempleStaySort;
    setSortBy(newFilter);
    setActiveFilter(newFilter);
    
    // 현재 목록 내에서 정렬
    const sortedTempleStays = [...templeStays];
    
    switch (newFilter) {
      case 'popular':
        sortedTempleStays.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'price_low':
        sortedTempleStays.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 
                        (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '') || '0') : 0);
          const priceB = typeof b.price === 'number' ? b.price : 
                        (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '') || '0') : 0);
          return priceA - priceB;
        });
        break;
      case 'price_high':
        sortedTempleStays.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 
                        (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '') || '0') : 0);
          const priceB = typeof b.price === 'number' ? b.price : 
                        (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '') || '0') : 0);
          return priceB - priceA;
        });
        break;
      case 'distance':
        if (nearby) {
          sortedTempleStays.sort((a, b) => {
            const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
            const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
            return distA - distB;
          });
        }
        break;
    }
    
    setTempleStays(sortedTempleStays);
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newFilter);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };
  
  // 좋아요 토글 핸들러
  const handleLikeToggle = async (e: React.MouseEvent, templeStayId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }
    
    try {
      const newStatus = await toggleTempleStayFollow(user.id, templeStayId);
      setLikedTempleStays(prev => ({
        ...prev,
        [templeStayId]: newStatus
      }));
      
      // 좋아요 카운트 업데이트
      setTempleStays(prev => 
        prev.map(ts => 
          ts.id === templeStayId 
            ? { 
                ...ts, 
                likeCount: (ts.likeCount || 0) + (newStatus ? 1 : -1)
              } 
            : ts
        )
      );
      
      toast.success(`${newStatus ? '찜 목록에 추가했습니다.' : '찜 목록에서 제거했습니다.'}`);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };
  
  // 주변 검색 핸들러 수정
  const handleNearbySearch = async () => {
    try {
      setLoading(true);
      
      // 현재 위치 가져오기
      const position = await getCurrentLocation();
      const { latitude, longitude } = position;
      
      // 위치 정보가 기본값(서울 시청)인지 확인
      const isDefaultLocation = 
        latitude === 37.5665 && longitude === 126.9780;
      
      if (isDefaultLocation) {
        toast.warning('위치 정보를 가져올 수 없어 서울 시청 주변을 검색합니다.');
      }
      
      // 주변 템플스테이 검색 (10km 반경)
      const nearbyTempleStays = await searchNearbyTempleStays(latitude, longitude, 10);
      
      // 거리 계산 및 정렬
      const templeStaysWithDistance = nearbyTempleStays.map(templeStay => {
        const distance = calculateDistance(
          latitude, longitude, 
          templeStay.temple?.latitude || 0, 
          templeStay.temple?.longitude || 0
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
      
      // 상위 10개만 선택
      const top10TempleStays = templeStaysWithDistance.slice(0, 10);
      
      // 상태 업데이트
      setTempleStays(top10TempleStays);
      setNearby(true);
      setUserLocation({ latitude, longitude });
      setSortBy('distance');
      setActiveFilter('distance');
      setSearchValue(''); // 검색어 초기화
      
      // 주소 정보 가져오기
      try {
        const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`, {
          headers: {
            'Authorization': `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`
          }
        });
        
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          const addressInfo = data.documents[0].address;
          const newAddress = `${addressInfo.region_1depth_name} ${addressInfo.region_2depth_name}`;
          setAddress(newAddress);
          
          // URL 파라미터 업데이트 - 기존 쿼리 파라미터 제거하고 새로운 파라미터만 설정
          const params = new URLSearchParams();
          params.set('nearby', 'true');
          params.set('lat', latitude.toString());
          params.set('lng', longitude.toString());
          params.set('address', newAddress);
          params.set('sort', 'distance'); // 주변 검색 시 기본 정렬은 거리순
          
          // 현재 경로에 새 파라미터 적용
          navigate(`${location.pathname.split('?')[0]}?${params.toString()}`, { replace: true });
        }
      } catch (error) {
        console.error('주소 변환 오류:', error);
      }
      
      // 좋아요 상태 확인
      if (user) {
        const likedStatus: Record<string, boolean> = {};
        for (const templeStay of top10TempleStays) {
          try {
            likedStatus[templeStay.id] = await isTempleStayFollowed(user.id, templeStay.id);
          } catch (error) {
            console.error(`좋아요 상태 확인 오류 (${templeStay.id}):`, error);
          }
        }
        setLikedTempleStays(likedStatus);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('주변 검색 오류:', error);
      toast.error('주변 검색에 실패했습니다.');
      setLoading(false);
    }
  };
  
  // 타이틀 설정
  const title = nearby 
    ? address 
      ? `'${address}' 주변 템플스테이` 
      : '내 주변 템플스테이'
    : query 
      ? `'${query}' 검색 결과` 
      : '검색 결과';
  
  return (
    <PageLayout 
      title="템플스테이 찾기" 
      showBackButton 
      onBackButtonClick={() => navigate(-1)}
    >
      <div className="p-4">
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={!isTempleStayTab ? 'default' : 'outline'}
            className={`flex-1 ${!isTempleStayTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleTab}
          >
            사찰
          </Button>
          <Button
            variant={isTempleStayTab ? 'default' : 'outline'}
            className={`flex-1 ${isTempleStayTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleStayTab}
          >
            템플스테이
          </Button>
        </div>
        
        {/* 검색창 추가 */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="템플스테이명 또는 지역으로 검색"
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          {/* 주변 검색 버튼 */}
          <button
            type="button"
            onClick={handleNearbySearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#DE7834] text-white px-3 py-1 rounded-full text-sm"
          >
            주변 검색
          </button>
        </form>
        
        {/* 검색 결과 타이틀 */}
        {(query || nearby) && (
          <h2 className="font-semibold text-lg mb-4">{title}</h2>
        )}
        
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeFilter} onValueChange={handleFilterChange} className="w-full">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="popular">인기순</TabsTrigger>
              <TabsTrigger value="price_low">가격 낮은순</TabsTrigger>
              <TabsTrigger value="price_high">가격 높은순</TabsTrigger>
              <TabsTrigger value="distance">거리순</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* 검색 결과 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
          </div>
        ) : (
          <div>
            {templeStays.length ? (
              templeStays.map((templeStay) => (
                <TempleStayItem
                  key={templeStay.id}
                  templeStay={{
                    ...templeStay,
                    distance: templeStay.distance
                  }}
                  onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
                  isLiked={likedTempleStays[templeStay.id] || false}
                  onLikeToggle={(e) => handleLikeToggle(e, templeStay.id)}
                  showLikeCount={true}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchResults;