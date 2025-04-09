
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Home, Calendar, Users } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import TempleStayItem from '@/components/search/TempleStayItem';
import { allTempleStays } from '../../../data/dataRepository';

type SortOption = '추천순' | '최신순';

const TempleStaySearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-15~2025-04-16");
  const [selectedGuests, setSelectedGuests] = useState<string>("성인 1명");

  // Filter results based on search query
  const filteredTempleStays = allTempleStays.filter(templeStay => 
    templeStay.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    templeStay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (templeStay.description && templeStay.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    templeStay.temple.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    window.scrollTo(0, 0);
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
              className="pl-9 bg-[#F5F5F5] border-0 focus-visible:ring-0 rounded-lg"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Date and Guest Selection */}
        <div className="flex border-b border-[#E5E5EC]">
          <button className="flex items-center justify-between flex-1 px-4 py-3 border-r border-[#E5E5EC]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedDate}</span>
            </div>
          </button>
          <button className="flex items-center justify-between flex-1 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedGuests}</span>
            </div>
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex px-4 py-3 gap-2 border-b border-[#E5E5EC]">
          {(['추천순', '최신순'] as SortOption[]).map((option) => (
            <button
              key={option}
              className={`px-4 py-1 rounded-full text-xs font-bold ${
                sortBy === option 
                  ? 'bg-[#FF8433] text-white' 
                  : 'bg-white text-black border border-gray-300'
              }`}
              onClick={() => setSortBy(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="px-4">
          {filteredTempleStays.length > 0 ? (
            filteredTempleStays.map((templeStay) => (
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
