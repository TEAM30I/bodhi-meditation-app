
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TempleItem from '@/components/search/TempleItem';
import { Temple, getTempleList, searchTemples, getNearbyTemples } from '@/utils/repository';
import { getCurrentLocation } from '@/utils/locationUtils';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const region = searchParams.get('region') || '';
  const nearby = searchParams.get('nearby') === 'true';
  
  const [searchValue, setSearchValue] = useState(query || region);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'recent' | 'distance'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true);
      try {
        let results: Temple[] = [];
        
        if (nearby) {
          // Get user location
          const userLocation = await getCurrentLocation();
          results = await getNearbyTemples(userLocation.latitude, userLocation.longitude);
        } else if (query || region) {
          // Search temples based on query or region
          const searchTerm = query || region;
          results = await searchTemples(searchTerm);
        } else {
          // Just get all temples with the current sort
          results = await getTempleList(activeFilter);
        }
        
        setTemples(results);
      } catch (error) {
        console.error('Error fetching temples:', error);
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, [query, region, nearby]);

  // Update sort when filter changes
  useEffect(() => {
    const sortTemples = async () => {
      setLoading(true);
      try {
        // If we're in regular search mode (not nearby or specific query)
        if (!nearby && !query && !region) {
          const sortedTemples = await getTempleList(activeFilter);
          setTemples(sortedTemples);
        } else if (nearby) {
          // If we're in nearby mode, resort the existing temples by distance
          const userLocation = await getCurrentLocation();
          const newResults = await getNearbyTemples(userLocation.latitude, userLocation.longitude);
          setTemples(newResults);
        }
      } catch (error) {
        console.error('Error sorting temples:', error);
      } finally {
        setLoading(false);
      }
    };

    sortTemples();
  }, [activeFilter]);

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };
  
  const handleSearch = () => navigate(`/search/temple/results?query=${searchValue}`);
  
  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          
          <button onClick={() => navigate('/search')}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="사찰 검색"
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F5F5F5] border-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

            {searchValue && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </form>
        </div>
        {/* ✅ 검색하기 버튼 */}
        <Button
          className="w-full h-11 mb-4 bg-[#DE7834] hover:bg-[#c96b2e]"
          onClick={handleSearch}
        >
          검색하기
        </Button>
      </div>
      
      <div className="max-w-[480px] mx-auto px-5 py-3">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeFilter === 'popular' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('popular')}
            className={activeFilter === 'popular' ? 'bg-[#DE7834]' : 'bg-white'}
            size="sm"
          >
            인기순
          </Button>
          <Button
            variant={activeFilter === 'recent' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('recent')}
            className={activeFilter === 'recent' ? 'bg-[#DE7834]' : 'bg-white'}
            size="sm"
          >
            최신순
          </Button>
          <Button
            variant={activeFilter === 'distance' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('distance')}
            className={activeFilter === 'distance' ? 'bg-[#DE7834]' : 'bg-white'}
            size="sm"
          >
            거리순
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {temples.length > 0 ? (
              temples.map((temple) => (
                <TempleItem
                  key={temple.id}
                  temple={temple}
                  onClick={() => handleTempleClick(temple.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">다른 검색어를 입력해 보세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
