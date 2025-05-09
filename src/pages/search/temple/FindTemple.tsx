import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowRight, Heart } from 'lucide-react';
import { getTempleRegions, getTopLikedTemples, isTempleFollowed, toggleTempleFollow } from '@/lib/repository';
import { Temple } from '@/types';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { addressToCoords } from '@/utils/geocodeUtils';
import {getCurrentLocation} from '@/utils/locationUtils';

const FindTemple = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [topTemples, setTopTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [likedTemples, setLikedTemples] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 인기 사찰 데이터 가져오기 (repository에 해당 함수 필요)
        const data = await getTopLikedTemples();
        setTopTemples(data);
        
        // 사용자가 로그인한 경우 좋아요 상태 확인
        if (user) {
          const likedStatus: Record<string, boolean> = {};
          for (const temple of data) {
            likedStatus[temple.id] = await isTempleFollowed(user.id, temple.id);
          }
          setLikedTemples(likedStatus);
        }
      } catch (error) {
        console.error("Error fetching top temples:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        // 지역 목록 가져오기 (repository에 해당 함수 필요)
        const locations = await getTempleRegions();
        setLocationList(locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchData();
    fetchLocations();
  }, [user]);

  // 주변 검색 핸들러
  const handleNearbySearch = async () => {
    try {
      // 현재 위치 가져오기
      const userLocation = await getCurrentLocation();
      
      // 주변 검색 결과 페이지로 이동
      navigate(`/search/temple/results?nearby=true&lat=${userLocation.latitude}&lng=${userLocation.longitude}`);
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('위치 정보를 가져오는데 실패했습니다.');
    }
  };
  
  // 주소 검색 핸들러
  const handleAddressSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!searchValue.trim()) {
      toast.error('검색어를 입력해주세요.');
      return;
    }
    
    // 일반 검색어인지 주소인지 확인
    if (searchValue.includes('로') || searchValue.includes('길') || searchValue.includes('동') || searchValue.includes('구')) {
      try {
        // 주소를 좌표로 변환
        const coords = await addressToCoords(searchValue);
        
        if (coords) {
          // 좌표 기반 검색 결과 페이지로 이동
          navigate(`/search/temple/results?nearby=true&address=${encodeURIComponent(searchValue)}&lat=${coords.latitude}&lng=${coords.longitude}`);
        } else {
          // 좌표 변환 실패 시 일반 검색으로 진행
          navigate(`/search/temple/results?query=${searchValue}`);
        }
      } catch (error) {
        console.error('Error in address search:', error);
        navigate(`/search/temple/results?query=${searchValue}`);
      }
    } else {
      // 일반 검색어로 검색
      navigate(`/search/temple/results?query=${searchValue}`);
    }
  };

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
      setTopTemples(prev => 
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
    <PageLayout title="사찰 찾기">
      <div className="p-4">
        {/* 탭 버튼 추가 */}
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

        <div className="relative mb-6">
          <form onSubmit={handleAddressSearch} className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="사찰명, 지역 또는 주소로 검색"
              className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </form>
          
          {/* 주변 검색 버튼 */}
          <button
            onClick={handleNearbySearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#DE7834] text-white px-3 py-1 rounded-full text-sm"
          >
            주변 검색
          </button>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">지역별 사찰</h3>
          {locationsLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {locationList.map(location => (
                <button
                  key={location}
                  onClick={() => handleRegionClick(location)}
                  className="py-2 px-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">인기 사찰</h3>
            <button 
              onClick={() => navigate('/search/temple/results?sort=popular')}
              className="text-[#DE7834] flex items-center text-sm"
            >
              더보기 <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {topTemples.map(temple => (
                <div 
                  key={temple.id}
                  className="cursor-pointer relative"
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                >
                  <div className="aspect-[4/3] mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={temple.imageUrl || temple.image_url || '/placeholder-temple.jpg'} 
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{temple.name}</h4>
                      <p className="text-xs text-gray-500">{temple.region || temple.address}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart 
                        className={`w-5 h-5 ${likedTemples[temple.id] ? 'fill-[#ff7730] stroke-[#ff7730]' : 'stroke-gray-600'}`}
                        onClick={(e) => handleLikeToggle(e, temple.id)}
                      />
                      <span className="text-xs mt-1">{temple.follower_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FindTemple;