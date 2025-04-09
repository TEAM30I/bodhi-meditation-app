import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTempleStayList, locations } from '@/data/templeStayData';
import DateRangePicker from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';
import BottomNav from '@/components/BottomNav';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('서울');
  
  // Default values for date and guests
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfterTomorrow);
  const [guests, setGuests] = useState(2);
  
  // Get all temple stays
  const allTempleStays = getTempleStayList();
  
  // Display nearby temple stays - using the first few for demo
  const nearbyTempleStaysDisplay = allTempleStays.slice(0, 4);
  
  // Popular temple stays - sort by likeCount
  const popularTempleStays = [...allTempleStays]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 4);
  
  const handleLocationClick = (locationName: string) => {
    setSelectedLocation(locationName);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search/temple-stay/results?query=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTempleStayClick = (templeStayId: string) => {
    navigate(`/search/temple-stay/detail/${templeStayId}`);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-20">
      <div className="w-full max-w-[480px] mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center h-[56px] px-5 border-b border-gray-100">
          <button 
            onClick={() => navigate('/search')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
        </div>
        
        {/* Search Input */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-10 bg-[#F5F5F5] border border-[#2196F3] focus-visible:ring-0 rounded-lg"
              placeholder="사찰명, 지역명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Date and Guests */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <GuestSelector guests={guests} setGuests={setGuests} />
          </div>
          <Button className="w-full">
            날짜와 인원 적용
          </Button>
        </div>
        
        {/* Nearby Temple Stays */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">가까운 템플스테이</h2>
            <button 
              onClick={() => navigate('/search/temple-stay/results?query=nearby')}
              className="text-sm text-gray-500"
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {nearbyTempleStaysDisplay.map(templeStay => (
              <div 
                key={templeStay.id} 
                className="cursor-pointer"
                onClick={() => handleTempleStayClick(templeStay.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={templeStay.imageUrl}
                    alt={templeStay.templeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm mt-2">{templeStay.templeName}</h3>
                <p className="text-xs text-gray-500">{templeStay.location}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Location Filters */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">지역별 템플스테이</h2>
            <button 
              onClick={() => navigate('/search/temple-stay/results')}
              className="text-sm text-gray-500"
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-3 gap-2 mb-4">
            {locations.map(location => (
              <Badge 
                key={location.name}
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto cursor-pointer whitespace-nowrap
                  ${location.name === selectedLocation ? 'bg-[#FF8433] text-white border-[#FF8433]' : 'bg-white text-black border-gray-300'}`}
                onClick={() => handleLocationClick(location.name)}
              >
                {location.name}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {popularTempleStays.map(templeStay => (
              <div 
                key={templeStay.id} 
                className="cursor-pointer"
                onClick={() => handleTempleStayClick(templeStay.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={templeStay.imageUrl}
                    alt={templeStay.templeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm mt-2">{templeStay.templeName}</h3>
                <p className="text-xs text-gray-500">{templeStay.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default FindTempleStay;
