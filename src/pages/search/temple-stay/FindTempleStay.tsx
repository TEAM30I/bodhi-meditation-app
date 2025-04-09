
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';
import { locations } from '@/data/dataRepository';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('전국');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to tomorrow
  });
  const [guests, setGuests] = useState(2); // Default 2 guests
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  
  // Set default values for date range - tomorrow to day after tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    setDateRange({
      from: tomorrow,
      to: dayAfterTomorrow
    });
  }, []);

  const handleSearch = () => {
    navigate('/search/temple-stay/results', {
      state: {
        location: selectedLocation,
        dateRange,
        guests
      }
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-8 pb-6 px-6 bg-white">
        <h1 className="text-2xl font-bold mb-1">템플 스테이 찾기</h1>
        <p className="text-gray-500">전국 사찰의 체험 프로그램을 만나보세요</p>
      </div>

      {/* Search Form */}
      <div className="px-6">
        {/* Location Selector */}
        <div className="mb-4 relative">
          <div 
            className="flex items-center p-4 border rounded-lg shadow-sm"
            onClick={() => setShowLocationSelector(!showLocationSelector)}
          >
            <MapPin className="text-gray-400 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-500">위치</p>
              <p className="font-medium">{selectedLocation}</p>
            </div>
          </div>
          
          {/* Location Dropdown */}
          {showLocationSelector && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg z-10">
              {locations.map((location) => (
                <div 
                  key={location}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedLocation(location);
                    setShowLocationSelector(false);
                  }}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="mb-4">
          <div 
            className="p-4 border rounded-lg shadow-sm"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <p className="text-sm text-gray-500">날짜</p>
            <p className="font-medium">
              {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
            </p>
          </div>
          
          {showCalendar && (
            <div className="mt-2 border rounded-lg shadow-lg">
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
                onClose={() => setShowCalendar(false)}
              />
            </div>
          )}
        </div>

        {/* Guest Selector */}
        <div className="mb-6">
          <div 
            className="p-4 border rounded-lg shadow-sm"
            onClick={() => setShowGuestSelector(!showGuestSelector)}
          >
            <p className="text-sm text-gray-500">인원</p>
            <p className="font-medium">{guests}명</p>
          </div>
          
          {showGuestSelector && (
            <div className="mt-2 border rounded-lg shadow-lg p-4">
              <GuestSelector 
                value={guests}
                onChange={setGuests}
                onClose={() => setShowGuestSelector(false)}
              />
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-lg text-lg font-medium"
          onClick={handleSearch}
        >
          <Search className="mr-2" size={20} />
          검색하기
        </Button>
      </div>
      
      {/* Popular Destinations */}
      <div className="mt-10 px-6">
        <h2 className="text-xl font-bold mb-4">인기 템플스테이 목적지</h2>
        <div className="grid grid-cols-2 gap-3">
          {locations.slice(0, 4).map((location) => (
            <div 
              key={location}
              className="bg-gray-100 rounded-lg p-4 cursor-pointer"
              onClick={() => {
                setSelectedLocation(location);
                handleSearch();
              }}
            >
              <p className="font-medium">{location}</p>
              <p className="text-sm text-gray-500">10+ 프로그램</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
