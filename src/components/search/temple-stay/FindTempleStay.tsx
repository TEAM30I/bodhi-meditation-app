
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getTempleStaySearchRankings,
  getLocations,
  getTopLikedTempleStays,
  filterTempleStaysByTag,
  getTempleStaysByRegion,
  TempleStay,
  SearchRanking
} from '@/utils/repository';
import { Search, ChevronRight, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TempleStayItem from '@/components/search/TempleStayItem';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchRankings, setSearchRankings] = useState<SearchRanking[]>([]);
  const [locations, setLocations] = useState<{ name: string; active: boolean }[]>([]);
  const [popularTempleStays, setPopularTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rankingsData, locationsData, popularData] = await Promise.all([
          getTempleStaySearchRankings(),
          getLocations(),
          getTopLikedTempleStays(5)
        ]);
        
        setSearchRankings(rankingsData);
        setLocations([{ name: '전체', active: true }, ...locationsData.map(loc => ({ ...loc, active: false }))]);
        setPopularTempleStays(popularData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/search/temple-stay/results?query=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationClick = async (locationName: string) => {
    setLocations(prev => 
      prev.map(loc => ({
        ...loc,
        active: loc.name === locationName
      }))
    );
    
    try {
      setLoading(true);
      const selectedLocation = locationName === '전체' ? '' : locationName;
      const filteredStays = await getTempleStaysByRegion(selectedLocation);
      setPopularTempleStays(filteredStays.slice(0, 5));
    } catch (error) {
      console.error('Error filtering by location:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3 text-red-500" />;
      case 'down':
        return <ArrowDown className="w-3 h-3 text-blue-500" />;
      case 'new':
        return <Sparkles className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      <div className="bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center bg-[#F8F8F8] rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="템플스테이를 검색해보세요"
            className="bg-transparent w-full outline-none text-sm"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* 실시간 인기 검색어 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">실시간 인기 검색어</h2>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} 기준
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {searchRankings.slice(0, 6).map((ranking, index) => (
            <div 
              key={ranking.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                setSearchKeyword(ranking.term);
                navigate(`/search/temple-stay/results?query=${encodeURIComponent(ranking.term)}`);
              }}
            >
              <span className="w-5 text-gray-500">{index + 1}</span>
              <span className="flex-1 truncate">{ranking.term}</span>
              {renderTrendIcon(ranking.trend)}
            </div>
          ))}
        </div>
      </div>
      
      {/* 지역별 필터링 */}
      <div className="px-6 py-2">
        <div className="flex items-center mb-3">
          <h2 className="text-lg font-bold">지역별 템플스테이</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {locations.map((location, index) => (
            <Badge 
              key={index}
              variant={location.active ? "default" : "outline"}
              className={`cursor-pointer rounded-full ${location.active ? 'bg-[#DE7834]' : ''}`}
              onClick={() => handleLocationClick(location.name)}
            >
              {location.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* 인기 템플스테이 */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">인기 템플스테이</h2>
          <Button 
            variant="ghost" 
            className="text-gray-500 p-0 h-auto"
            onClick={() => navigate('/search/temple-stay/results')}
          >
            <span className="text-sm">전체보기</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
            </div>
          ) : popularTempleStays.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              해당 조건에 맞는 템플스테이가 없습니다.
            </div>
          ) : (
            popularTempleStays.map((templeStay) => (
              <TempleStayItem
                key={templeStay.id}
                templeStay={templeStay}
                onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
