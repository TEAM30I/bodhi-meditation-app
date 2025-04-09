
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Home } from 'lucide-react';
import BottomNav from "@/components/BottomNav";
import { useNavigate, useLocation } from 'react-router-dom';
import { getTempleList, searchTemples, regionTags } from '@/data/templeData';

type SortOption = '추천순' | '최신순' | '거리순';

const TempleSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '서울';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('추천순');
  const [temples, setTemples] = useState(getTempleList());

  // Update search results based on query
  useEffect(() => {
    if (searchQuery === 'nearby') {
      // Just get all temples for now - in a real app this would filter by location
      setTemples(getTempleList());
    } else {
      setTemples(searchTemples(searchQuery));
    }
  }, [searchQuery]);

  // Sort results based on selected option
  const sortedTemples = React.useMemo(() => {
    switch (sortBy) {
      case '거리순':
        return [...temples].sort((a, b) => {
          if (!a.distance || !b.distance) return 0;
          const distA = parseInt(a.distance.replace(/[^0-9]/g, ''));
          const distB = parseInt(b.distance.replace(/[^0-9]/g, ''));
          return distA - distB;
        });
      case '최신순':
        return [...temples].sort((a, b) => b.id.localeCompare(a.id));
      case '추천순':
      default:
        return [...temples].sort((a, b) => b.likeCount - a.likeCount);
    }
  }, [temples, sortBy]);

  const handleSearch = () => {
    navigate(`/search/temple/results?query=${searchQuery}`);
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
          <h1 className="text-lg font-semibold flex-1 text-center">사찰</h1>
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

        {/* Sort Options */}
        <div className="flex px-4 py-3 gap-2 border-b border-[#E5E5EC] overflow-x-auto">
          {(['추천순', '최신순', '거리순'] as SortOption[]).map((option) => (
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
          <div className="font-bold text-lg mb-4">
            {sortedTemples.length}개의 사찰
          </div>
          
          {sortedTemples.length > 0 ? (
            <div className="space-y-4">
              {sortedTemples.map((temple) => (
                <div 
                  key={temple.id}
                  className="flex bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                >
                  <div className="w-[100px] h-[100px] bg-gray-200">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3">
                    <h3 className="font-semibold text-base mb-1">{temple.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{temple.location}</span>
                      {temple.distance && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">
                          {temple.direction || `도보 ${temple.distance}`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Heart className="w-3 h-3 fill-red-500 stroke-red-500 mr-1" />
                      <span className="mr-2">{temple.likeCount}</span>
                      {temple.tags && temple.tags.map((tag, idx) => (
                        <span key={idx} className="mr-1 px-1.5 py-0.5 bg-gray-100 rounded-full">
                          #{tag}
                        </span>
                      ))}
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

// Add missing Heart icon
const Heart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default TempleSearchResults;
