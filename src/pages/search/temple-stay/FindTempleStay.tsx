import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowRight, Heart } from 'lucide-react';
import { getTempleStayRegions, getTopLikedTempleStays, isTempleStayFollowed, toggleTempleStayFollow } from '@/lib/repository';
import { TempleStay } from '@/types';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [topTempleStays, setTopTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [likedTempleStays, setLikedTempleStays] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTopLikedTempleStays();
        setTopTempleStays(data);
        
        // 사용자가 로그인한 경우 좋아요 상태 확인
        if (user) {
          const likedStatus: Record<string, boolean> = {};
          for (const templeStay of data) {
            likedStatus[templeStay.id] = await isTempleStayFollowed(user.id, templeStay.id);
          }
          setLikedTempleStays(likedStatus);
        }
      } catch (error) {
        console.error('Error loading top temple stays:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        const locations = await getTempleStayRegions();
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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    navigate(`/search/temple-stay/results?query=${region}&isRegion=true`);
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
      setTopTempleStays(prev => 
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

  return (
    <PageLayout title="템플스테이 찾기">
      <div className="p-4">
        {/* 탭 버튼 추가 */}
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

        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">지역별 템플스테이</h3>
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
            <h3 className="font-semibold text-lg">인기 템플스테이</h3>
            <button 
              onClick={() => navigate('/search/temple-stay/results?sort=popular')}
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
              {topTempleStays.map(templestay => (
                <div 
                  key={templestay.id}
                  className="cursor-pointer relative"
                  onClick={() => navigate(`/search/temple-stay/detail/${templestay.id}`)}
                >
                  <div className="aspect-[4/3] mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={templestay.imageUrl} 
                      alt={templestay.templeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{templestay.templeName}</h4>
                      <p className="text-xs text-gray-500">{templestay.location}</p>
                      <p className="text-sm font-semibold mt-1">{templestay.price.toLocaleString()}원</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart 
                        className={`w-5 h-5 ${likedTempleStays[templestay.id] ? 'fill-[#ff7730] stroke-[#ff7730]' : 'stroke-gray-600'}`}
                        onClick={(e) => handleLikeToggle(e, templestay.id)}
                      />
                      <span className="text-xs mt-1">{templestay.likeCount || 0}</span>
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

export default FindTempleStay;
