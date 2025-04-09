
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, Calendar, Users, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TempleStayItem from '@/components/search/TempleStayItem';
import { searchTempleStays, TempleStay } from '/public/data/templeStayData/templeStayRepository';
import { typedData } from '@/utils/typeUtils';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const region = searchParams.get('region') || '';
  const guestCount = searchParams.get('guests') ? parseInt(searchParams.get('guests') || '1') : 1;
  
  const [searchValue, setSearchValue] = useState(query || region);
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'recent'>('popular');
  const [loading, setLoading] = useState(true);

  // Format the date ranges for display
  const from = searchParams.get('from') || formatDate(getTomorrow());
  const to = searchParams.get('to') || formatDate(getDayAfterTomorrow());

  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  function getDayAfterTomorrow() {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter;
  }

  function formatDate(date: Date) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}.${day}(${weekday})`;
  }

  useEffect(() => {
    setLoading(true);
    // Search temple stays based on query or region
    const searchTerm = query || region;
    if (searchTerm) {
      const results = searchTempleStays(searchTerm);
      setTempleStays(typedData<TempleStay[]>(results));
    } else {
      setTempleStays([]);
    }
    setLoading(false);
  }, [query, region]);

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };

  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/detail/${id}`);
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="템플스테이 검색"
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
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/main')}
            className="p-1"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-3">
        <div className="flex gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-lg flex-1 bg-white"
            onClick={() => navigate('/search/temple-stay')}
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{from} - {to}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 rounded-lg flex-1 bg-white"
            onClick={() => navigate('/search/temple-stay')}
          >
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">성인 {guestCount}</span>
          </Button>
        </div>

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
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {templeStays.length > 0 ? (
              templeStays.map((templeStay) => (
                <TempleStayItem
                  key={templeStay.id}
                  templeStay={templeStay}
                  onClick={() => handleTempleStayClick(templeStay.id)}
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
