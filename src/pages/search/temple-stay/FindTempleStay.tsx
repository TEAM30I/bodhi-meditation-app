
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Users, ChevronRight, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { locations, templeStays } from '/public/data/templeStayData/templeStayRepository';
import { templeStaySearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  
  // Properly type the data using the typedData utility
  const typedLocations = typedData<typeof locations>(locations);
  const typedSearchRankings = typedData<SearchRanking[]>(templeStaySearchRankings);
  
  // Get templestay data
  const allTempleStays = Object.values(templeStays);
  const typedTempleStays = typedData(allTempleStays);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
    navigate(`/search/temple-stay/results?region=${region}`);
  };

  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/detail/${id}`);
  };

  const handleViewMoreClick = (section: string) => {
    navigate(`/search/temple-stay/results?section=${section}`);
  };

  const handleDateSelection = () => {
    // This would open a date picker in a real app
    console.log('Opening date selection');
  };

  const handleGuestSelection = () => {
    // This would open a guest selector in a real app
    console.log('Opening guest selection');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center border-b border-[#E5E5EC]">
        <button onClick={() => navigate('/search')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
        <button onClick={() => navigate('/main')}>
          <Home className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="도시, 지역, 지하철역"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </form>
          
          <div className="flex mt-3 gap-3">
            <button 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-300"
              onClick={handleDateSelection}
            >
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">날짜 선택</span>
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-300"
              onClick={handleGuestSelection}
            >
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">인원 선택</span>
            </button>
          </div>
        </div>

        {/* 최신 템플스테이 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold">최신 템플스테이</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => handleViewMoreClick('latest')}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 mb-3 scrollbar-hide">
            {typedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleRegionClick(location.name)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeRegion === location.name 
                    ? 'bg-[#DE7834] text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {typedTempleStays.slice(0, 2).map((templestay) => (
              <div 
                key={templestay.id} 
                className="bg-gray-200 rounded-lg p-2 h-[120px] relative cursor-pointer"
                onClick={() => handleTempleStayClick(templestay.id)}
              >
                {templestay.likeCount && (
                  <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded flex items-center">
                    <span>★ 4.5</span>
                  </div>
                )}
                <div className="mt-auto">
                  <p className="text-xs text-gray-700">{templestay.location} {templestay.templeName}</p>
                  <p className="text-xs font-medium">{templestay.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 많이 찾는 템플스테이 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold">많이 찾는 템플스테이</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => handleViewMoreClick('popular')}
            >
              더보기 <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 mb-3 scrollbar-hide">
            {typedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleRegionClick(location.name)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeRegion === location.name 
                    ? 'bg-[#DE7834] text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {typedTempleStays.slice(2, 6).map((templestay) => (
              <div 
                key={templestay.id} 
                className="bg-gray-200 rounded-lg p-2 h-[120px] relative cursor-pointer"
                onClick={() => handleTempleStayClick(templestay.id)}
              >
                {templestay.likeCount && (
                  <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded flex items-center">
                    <span>★ 4.5</span>
                  </div>
                )}
                <div className="mt-auto">
                  <p className="text-xs text-gray-700">{templestay.location} {templestay.templeName}</p>
                  <p className="text-xs font-medium">{templestay.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
