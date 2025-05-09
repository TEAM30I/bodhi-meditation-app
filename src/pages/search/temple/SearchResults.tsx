import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTemples, isTempleFollowed, searchNearbyTemples } from '@/lib/repository';
import { Temple, TempleSort } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TempleItem from '@/components/search/TempleItem';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { toggleTempleFollow } from '@/lib/repository';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/locationUtils';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터를 먼저 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearbyParam = queryParams.get('nearby') === 'true';
  const lat = parseFloat(queryParams.get('lat') || '0');
  const lng = parseFloat(queryParams.get('lng') || '0');
  const addressParam = queryParams.get('address') || '';
  const sortByParam = queryParams.get('sort') as TempleSort || 'popular';

  // State 초기화
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<TempleSort>(sortByParam);
  const [searchValue, setSearchValue] = useState('');
  const [likedTemples, setLikedTemples] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  // 현재 활성화된 탭 (temple 또는 temple-stay)
  const isTempleTab = !location.pathname.includes('temple-stay');

  // 주변 검색 관련 상태 변수
  const [nearby, setNearby] = useState<boolean>(nearbyParam);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(
    lat && lng ? { latitude: lat, longitude: lng } : null
  );
  const [address, setAddress] = useState<string>(addressParam);

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
    } else if (address) {
      setSearchValue(address); // 주소가 있으면 검색창에 표시
    }
  }, [query, address]);
  
  // 템플 데이터 로드
  useEffect(() => {
    const loadTemples = async () => {
      setLoading(true);
      try {
        let data: Temple[] = [];
        
        // 주변 검색인 경우
        if (nearby && lat && lng) {
          // 주변 사찰 데이터 가져오기 (이미 거리순으로 정렬된 상위 10개)
          data = await searchNearbyTemples(lat, lng);
          
          // 정렬 방식에 따라 재정렬
          if (sortBy === 'popular') {
            // 인기순 정렬 (좋아요 수 기준)
            data.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
          }
          // distance는 이미 정렬되어 있음
        } else {
          // 일반 검색
          data = await searchTemples(query, sortBy);
          
          // 쿼리가 없을 때 최대 30개로 제한
          if (!query) {
            data = data.slice(0, 20);
          }
          
          // 모든 정렬 방식에서 거리 정보 추가
          try {
            const position = await getCurrentLocation();
            const { latitude, longitude } = position;
            
            // 각 사찰에 거리 정보 추가
            for (const temple of data) {
              if (temple.latitude && temple.longitude) {
                const distance = calculateDistance(
                  latitude, longitude,
                  temple.latitude,
                  temple.longitude
                );
                temple.distance = formatDistance(distance);
              }
            }
            
            // 거리순 정렬이 선택된 경우 거리 기준으로 정렬
            if (sortBy === 'distance') {
              data.sort((a, b) => {
                const distA = a.latitude && a.longitude ? calculateDistance(
                  latitude, longitude, a.latitude, a.longitude
                ) : Infinity;
                
                const distB = b.latitude && b.longitude ? calculateDistance(
                  latitude, longitude, b.latitude, b.longitude
                ) : Infinity;
                
                return distA - distB;
              });
            }
          } catch (error) {
            console.error('Error calculating distances:', error);
          }
        }
        
        setTemples(data);
        
        // 사용자가 로그인한 경우 좋아요 상태 확인
        if (user) {
          const likedStatus: Record<string, boolean> = {};
          for (const temple of data) {
            likedStatus[temple.id] = await isTempleFollowed(user.id, temple.id);
          }
          setLikedTemples(likedStatus);
        }
      } catch (error) {
        console.error('Error loading temples:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTemples();
  }, [query, sortBy, nearby, lat, lng, user]);
  
  const handleSortChange = (value: string) => {
    const newSortBy = value as TempleSort;
    setSortBy(newSortBy);
    
    // 현재 목록 내에서 정렬
    const sortedTemples = [...temples];
    
    switch (newSortBy) {
      case 'popular':
        sortedTemples.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
        break;
      case 'distance':
        if (nearby) {
          sortedTemples.sort((a, b) => {
            const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
            const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
            return distA - distB;
          });
        }
        break;
    }
    
    setTemples(sortedTemples);
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newSortBy);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };
  
  const title = nearby 
    ? address 
      ? `'${address}' 주변 사찰` 
      : '내 주변 사찰'
    : query 
      ? `'${query}' 검색 결과` 
      : '검색 결과';
  
  // 지역 버튼 클릭 핸들러
  const handleRegionClick = (region: string) => {
    navigate(`/search/temple/results?query=${region}`);
  };
  
  // 좋아요 토글 핸들러
  const handleLikeToggle = async (e: React.MouseEvent, templeId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }
    
    try {
      const newStatus = await toggleTempleFollow(user.id, templeId);
      setLikedTemples(prev => ({
        ...prev,
        [templeId]: newStatus
      }));
      
      // 좋아요 카운트 업데이트
      setTemples(prev => 
        prev.map(temple => 
          temple.id === templeId 
            ? { 
                ...temple, 
                follower_count: (temple.follower_count || 0) + (newStatus ? 1 : -1)
              } 
            : temple
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
      
      // 주변 사찰 검색 (10km 반경)
      const nearbyTemples = await searchNearbyTemples(latitude, longitude, 10);
      
      // 거리 계산 및 정렬
      const templesWithDistance = nearbyTemples.map(temple => {
        const distance = calculateDistance(
          latitude, longitude, 
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
      
      // 상위 10개만 선택
      const top10Temples = templesWithDistance.slice(0, 10);
      
      // 상태 업데이트
      setTemples(top10Temples);
      setNearby(true);
      setUserLocation({ latitude, longitude });
      setSortBy('distance');
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
        for (const temple of top10Temples) {
          try {
            likedStatus[temple.id] = await isTempleFollowed(user.id, temple.id);
          } catch (error) {
            console.error(`좋아요 상태 확인 오류 (${temple.id}):`, error);
          }
        }
        setLikedTemples(likedStatus);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('주변 검색 오류:', error);
      toast.error('주변 검색에 실패했습니다.');
      setLoading(false);
    }
  };
  
  return (
    <PageLayout 
      title="사찰 찾기" 
      showBackButton 
      onBackButtonClick={() => navigate(-1)}
    >
      <div className="p-4">
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={isTempleTab ? 'default' : 'outline'}
            className={`flex-1 ${isTempleTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleTab}
          >
            사찰
          </Button>
          <Button
            variant={!isTempleTab ? 'default' : 'outline'}
            className={`flex-1 ${!isTempleTab ? 'bg-[#DE7834]' : ''}`}
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
            placeholder="사찰명 또는 지역으로 검색"
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
        {(query) && (
          <h2 className="font-semibold text-lg mb-4">{title}</h2>
        )}
        
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-4">
          <Tabs value={sortBy} onValueChange={handleSortChange} className="w-full">
            <TabsList className="grid grid-cols-2 h-9">
              <TabsTrigger value="popular">인기순</TabsTrigger>
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
            {temples.length ? (
              temples.map((temple) => (
                <TempleItem
                  key={temple.id}
                  temple={{
                    ...temple,
                    follower_count: temple.follower_count || temple.likeCount || 0
                  }}
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                  isLiked={likedTemples[temple.id] || false}
                  onLikeToggle={(e) => handleLikeToggle(e, temple.id)}
                  showLikeCount={true}
                  distance={temple.distance}
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
