
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, Heart, MapPin, Calendar, Users, Filter, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector, GuestCount } from '@/components/search/GuestSelector';
import { templeStaySearchRankings } from '/public/data/searchRankingRepository';
import { locations, templeStays, getTopLikedTempleStays } from '/public/data/templeStayData/templeStayRepository';
import { castRepository } from '@/utils/typeAssertions';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState('서울');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState<GuestCount>({ adults: 1, children: 0 });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  
  const topTempleStays = getTopLikedTempleStays();

  const handleSearch = () => {
    navigate('/search/temple-stay/results?query=');
  };

  const handleLocationClick = (locationName: string) => {
    setActiveLocation(locationName);
  };

  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/detail/${id}`);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">템플스테이</h1>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-4 bg-white">
        <div 
          className="bg-[#F5F5F5] rounded-full p-4 flex items-center"
          onClick={() => navigate('/search/temple-stay/results?query=')}
        >
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-500">도시, 지역, 지명으로...</span>
        </div>

        <div className="flex mt-4 gap-2">
          <button 
            className="flex-1 bg-[#F5F5F5] rounded-lg p-3 flex items-center justify-between"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm">날짜 선택</span>
            </div>
          </button>
          
          <button 
            className="flex-1 bg-[#F5F5F5] rounded-lg p-3 flex items-center justify-between"
            onClick={() => setShowGuestSelector(!showGuestSelector)}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm">인원 선택</span>
            </div>
          </button>
        </div>
      </div>

      {showDatePicker && (
        <DateRangePicker 
          dateRange={dateRange} 
          onChange={setDateRange}
        />
      )}

      {showGuestSelector && (
        <GuestSelector 
          value={guests} 
          onChange={setGuests}
        />
      )}

      <div className="max-w-[480px] mx-auto px-5 py-4 mt-2 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">최신 템플스테이</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/search/temple-stay/results?query=')}
            className="text-[#DE7834]"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="whitespace-nowrap pb-4">
          <div className="flex space-x-2">
            {locations.map((location) => (
              <button 
                key={location.name}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  activeLocation === location.name 
                  ? 'bg-[#DE7834] text-white' 
                  : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => handleLocationClick(location.name)}
              >
                {location.name}
              </button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {topTempleStays.slice(0, 4).map((templeStay) => (
            <div 
              key={templeStay.id}
              className="rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => handleTempleStayClick(templeStay.id)}
            >
              <div className="h-36 relative">
                <img 
                  src={templeStay.imageUrl} 
                  alt={templeStay.templeName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Heart className="w-3 h-3 mr-1 text-white" />
                  <span>{templeStay.likeCount}</span>
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{templeStay.templeName}</h3>
                <p className="text-xs text-gray-500 truncate">{templeStay.location}</p>
                <p className="text-xs font-medium mt-1">{templeStay.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-4 mt-2 bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">많이 찾는 템플스테이</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/search/temple-stay/results?query=')}
            className="text-[#DE7834]"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {topTempleStays.slice(0, 4).map((templeStay) => (
            <div 
              key={templeStay.id}
              className="rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => handleTempleStayClick(templeStay.id)}
            >
              <div className="h-36 relative">
                <img 
                  src={templeStay.imageUrl} 
                  alt={templeStay.templeName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Heart className="w-3 h-3 mr-1 text-white" />
                  <span>{templeStay.likeCount}</span>
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{templeStay.templeName}</h3>
                <p className="text-xs text-gray-500 truncate">{templeStay.location}</p>
                <p className="text-xs font-medium mt-1">{templeStay.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
