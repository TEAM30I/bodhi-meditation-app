import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTemples, isTempleFollowed } from '@/lib/repository';
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
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<TempleSort>('popular');
  const [searchValue, setSearchValue] = useState('');
  const [likedTemples, setLikedTemples] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
  // URL 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearby = queryParams.get('nearby') === 'true';
  const sortByParam = queryParams.get('sort') as TempleSort || 'popular';
  
  // 현재 활성화된 탭 (temple 또는 temple-stay)
  const isTempleTab = !location.pathname.includes('temple-stay');

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
  
  // 템플 데이터 로드
  useEffect(() => {
    const loadTemples = async () => {
      setLoading(true);
      try {
        // 검색 결과 가져오기
        let data = await searchTemples(query, sortByParam);
        
        // 최대 30개로 제한
        data = data.slice(0, 30);
        
        // 거리 정보 표시를 위한 처리
        if (sortByParam === 'distance') {
          // 거리 정보가 이미 repository에서 계산되어 있으므로 추가 처리 필요 없음
        } else if (data.length > 0) {
          // 거리순 정렬이 아니더라도 위치 정보가 있는 경우 거리 계산
          try {
            const userLocation = await getCurrentLocation();
            
            // 각 사찰에 거리 정보 추가
            for (const temple of data) {
              if (temple.latitude && temple.longitude) {
                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  temple.latitude,
                  temple.longitude
                );
                temple.distance = formatDistance(distance);
                // 정렬용 숫자값 추가 (타입에 없지만 내부 로직용)
                (temple as any).distanceValue = distance;
              }
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
  }, [query, sortByParam, user]);
  
  const handleSortChange = (value: string) => {
    const newSortBy = value as TempleSort;
    setSortBy(newSortBy);
    
    // 현재 목록 내에서 정렬
    if (temples.length > 0) {
      const sortedTemples = [...temples];
      
      if (newSortBy === 'distance') {
        sortedTemples.sort((a, b) => {
          const distA = (a as any).distanceValue || Infinity;
          const distB = (b as any).distanceValue || Infinity;
          return distA - distB;
        });
      } else if (newSortBy === 'popular') {
        sortedTemples.sort((a, b) => (b.follower_count || b.likeCount || 0) - (a.follower_count || a.likeCount || 0));
      }
      
      setTemples(sortedTemples);
    }
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newSortBy);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };
  
  const title = query 
    ? `'${query}' 검색 결과` 
    : '검색 결과';
  
  // 지역 버튼 클릭 핸들러
  const handleRegionClick = (region: string) => {
    navigate(`/search/temple/results?query=${region}`);
  };
  
  // 좋아요 토글 핸들러
  const handleLikeToggle = async (templeId: string) => {
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
                likeCount: (temple.likeCount || 0) + (newStatus ? 1 : -1),
                follower_count: (temple.follower_count || 0) + (newStatus ? 1 : -1)
              } 
            : temple
        )
      );
      
      toast.success(newStatus ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
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
                  onLikeToggle={() => handleLikeToggle(temple.id)}
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
