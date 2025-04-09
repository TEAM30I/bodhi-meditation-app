
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Calendar, Users, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { locations } from '/public/data/templeStayData/templeStayRepository';
import { templeStaySearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { typedData } from '@/utils/typeUtils';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  
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
  const [guestCount, setGuestCount] = useState(1);

  const typedLocations = typedData(locations);
  const typedSearchRankings = typedData<SearchRanking[]>(templeStaySearchRankings);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const handleNearbySearch = () => {
    navigate('/search/temple-stay/results?nearby=true');
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleRegionClick = (region: string) => {
    navigate(`/search/temple-stay/results?region=${region}`);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      setShowDatePicker(false);
    }
  };

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })} - ${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    return '날짜 선택';
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate('/search')}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-bold">템플스테이 찾기</h1>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="도시, 지역, 지하철역"
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

          <div className="flex gap-3 mt-3">
            <div 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-3 border border-gray-200 cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{formatDateRange()}</span>
            </div>
            <div 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-3 border border-gray-200 cursor-pointer"
              onClick={() => setShowGuestSelector(!showGuestSelector)}
            >
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">성인 {guestCount}명</span>
            </div>
          </div>
          
          {showDatePicker && (
            <div className="mt-2">
              <DateRangePicker 
                dateRange={dateRange} 
                onChange={handleDateRangeChange} 
              />
            </div>
          )}
          
          {showGuestSelector && (
            <div className="mt-2">
              <GuestSelector 
                value={guestCount} 
                onChange={handleGuestCountChange} 
              />
            </div>
          )}
          
          <Button 
            className="w-full mt-4 bg-[#DE7834] hover:bg-[#C56A2D]"
            onClick={handleSearchSubmit}
          >
            검색하기
          </Button>
          
          <button 
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#DE7834] mt-4 w-full justify-center"
            onClick={handleNearbySearch}
          >
            <MapPin className="h-4 w-4 text-[#DE7834]" />
            <span className="text-sm text-[#DE7834] font-medium">내 주변에서 검색</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold mb-3">지역</h2>
          <div className="flex flex-wrap gap-2">
            {typedLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleRegionClick(location.name)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  location.active 
                    ? 'bg-[#DE7834] text-white' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold mb-4">많이 찾는 키워드</h2>
          <div className="grid grid-cols-2 gap-y-3">
            {typedSearchRankings.slice(0, 8).map((item, index) => (
              <div key={item.id} className="flex items-center">
                <span className="text-[#DE7834] font-bold w-6">{index + 1}</span>
                <div className="flex items-center">
                  <span 
                    className="text-gray-800 cursor-pointer hover:underline"
                    onClick={() => {
                      navigate(`/search/temple-stay/results?query=${item.term}`);
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

export default FindTempleStay;
