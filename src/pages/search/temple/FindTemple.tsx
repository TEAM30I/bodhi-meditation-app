
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { regionTags } from '/public/data/templeData/templeRepository';
import { regionSearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  
  // Properly type the data using the typedData utility
  const typedRegionTags = typedData<typeof regionTags>(regionTags);
  const typedSearchRankings = typedData<SearchRanking[]>(regionSearchRankings);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleNearbySearch = () => {
    navigate('/search/temple/results?nearby=true');
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleRegionClick = (region: string) => {
    navigate(`/search/temple/results?region=${region}`);
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate('/search')}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-bold">사찰 찾기</h1>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="도시, 지역, 사찰명"
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-white border-gray-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchValue && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </form>
          
          <button 
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#DE7834] mt-4"
            onClick={handleNearbySearch}
          >
            <MapPin className="h-4 w-4 text-[#DE7834]" />
            <span className="text-sm text-[#DE7834] font-medium">내 주변에서 검색</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold mb-3">지역</h2>
          <div className="flex flex-wrap gap-2">
            {typedRegionTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleRegionClick(tag.name)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  tag.active 
                    ? 'bg-[#DE7834] text-white' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold mb-4">많이 찾는 사찰</h2>
          <div className="grid grid-cols-2 gap-y-3">
            {typedSearchRankings.slice(0, 8).map((item, index) => (
              <div key={item.id} className="flex items-center">
                <span className="text-[#DE7834] font-bold w-6">{index + 1}</span>
                <div className="flex items-center">
                  <span 
                    className="text-gray-800 cursor-pointer hover:underline"
                    onClick={() => {
                      navigate(`/search/temple/results?query=${item.term}`);
                    }}
                  >
                    {item.term}
                  </span>
                  {item.trend === 'up' && <span className="text-red-500 text-xs ml-1">▲</span>}
                  {item.trend === 'down' && <span className="text-blue-500 text-xs ml-1">▼</span>}
                  {item.trend === 'new' && <span className="text-green-500 text-xs ml-1">N</span>}
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
