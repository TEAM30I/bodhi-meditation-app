
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { typedData } from '@/utils/typeUtils';

// Update import paths to use relative imports
import { templeStaySearchRankings } from '../../../../public/data/searchRankingRepository';
import { locations } from '../../../../public/data/templeStayData/templeStayRepository';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocation, setActiveLocation] = useState('서울');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guestCount, setGuestCount] = useState(1);
  
  // Use the typedData utility to safely cast repository data
  const typedRankings = typedData<typeof templeStaySearchRankings>(templeStaySearchRankings);
  const typedLocations = typedData<typeof locations>(locations);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchTerm}`);
  };

  const handleLocationClick = (location: string) => {
    setActiveLocation(location);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <div className="sticky top-0 z-10 bg-white px-5 py-3 border-b border-[#E5E5EC]">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold flex-1">템플스테이 찾기</h1>
        </div>
      </div>

      <div className="px-5 pt-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="템플스테이 검색"
            className="w-full pl-10 pr-8 py-3 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </form>

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">인기 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {typedRankings.map((ranking) => (
              <Badge 
                key={ranking.id} 
                variant="outline" 
                className="px-3 py-1 cursor-pointer"
                onClick={() => setSearchTerm(ranking.term)}
              >
                {ranking.term}
                {ranking.trend === 'up' && <span className="ml-1 text-red-500">↑</span>}
                {ranking.trend === 'down' && <span className="ml-1 text-blue-500">↓</span>}
                {ranking.trend === 'new' && <span className="ml-1 text-green-500">N</span>}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">지역</h2>
          <div className="flex flex-wrap gap-2">
            {typedLocations.map((location, index) => (
              <Badge 
                key={index} 
                variant={activeLocation === location.name ? "default" : "outline"}
                className={`px-3 py-1 cursor-pointer ${
                  activeLocation === location.name ? "bg-[#DE7834]" : ""
                }`}
                onClick={() => handleLocationClick(location.name)}
              >
                {location.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">날짜</h2>
          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
            <Calendar className="text-gray-400" />
            <span className="text-gray-600">날짜 선택</span>
          </div>
          <DateRangePicker 
            dateRange={dateRange} 
            onChange={handleDateRangeChange} 
          />
        </div>

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">인원</h2>
          <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
            <Users className="text-gray-400" />
            <span className="text-gray-600">{guestCount}명</span>
          </div>
          <GuestSelector 
            value={guestCount} 
            onChange={handleGuestCountChange} 
          />
        </div>

        <Button className="w-full mt-8 bg-[#DE7834] hover:bg-[#C56A2D]">
          검색하기
        </Button>
      </div>
    </div>
  );
};

export default FindTempleStay;
