
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Home } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import TempleItem from '@/components/search/TempleItem';
import { allTemples } from '../../../data/dataRepository';

type SortOption = '추천순' | '최신순';

const TempleSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');

  // Filter results based on search query
  const filteredTemples = allTemples.filter(temple => 
    temple.name.includes(searchQuery) || 
    temple.location.includes(searchQuery) ||
    (temple.description && temple.description.includes(searchQuery))
  );

  const handleSearch = () => {
    navigate(`/search/temple/results?query=${searchQuery}`);
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
        <div className="flex items-center h-[56px] px-5 border-b border-gray-100">
          <button 
            onClick={() => navigate('/search')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
          <button 
            onClick={() => navigate('/main')}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-9 bg-[#F5F5F5] border border-[#2196F3] focus-visible:ring-0 rounded-lg"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex px-4 py-3 gap-2 border-b border-gray-100">
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
          {filteredTemples.length > 0 ? (
            filteredTemples.map((temple) => (
              <TempleItem key={temple.id} temple={temple} />
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

export default TempleSearchResults;
