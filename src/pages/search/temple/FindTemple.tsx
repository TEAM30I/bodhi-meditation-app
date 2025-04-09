
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { temples, regions } from '/public/data/templeData/templeRepository';
import { regionSearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  
  // Type the data correctly
  const typedRegions = typedData<typeof regions>(regions);
  const typedTemples = typedData<typeof temples>(temples);
  const typedSearchRankings = typedData<SearchRanking[]>(regionSearchRankings);
  
  // Filter temples by region
  const filteredTemples = Object.values(typedTemples).filter(temple => 
    temple.region.includes(activeRegion)
  ).slice(0, 3);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
  };

  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  const handleViewMore = () => {
    navigate(`/search/temple/results?region=${activeRegion}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center border-b border-[#E5E5EC]">
        <button onClick={() => navigate('/main')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">사찰 찾기</h1>
      </div>

      <div className="px-5 py-4">
        <div className="mb-6">
          <form className="relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="도시, 지역, 사찰명"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search/temple/results?query=${searchValue}`);
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchValue && (
              <button 
                type="button"
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </form>
          
          <Button 
            className="w-full mt-4 bg-[#DE7834] hover:bg-[#C56A2D]"
            onClick={() => navigate(`/search/temple/results?query=${searchValue}`)}
          >
            검색하기
          </Button>
        </div>

        <Button 
          className="flex items-center gap-2 rounded-full px-4 py-2 border border-[#DE7834] bg-white mb-6"
          onClick={() => navigate('/search/temple/results?nearby=true')}
        >
          <MapPin className="h-4 w-4 text-[#DE7834]" />
          <span className="text-sm text-[#DE7834] font-medium">내 주변에서 검색</span>
        </Button>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold">지역별 사찰</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={handleViewMore}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 mb-3 scrollbar-hide">
            {typedRegions.map((region, index) => (
              <button
                key={index}
                onClick={() => handleRegionClick(region.name)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeRegion === region.name 
                    ? 'bg-[#DE7834] text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTemples.map((temple) => (
              <div 
                key={temple.id} 
                className="bg-white rounded-lg overflow-hidden shadow border border-gray-50 cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900">{temple.name}</h3>
                  <p className="text-sm text-gray-500">{temple.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-base font-bold mb-4">인기 검색어</h2>
          <div className="grid grid-cols-2 gap-y-3">
            {typedSearchRankings.slice(0, 10).map((item, index) => (
              <div key={item.id} className="flex items-center">
                <span className="text-[#DE7834] font-bold w-6">{index + 1}</span>
                <span 
                  className="text-gray-800 cursor-pointer hover:underline"
                  onClick={() => {
                    setSearchValue(item.term);
                    navigate(`/search/temple/results?query=${item.term}`);
                  }}
                >
                  {item.term}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTemple;
