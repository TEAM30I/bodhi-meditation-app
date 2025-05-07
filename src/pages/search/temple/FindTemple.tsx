import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
// 함수만 가져오기
import { 
  getRegionTags,
  getTempleList, 
  getTopLikedTemples, 
  getNearbyTemples,
  filterTemplesByTag
} from '@/lib/repository';
// 타입은 types에서 가져오기
import { Temple, RegionTag } from '@/types';
// 상수 가져오기
import { DEFAULT_LOCATION } from '@/constants';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';
import { toast } from 'sonner';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  const [regionTagsList, setRegionTagsList] = useState<RegionTag[]>([]);
  
  // 데이터 상태
  const [temples, setTemples] = useState<Temple[]>([]);
  const [nearbyTemples, setNearbyTemples] = useState<Temple[]>([]);
  const [popularTemples, setPopularTemples] = useState<Temple[]>([]);
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState({
    temples: true,
    nearby: true,
    popular: true,
    regions: true
  });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Load region tags from database
  useEffect(() => {
    const fetchRegionTags = async () => {
      try {
        setLoading(prev => ({...prev, regions: true}));
        const tags = await getRegionTags();
        setRegionTagsList(tags);
        if (tags.length > 0) {
          setActiveRegion(tags[0].name);
        }
      } catch (error) {
        console.error("Failed to load region tags:", error);
        toast.error("지역 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(prev => ({...prev, regions: false}));
      }
    };
    
    fetchRegionTags();
  }, []);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast.error('위치 정보를 가져올 수 없습니다.');
          // 기본 위치 설정 (서울) - 상수에서 가져오기
          setUserLocation({ 
            lat: DEFAULT_LOCATION.latitude, 
            lng: DEFAULT_LOCATION.longitude 
          });
        }
      );
    } else {
      toast.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
      // 기본 위치 설정 (서울) - 상수에서 가져오기
      setUserLocation({ 
        lat: DEFAULT_LOCATION.latitude, 
        lng: DEFAULT_LOCATION.longitude 
      });
    }
  }, []);

  // 모든 사찰 데이터 로드
  useEffect(() => {
    const loadTemples = async () => {
      try {
        const templeList = await getTempleList();
        setTemples(templeList);
        setFilteredTemples(templeList);
        setLoading(prev => ({...prev, temples: false}));
      } catch (error) {
        console.error("Failed to load temples:", error);
        toast.error("사찰 목록을 불러오는데 실패했습니다.");
        setLoading(prev => ({...prev, temples: false}));
      }
    };

    loadTemples();
  }, []);

  // 가까운 사찰 로드 (위치 정보 사용)
  useEffect(() => {
    const loadNearbyTemples = async () => {
      if (!userLocation) return;
      
      try {
        const nearby = await getNearbyTemples(userLocation.lat, userLocation.lng, 5);
        setNearbyTemples(nearby);
        setLoading(prev => ({...prev, nearby: false}));
      } catch (error) {
        console.error("Failed to load nearby temples:", error);
        toast.error("가까운 사찰을 불러오는데 실패했습니다.");
        setLoading(prev => ({...prev, nearby: false}));
      }
    };

    if (userLocation) {
      loadNearbyTemples();
    }
  }, [userLocation]);

  // 인기 사찰 로드
  useEffect(() => {
    const loadPopularTemples = async () => {
      try {
        const popular = await getTopLikedTemples(5);
        setPopularTemples(popular);
        setLoading(prev => ({...prev, popular: false}));
      } catch (error) {
        console.error("Failed to load popular temples:", error);
        toast.error("인기 사찰을 불러오는데 실패했습니다.");
        setLoading(prev => ({...prev, popular: false}));
      }
    };

    loadPopularTemples();
  }, []);
  
  // 지역 필터링 함수
  const handleRegionClick = async (region: string) => {
    setActiveRegion(region);
    
    try {
      // 지역으로 사찰 필터링
      const filtered = temples.filter(temple => 
        temple.location.includes(region)
      );
      setFilteredTemples(filtered.length ? filtered : temples);

      // 만약 필터링 결과가 없다면 태그 기반으로 검색 시도
      if (filtered.length === 0) {
        const tagFiltered = await filterTemplesByTag(region);
        if (tagFiltered.length > 0) {
          setFilteredTemples(tagFiltered);
        }
      }
    } catch (error) {
      console.error("Error filtering by region:", error);
      toast.error("지역 필터링에 실패했습니다.");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) return;
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  return (
    <PageLayout title="사찰 찾기">
      <div className="p-4">
        {/* 검색 폼 */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <Input
            type="text"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="사찰명 또는 지역으로 검색"
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </form>

        {/* 지역 태그 */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">지역별 사찰</h3>
          {loading.regions ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {regionTagsList.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleRegionClick(tag.name)}
                  className={`py-2 px-4 rounded-full whitespace-nowrap ${
                    activeRegion === tag.name
                      ? 'bg-[#DE7834] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 인기 사찰 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">인기 사찰</h3>
            <button 
              onClick={() => navigate('/search/temple/results?sort=popular')}
              className="text-[#DE7834] flex items-center text-sm"
            >
              더보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading.popular ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {popularTemples.map((temple) => (
                <div 
                  key={temple.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="h-32 bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1">{temple.name}</h4>
                    <p className="text-gray-500 text-xs">{temple.location}</p>
                    {temple.likeCount !== undefined && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{temple.likeCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 내 주변 사찰 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">내 주변 사찰</h3>
            <button 
              onClick={() => navigate('/search/temple/results?nearby=true')}
              className="text-[#DE7834] flex items-center text-sm"
            >
              더보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading.nearby ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {nearbyTemples.map((temple) => (
                <div 
                  key={temple.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="h-32 bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1">{temple.name}</h4>
                    <p className="text-gray-500 text-xs">{temple.location}</p>
                    {temple.distance && (
                      <p className="text-[#DE7834] text-xs mt-1">{temple.distance} 거리</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 지역별 필터링된 사찰 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">{activeRegion} 사찰</h3>
          </div>
          
          {loading.temples ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemples.map((temple) => (
                <div 
                  key={temple.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm flex cursor-pointer"
                  onClick={() => handleTempleClick(temple.id)}
                >
                  <div className="w-24 h-24 bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <h4 className="font-medium mb-1">{temple.name}</h4>
                    <p className="text-gray-500 text-xs">{temple.location}</p>
                    {temple.likeCount !== undefined && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{temple.likeCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </PageLayout>
  );
};

export default FindTemple;