
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { regionTags } from '/public/data/templeData/templeRepository';
import { regionSearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';
import TempleItem from '@/components/search/TempleItem';
import { temples } from '/public/data/templeData/templeRepository';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  
  // Properly type the data using the typedData utility
  const typedRegionTags = typedData<typeof regionTags>(regionTags);
  const typedSearchRankings = typedData<SearchRanking[]>(regionSearchRankings);
  
  // Get popular temples (assuming first 4 are popular)
  const popularTemples = Object.values(temples).slice(0, 4);
  const typedPopularTemples = typedData(popularTemples);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
    // Update UI with filtered temples, but don't navigate
  };

  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  const handleViewMoreClick = (section: string) => {
    navigate(`/search/temple/results?section=${section}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center border-b border-[#E5E5EC]">
        <button onClick={() => navigate('/search')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
        <button onClick={() => navigate('/main')}>
          <Home className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 py-4">
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <Input
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder="도시, 지역, 지하철역"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </form>

        {/* 가까운 사찰 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold">가까운 사찰</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => handleViewMoreClick('nearby')}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {typedPopularTemples.slice(0, 2).map((temple) => (
              <div 
                key={temple.id} 
                className="bg-gray-200 rounded-lg p-2 h-[120px] cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <div className="text-sm font-medium mt-auto">
                  <p className="text-xs text-gray-600">{temple.location} · {temple.direction || '도보 10분'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 많이 찾는 사찰 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold">많이 찾는 사찰</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => handleViewMoreClick('popular')}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 mb-3 scrollbar-hide">
            {typedRegionTags.map((tag) => (
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

          <div className="grid grid-cols-2 gap-4">
            {typedPopularTemples.slice(0, 4).map((temple) => (
              <div 
                key={temple.id} 
                className="bg-gray-200 rounded-lg p-2 h-[120px] relative cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                {temple.rating && (
                  <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded flex items-center">
                    <span>★ {temple.rating}</span>
                  </div>
                )}
                <div className="mt-auto">
                  <p className="text-xs text-gray-700">{temple.location} {temple.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTemple;
