import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { regionTags } from '/public/data/templeData/templeRepository';
import { regionSearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';
import { temples, Temple } from '/public/data/templeData/templeRepository';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  
  // Properly type the data using the typedData utility
  const typedRegionTags = typedData<typeof regionTags>(regionTags);
  const typedSearchRankings = typedData<SearchRanking[]>(regionSearchRankings);
  
  // Get temples and ensure they are properly typed
  const templeArray = typedData<Temple[]>(Object.values(temples));
  const [filteredTemples, setFilteredTemples] = useState<Temple[]>(templeArray);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
    
    // Filter temples by region without navigating
    const filtered = templeArray.filter(temple => 
      temple.location.includes(region)
    );
    setFilteredTemples(filtered.length ? filtered : templeArray);
  };

  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  const handleViewMoreClick = (section: string) => {
    navigate(`/search/temple/results?section=${section}`);
  };

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
                {filteredTemples.slice(0, 2).map((temple) => (
                  <div 
                    key={temple.id} 
                    className="bg-white rounded-lg p-3 h-[120px] cursor-pointer border border-gray-200 shadow-sm"
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
                <h2 className="text-lg font-semibold">많이 찾는 사찰</h2>
                <button 
                  className="text-sm text-gray-500 flex items-center"
                  onClick={() => handleViewMoreClick('popular')}
                >
                  더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {filteredTemples.slice(0, 4).map((temple) => (
                  <div 
                    key={temple.id} 
                    className="bg-white rounded-lg p-3 h-[120px] cursor-pointer border border-gray-200 shadow-sm"
                    onClick={() => handleTempleClick(temple.id)}
                  >
                    <div className="text-sm font-medium mt-auto">
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
