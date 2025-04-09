
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Home, Calendar, Users, Heart } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import { DateRange } from "react-day-picker";
import { getTempleStayList, searchTempleStays } from '@/data/templeStayData';
import { DateRangePicker } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { Button } from '@/components/ui/button';

type SortOption = '추천순' | '거리순' | '가격낮은순' | '가격높은순';

const TempleStaySearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');
  const [templeStays, setTempleStays] = useState(getTempleStayList());
  
  // Set default date range to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: tomorrow,
    to: dayAfterTomorrow,
  });
  
  // Default guest count
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Update search results based on query
  useEffect(() => {
    if (searchQuery === 'nearby') {
      // Just get all temple stays for now - in a real app this would filter by location
      setTempleStays(getTempleStayList());
    } else {
      setTempleStays(searchTempleStays(searchQuery));
    }
  }, [searchQuery]);

  // Sort results based on selected option
  const sortedTempleStays = React.useMemo(() => {
    switch (sortBy) {
      case '거리순':
        return [...templeStays].sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          const distA = parseInt(a.distance.replace(/[^0-9]/g, ''));
          const distB = parseInt(b.distance.replace(/[^0-9]/g, ''));
          return distA - distB;
        });
      case '가격낮은순':
        return [...templeStays].sort((a, b) => a.price - b.price);
      case '가격높은순':
        return [...templeStays].sort((a, b) => b.price - a.price);
      case '추천순':
      default:
        return [...templeStays].sort((a, b) => b.likeCount - a.likeCount);
    }
  }, [templeStays, sortBy]);

  const handleSearch = () => {
    navigate(`/search/temple-stay/results?query=${searchQuery}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-20">
      <div className="w-full max-w-[480px] mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center h-[56px] px-5 border-b border-[#E5E5EC]">
          <button 
            onClick={() => navigate('/search')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center">템플스테이</h1>
          <button 
            onClick={() => navigate('/main')}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="px-4 py-4 border-b border-[#E5E5EC]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-9 bg-[#F5F5F5] border-none focus-visible:ring-0 rounded-full"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Date and Guest Selection */}
        <div className="flex border-b border-[#E5E5EC]">
          <div className="flex-1 px-4 py-3 border-r border-[#E5E5EC]">
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
          <div className="flex-1 px-4 py-3">
            <GuestSelector 
              adults={adults}
              children={children}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="px-4 py-3 border-b border-[#E5E5EC]">
          <Button 
            className="w-full bg-[#FF8433] hover:bg-[#E67422] text-white"
            onClick={handleSearch}
          >
            검색하기
          </Button>
        </div>

        {/* Sort Options */}
        <div className="flex px-4 py-3 gap-2 border-b border-[#E5E5EC] overflow-x-auto">
          {(['추천순', '거리순', '가격낮은순', '가격높은순'] as SortOption[]).map((option) => (
            <Badge 
              key={option}
              variant="outline"
              className={`rounded-full px-4 py-2 cursor-pointer whitespace-nowrap ${
                sortBy === option 
                  ? 'bg-[#FF8433] text-white border-[#FF8433]' 
                  : 'bg-white text-black border-gray-300'
              }`}
              onClick={() => setSortBy(option)}
            >
              {option}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <div className="px-4 py-4">
          {sortedTempleStays.length > 0 ? (
            <div className="space-y-4">
              {sortedTempleStays.map((templeStay) => (
                <div 
                  key={templeStay.id}
                  className="flex bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
                  onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
                >
                  <div className="w-[100px] h-[100px] bg-gray-200">
                    <img 
                      src={templeStay.imageUrl} 
                      alt={templeStay.templeName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3">
                    <h3 className="font-semibold text-base mb-1">{templeStay.templeName} 템플스테이</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{templeStay.location}</span>
                      {templeStay.distance && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">
                          {templeStay.direction || `도보 ${templeStay.distance}`}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <Heart className="w-3 h-3 fill-red-500 stroke-red-500 mr-1" />
                        <span>{templeStay.likeCount}</span>
                      </div>
                      <div className="text-sm font-semibold text-[#FF8433]">
                        {templeStay.price.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">검색 결과가 없습니다</p>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default TempleStaySearchResults;
