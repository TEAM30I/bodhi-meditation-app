
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { regionSearchRankings, templeStaySearchRankings } from '/public/data/searchRankingRepository';

const SearchHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'temple-stay' | 'temple'>('temple');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${searchValue}`);
    } else {
      navigate(`/search/temple-stay/results?query=${searchValue}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTabChange = (tab: 'temple-stay' | 'temple') => {
    setActiveTab(tab);
  };

  const handleNearbySearch = () => {
    navigate('/search/temple/results?nearby=true');
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-bold">검색</h1>
        </div>
        
        <div className="flex border-b border-[#E5E5EC]">
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'temple-stay' ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-600'}`}
            onClick={() => handleTabChange('temple-stay')}
          >
            템플스테이
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'temple' ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-600'}`}
            onClick={() => handleTabChange('temple')}
          >
            사찰
          </button>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={activeTab === 'temple' ? "도시, 지역, 사찰명" : "도시, 지역, 지하철역"}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-gray-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {activeTab === 'temple-stay' && (
            <div className="flex gap-3 mt-3">
              <div className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">날짜 선택</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-3 border border-gray-200">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">인원 선택</span>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Search Button */}
        <button 
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#DE7834] mb-6"
          onClick={handleNearbySearch}
        >
          <MapPin className="h-4 w-4 text-[#DE7834]" />
          <span className="text-sm text-[#DE7834] font-medium">내 주변에서 검색</span>
        </button>

        {/* Popular Searches */}
        <div>
          <h2 className="text-base font-bold mb-4">
            {activeTab === 'temple' ? '많이 둘러본 사찰' : '많이 찾는 지역'}
          </h2>
          <div className="grid grid-cols-2 gap-y-3">
            {(activeTab === 'temple' ? regionSearchRankings : templeStaySearchRankings).slice(0, 8).map((item, index) => (
              <div key={item.id} className="flex items-center">
                <span className="text-[#DE7834] font-bold w-6">{index + 1}</span>
                <span 
                  className="text-gray-800 cursor-pointer hover:underline"
                  onClick={() => {
                    setSearchValue(item.term);
                    handleSearch();
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

export default SearchHome;
