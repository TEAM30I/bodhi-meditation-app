
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  getRegionTags,
  getTempleList, 
  getTopLikedTemples, 
  getNearbyTemples,
  filterTemplesByTag,
  Temple
} from '@/utils/repository';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';
import { toast } from 'sonner';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  const [regionTagsList, setRegionTagsList] = useState<{id: string, name: string, active: boolean}[]>([]);
  
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
          // 기본 위치 설정 (서울)
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      toast.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
      // 기본 위치 설정 (서울)
      setUserLocation({ lat: 37.5665, lng: 126.9780 });
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

  const handleViewMoreClick = (section: string) => {
    navigate(`/search/temple/results?section=${section}`);
  };

  // 로딩 상태 표시
  if (loading.temples && loading.nearby && loading.popular) {
    return (
      <PageLayout>
        <div className="w-full min-h-screen bg-[#F8F8F8] flex items-center justify-center">
          <p>데이터를 로딩 중입니다...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
        <div className="w-full bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3 max-w-[480px] mx-auto">
            <button 
              onClick={() => navigate('/')}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1 mx-2">
              <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[480px] mx-auto pb-20">
          <div className="px-6 py-4">
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <Input
                value={searchValue}
                onChange={handleSearchInputChange}
                placeholder="도시, 지역, 지하철역"
                className="w-full pl-10 pr-4 py-2 bg-[#E5E9ED] bg-opacity-87 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>

            {/* 지역 필터 태그 */}
            <div className="mb-6">
              {loading.regions ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
                </div>
              ) : (
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                  {regionTagsList.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleRegionClick(tag.name)}
                      className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                        activeRegion === tag.name 
                          ? 'bg-[#DE7834] text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 가까운 사찰 섹션 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">가까운 사찰</h2>
                <button 
                  className="text-sm text-gray-500 flex items-center"
                  onClick={() => handleViewMoreClick('nearby')}
                >
                  더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(!loading.nearby && nearbyTemples.length > 0 ? nearbyTemples : filteredTemples).slice(0, 2).map((temple) => (
                  <div 
                    key={temple.id} 
                    className="bg-white rounded-lg p-3 h-[120px] cursor-pointer border border-gray-200 shadow-sm"
                    onClick={() => handleTempleClick(temple.id)}
                  >
                    {temple.distance && (
                      <div className="text-xs text-[#DE7834] mb-1">
                        {temple.distance} 거리
                      </div>
                    )}
                    <div className="text-sm font-medium mt-auto">
                      <p className="text-sm font-semibold">{temple.name}</p>
                      <p className="text-xs text-gray-600">{temple.location} · {temple.direction || '도보 10분'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 많이 찾는 사찰 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">많이 찾는 사찰</h2>
                <button 
                  className="text-sm text-gray-500 flex items-center"
                  onClick={() => handleViewMoreClick('popular')}
                >
                  더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(!loading.popular && popularTemples.length > 0 ? popularTemples : filteredTemples).slice(0, 4).map((temple) => (
                  <div 
                    key={temple.id} 
                    className="bg-white rounded-lg p-3 h-[120px] cursor-pointer border border-gray-200 shadow-sm"
                    onClick={() => handleTempleClick(temple.id)}
                  >
                    {temple.likeCount !== undefined && temple.likeCount > 0 && (
                      <div className="text-xs text-amber-500 mb-1 flex items-center">
                        <Heart className="w-3 h-3 mr-1 fill-amber-500" />
                        <span>{temple.likeCount}</span>
                      </div>
                    )}
                    <div className="text-sm font-medium mt-auto">
                      <p className="text-sm font-semibold">{temple.name}</p>
                      <p className="text-xs text-gray-600">{temple.location} · {temple.direction || '도보 10분'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageLayout>
  );
};

export default FindTemple;
