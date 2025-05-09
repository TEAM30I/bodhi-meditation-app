import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { getTempleRegions, getTopLikedTemples } from '@/lib/repository';
import { Temple } from '@/types';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';

const FindTemple = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [topTemples, setTopTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  
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
        const data = await getTopLikedTemples(4);
        setTopTemples(data);
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
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    navigate(`/search/temple/results?region=${region}`);
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
                  className="cursor-pointer"
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                >
                  <div className="aspect-[4/3] mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={temple.imageUrl || temple.image_url || '/placeholder-temple.jpg'} 
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{temple.name}</h4>
                  <p className="text-xs text-gray-500">{temple.region || temple.address}</p>
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