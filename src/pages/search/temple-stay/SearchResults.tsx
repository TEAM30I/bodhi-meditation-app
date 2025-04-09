
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Home, Calendar, Users } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import { DateRange } from "react-day-picker";
import TempleStayItem from '@/components/search/TempleStayItem';
import { allTempleStays } from '@/data/dataRepository';
import { DateRangePicker } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';

type SortOption = '추천순' | '거리순' | '가격낮은순' | '가격높은순';

const TempleStaySearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 3, 15),
    to: new Date(2025, 3, 16),
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Filter results based on search query
  const filteredTempleStays = allTempleStays.filter(templeStay => 
    templeStay.name.includes(searchQuery) || 
    templeStay.location.includes(searchQuery) ||
    (templeStay.description && templeStay.description.includes(searchQuery))
  );

  // Sort results based on selected option
  const sortedTempleStays = React.useMemo(() => {
    switch (sortBy) {
      case '거리순':
        return [...filteredTempleStays].sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          const distA = parseInt(a.distance.replace(/[^0-9]/g, ''));
          const distB = parseInt(b.distance.replace(/[^0-9]/g, ''));
          return distA - distB;
        });
      case '가격낮은순':
        return [...filteredTempleStays].sort((a, b) => a.price - b.price);
      case '가격높은순':
        return [...filteredTempleStays].sort((a, b) => b.price - a.price);
      case '추천순':
      default:
        return filteredTempleStays;
    }
  }, [filteredTempleStays, sortBy]);

  const handleSearch = () => {
    navigate(`/search/temple-stay/results?query=${searchQuery}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

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
            sortedTempleStays.map((templeStay) => (
              <TempleStayItem key={templeStay.id} templeStay={templeStay} />
            ))
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
