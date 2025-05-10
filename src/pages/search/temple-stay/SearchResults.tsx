import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTempleStays } from '@/lib/repository';
import { TempleStay, TempleStaySort } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TempleStayItem from '@/components/search/TempleStayItem';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { isTempleStayFollowed, toggleTempleStayFollow } from '@/lib/repository';
import { getCurrentLocation, calculateDistance, formatDistance  } from '@/utils/locationUtils';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TempleStaySort>('popular');
  const [searchValue, setSearchValue] = useState('');
  const [likedTempleStays, setLikedTempleStays] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  // URL 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearby = queryParams.get('nearby') === 'true';
  const isRegion = queryParams.get('isRegion') === 'true';
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
    }
  }, [query]);
  
  const [sortBy, setSortBy] = useState<TempleStaySort>(sortByParam);
  
  // 템플스테이 데이터 로드
  useEffect(() => {
    const loadTempleStays = async () => {
      setLoading(true);
      try {
        // 검색 결과 가져오기
        let data = await searchTempleStays(query, sortByParam);
        
        // 최대 30개로 제한
        data = data.slice(0, 30);
        
        // 위치 정보가 있는 경우 현재 위치와의 거리 계산
        const templeStaysWithDistance = await Promise.all(
          data.map(async (ts) => {
            if (ts.temple?.latitude && ts.temple?.longitude) {
              try {
                const userLocation = await getCurrentLocation();
                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  ts.temple.latitude,
                  ts.temple.longitude
                );
                return { 
                  ...ts, 
                  distance: formatDistance(distance),
                  distanceValue: distance // 정렬용 숫자값 추가 (타입에 없지만 내부 로직용)
                };
              } catch (error) {
                console.error('Error calculating distance:', error);
              }
            }
            return ts;
          })
        );
        
        // 정렬 방식에 따라 정렬
        let sortedData = [...templeStaysWithDistance];
        
        if (sortByParam === 'distance') {
          sortedData.sort((a, b) => {
            const distA = (a as any).distanceValue || Infinity;
            const distB = (b as any).distanceValue || Infinity;
            return distA - distB;
          });
        } else if (sortByParam === 'popular') {
          sortedData.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        } else if (sortByParam === 'price_low') {
          sortedData.sort((a, b) => {
            const priceA = typeof a.price === 'number' ? a.price : parseInt((a.price as string).replace(/[^\d]/g, '') || '0');
            const priceB = typeof b.price === 'number' ? b.price : parseInt((b.price as string).replace(/[^\d]/g, '') || '0');
            return priceA - priceB;
          });
        } else if (sortByParam === 'price_high') {
          sortedData.sort((a, b) => {
            const priceA = typeof a.price === 'number' ? a.price : parseInt((a.price as string).replace(/[^\d]/g, '') || '0');
            const priceB = typeof b.price === 'number' ? b.price : parseInt((b.price as string).replace(/[^\d]/g, '') || '0');
            return priceB - priceA;
          });
        }
        
        setTempleStays(sortedData);
        
        // 사용자가 로그인한 경우 좋아요 상태 확인
        if (user) {
          const likedStatus: Record<string, boolean> = {};
          for (const templeStay of sortedData) {
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
  }, [query, sortByParam, user]);
  
  const handleFilterChange = (value: string) => {
    const newFilter = value as TempleStaySort;
    setActiveFilter(newFilter);
    
    // 현재 목록 내에서 정렬
    if (templeStays.length > 0) {
      const sortedTempleStays = [...templeStays];
      
      if (newFilter === 'distance') {
        sortedTempleStays.sort((a, b) => {
          const distA = (a as any).distanceValue || Infinity;
          const distB = (b as any).distanceValue || Infinity;
          return distA - distB;
        });
      } else if (newFilter === 'popular') {
        sortedTempleStays.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else if (newFilter === 'price_low') {
        sortedTempleStays.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseInt((a.price as string).replace(/[^\d]/g, '') || '0');
          const priceB = typeof b.price === 'number' ? b.price : parseInt((b.price as string).replace(/[^\d]/g, '') || '0');
          return priceA - priceB;
        });
      } else if (newFilter === 'price_high') {
        sortedTempleStays.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseInt((a.price as string).replace(/[^\d]/g, '') || '0');
          const priceB = typeof b.price === 'number' ? b.price : parseInt((b.price as string).replace(/[^\d]/g, '') || '0');
          return priceB - priceA;
        });
      }
      
      setTempleStays(sortedTempleStays);
    }
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newFilter);
    navigate(`${location.pathname}?${params.toString()}`);
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
      
      toast.success(newStatus ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };
  
  const title = query 
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
            placeholder="사찰명, 템플스테이명 또는 지역으로 검색"
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              <TabsTrigger value="distance">거리순</TabsTrigger>
              <TabsTrigger value="price_low">가격낮은순</TabsTrigger>
              <TabsTrigger value="price_high">가격높은순</TabsTrigger>
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
              templeStays.map((ts) => (
                <TempleStayItem
                  key={ts.id}
                  templeStay={{
                    ...ts,
                    templeName: (ts as any).temple_name || (ts as any).name || ts.templeName,
                    location: ts.temple?.address || ts.location || '주소 정보 없음',
                    price: typeof ts.price === 'number' ? ts.price : 
                           (typeof ts.price === 'string' ? parseInt((ts.price as string).replace(/[^\d]/g, '') || '0') : 0),
                    likeCount: ts.likeCount || 0,
                    distance: ts.distance || '거리 정보 없음',
                    temple: ts.temple,
                    direction: ts.direction,
                    websiteUrl: ts.websiteUrl
                  }}
                  onClick={() => navigate(`/search/temple-stay/detail/${ts.id}`)}
                  isLiked={likedTempleStays[ts.id] || false}
                  onLikeToggle={(e) => handleLikeToggle(e, ts.id)}
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