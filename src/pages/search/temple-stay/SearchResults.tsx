
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Home } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import TempleStayItem from '@/components/search/TempleStayItem';
import { allTempleStays } from '@/data/dataRepository';

type SortOption = '추천순' | '최신순';

const TempleStaySearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');

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
    // Scroll to top when search results change
    window.scrollTo(0, 0);
  }, [initialQuery]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button 
            onClick={() => navigate('/search')}
            className="text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
          <button 
            onClick={() => navigate('/main')}
            className="text-gray-800"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              className="pl-10 bg-gray-100 border-0 focus-visible:ring-1 rounded-lg"
              placeholder="도시, 지역, 지하철역"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex px-6 mb-6 gap-2">
          {(['추천순', '최신순'] as SortOption[]).map((option) => (
            <button
              key={option}
              className={`px-4 py-1 rounded-full text-xs font-bold ${
                sortBy === option 
                  ? 'bg-[#DE7834] text-white' 
                  : 'bg-white text-black'
              }`}
              onClick={() => setSortBy(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="px-6">
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
