
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { getTempleStayLocations, getTopLikedTempleStays } from '@/utils/repository';
import { TempleStay } from '@/types/templeStay';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [topTempleStays, setTopTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTopLikedTempleStays(4);
        setTopTempleStays(data);
      } catch (error) {
        console.error("Error fetching top temple stays:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        const locations = await getTempleStayLocations();
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
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    navigate(`/search/temple-stay/results?region=${region}`);
  };

  return (
    <PageLayout title="템플스테이 찾기">
      <div className="p-4">
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
                  className="cursor-pointer"
                  onClick={() => navigate(`/search/temple-stay/detail/${templestay.id}`)}
                >
                  <div className="aspect-[4/3] mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={templestay.imageUrl} 
                      alt={templestay.templeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{templestay.templeName}</h4>
                  <p className="text-xs text-gray-500">{templestay.location}</p>
                  <p className="text-sm font-semibold mt-1">{templestay.price.toLocaleString()}원</p>
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

export default FindTempleStay;
