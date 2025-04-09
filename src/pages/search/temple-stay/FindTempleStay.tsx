
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, Users, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { locations, templeStays, TempleStay } from '/public/data/templeStayData/templeStayRepository';
import { templeStaySearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');
  const [guestCount, setGuestCount] = useState(1);
  
  // Set default dates to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: tomorrow, 
    to: dayAfterTomorrow 
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  
  // Properly type the data using the typedData utility
  const typedLocations = typedData<typeof locations>(locations);
  const typedSearchRankings = typedData<SearchRanking[]>(templeStaySearchRankings);
  
  // Get templestay data with proper typing
  const templeStayArray = typedData<TempleStay[]>(Object.values(templeStays));
  const [filteredTempleStays, setFilteredTempleStays] = useState<TempleStay[]>(templeStayArray);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    let queryParams = `query=${searchValue}`;
    
    if (dateRange.from) {
      queryParams += `&from=${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })}`;
    }
    
    if (dateRange.to) {
      queryParams += `&to=${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    
    queryParams += `&guests=${guestCount}`;
    
    navigate(`/search/temple-stay/results?${queryParams}`);
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
    // Filter temples by region without navigating
    const filtered = templeStayArray.filter(temple => 
      temple.location.includes(region)
    );
    setFilteredTempleStays(filtered.length ? filtered : templeStayArray);
  };

  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/detail/${id}`);
  };

  const handleViewMoreClick = (section: string) => {
    navigate(`/search/temple-stay/results?section=${section}`);
  };

  const handleDateSelection = () => {
    setShowDatePicker(!showDatePicker);
    setShowGuestSelector(false);
  };

  const handleGuestSelection = () => {
    setShowGuestSelector(!showGuestSelector);
    setShowDatePicker(false);
  };

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
    setShowGuestSelector(false);
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })} - ${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    return '날짜 선택';
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      setShowDatePicker(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center border-b border-[#E5E5EC]">
        <button onClick={() => navigate('/main')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
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
              <span className="text-sm text-gray-700">{formatDateRange()}</span>
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-300"
              onClick={handleGuestSelection}
            >
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">성인 {guestCount}명</span>
            </button>
          </div>

          {showDatePicker && (
            <DateRangePicker 
              dateRange={dateRange} 
              onChange={handleDateRangeChange} 
            />
          )}

          {showGuestSelector && (
            <div className="mt-3">
              <GuestSelector 
                value={guestCount} 
                onChange={handleGuestCountChange} 
              />
            </div>
          )}

          <Button 
            className="w-full mt-4 bg-[#DE7834] hover:bg-[#C56A2D]"
            onClick={handleSearch}
          >
            검색하기
          </Button>
        </div>

        <Button 
          className="flex items-center gap-2 rounded-full px-4 py-2 border border-[#DE7834] bg-white mb-6"
          onClick={() => navigate('/search/temple-stay/results?nearby=true')}
        >
          <MapPin className="h-4 w-4 text-[#DE7834]" />
          <span className="text-sm text-[#DE7834] font-medium">내 주변에서 검색</span>
        </Button>

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
            {filteredTempleStays.slice(0, 2).map((templestay) => (
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
            {filteredTempleStays.slice(0, 4).map((templestay) => (
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
