import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, Calendar, Users, Home } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TempleStayItem from '@/components/search/TempleStayItem';
import { GuestSelector } from '@/components/search/GuestSelector';
import {
  searchTempleStays,
  getTempleStayList,
  getTempleStaysByRegion,
} from '@/lib/repository';
import { TempleStay, TempleStaySort } from '@/types';
import { typedData } from '@/utils/typeUtils';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { tomorrow, dayAfterTomorrow, fmt } from '@/utils/dateUtils';
import { toast } from 'sonner';
import { getCurrentLocation } from '@/utils/locationUtils';

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  /* ───────────── 파라미터 → 초기 상태 ───────────── */
  const query       = searchParams.get('query')   || '';
  const region      = searchParams.get('region')  || '';
  const initialGuests = Number(searchParams.get('guests') || 1);
  const nearby = searchParams.get('nearby') === 'true';

  /* ───────────── 상태 ───────────── */
  const [searchValue, setSearchValue] = useState(query || region);
  const [guestCount,  setGuestCount]  = useState(initialGuests);

  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [activeFilter, setActiveFilter] = useState<TempleStaySort>('popular');
  const [loading, setLoading] = useState(true);

  const [showDatePicker,   setShowDatePicker]   = useState(false);
  const [showGuestSelector,setShowGuestSelector]= useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: searchParams.get('from') ? new Date(searchParams.get('from')!) : tomorrow(),
    to:   searchParams.get('to')   ? new Date(searchParams.get('to')!)   : dayAfterTomorrow(),
  });

  /* ───────────── 데이터 로드 ───────────── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const term = query || region;
      
      try {
        let results: TempleStay[] = [];
        
        if (nearby) {
          // Handle nearby search (even though we don't have lat/long for temple stays in the current schema)
          // We'll just get all and apply simulated distance
          results = await getTempleStayList('distance');
        } else if (term) {
          console.log(`Searching for temple stays with term: ${term}`);
          
          if (region) {
            // If region parameter exists, search by region
            results = await getTempleStaysByRegion(region);
          } else {
            // Otherwise search by the query term
            results = await searchTempleStays(term);
          }
        } else {
          // If no search term, get all temple stays with current sort
          results = await getTempleStayList(activeFilter);
        }
        
        setTempleStays(results);
        
        if (results.length === 0) {
          toast.info('검색 결과가 없습니다.');
        } else {
          console.log(`Found ${results.length} temple stays`);
        }
      } catch (error) {
        console.error('Error fetching temple stays:', error);
        toast.error('검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, region, nearby, location.search]);

  // When filter changes
  useEffect(() => {
    if (!query && !region && !nearby) {
      const sortTemplStays = async () => {
        setLoading(true);
        try {
          const results = await getTempleStayList(activeFilter);
          setTempleStays(results);
        } catch (error) {
          console.error('Error sorting temple stays:', error);
        } finally {
          setLoading(false);
        }
      };
      
      sortTemplStays();
    }
  }, [activeFilter]);

  /* ───────────── 헬퍼 ───────────── */
  const buildQuery = () =>
    `/search/temple-stay/results?query=${searchValue}` +
    `&guests=${guestCount}` +
    `&from=${fmt(dateRange.from!)}&to=${fmt(dateRange.to!)}`;

  /* ───────────── 이벤트 ───────────── */
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate(buildQuery());
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) setShowDatePicker(false);
  };

  const handleGuestCountChange = (n: number) => {
    setGuestCount(n);
    setShowGuestSelector(false);
  };

  /* ───────────── 렌더 ───────────── */
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* ── 헤더 ── */}
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/search')} className="p-1">
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 mx-3 relative">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="템플스테이 검색"
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F5F5F5] border-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </form>
          
          <button onClick={() => navigate('/')} className="p-1">
            <Home className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div className="max-w-[480px] mx-auto px-5 py-3">
        {/* 날짜·인원 필터 */}
        <div className="flex gap-3 mb-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white"
            onClick={() => {
              setShowDatePicker((p) => !p);
              setShowGuestSelector(false);
            }}
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {fmt(dateRange.from!)} - {fmt(dateRange.to!)}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white"
            onClick={() => {
              setShowGuestSelector((p) => !p);
              setShowDatePicker(false);
            }}
          >
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">성인 {guestCount}명</span>
          </Button>
        </div>

        {showDatePicker && (
          <div className="mb-3">
            <DateRangePicker dateRange={dateRange} onChange={handleDateRangeChange} />
          </div>
        )}

        {showGuestSelector && (
          <div className="mb-3">
            <GuestSelector value={guestCount} onChange={handleGuestCountChange} />
          </div>
        )}

        {/* 정렬 필터 */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
          <Button
            variant={activeFilter === 'popular' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full px-4 ${activeFilter === 'popular' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-gray-700'}`}
            onClick={() => setActiveFilter('popular')}
          >
            인기순
          </Button>
          <Button
            variant={activeFilter === 'recent' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full px-4 ${activeFilter === 'recent' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-gray-700'}`}
            onClick={() => setActiveFilter('recent')}
          >
            최신순
          </Button>
          <Button
            variant={activeFilter === 'distance' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full px-4 ${activeFilter === 'distance' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-gray-700'}`}
            onClick={() => setActiveFilter('distance')}
          >
            거리순
          </Button>
          <Button
            variant={activeFilter === 'price-asc' ? 'default' : 'outline'}
            size="sm"
            className={`rounded-full px-4 ${activeFilter === 'price-asc' ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-gray-700'}`}
            onClick={() => setActiveFilter('price-asc')}
          >
            가격낮은순
          </Button>
        </div>

        {/* 검색하기 버튼 */}
        <Button
          className="w-full h-11 mb-4 bg-[#1A1A1A] hover:bg-[#333333]"
          onClick={handleSearchSubmit}
        >
          검색하기
        </Button>

        {/* 결과 리스트 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
          </div>
        ) : (
          <div>
            {templeStays.length ? (
              templeStays.map((ts) => (
                <TempleStayItem
                  key={ts.id}
                  templeStay={ts}
                  onClick={() => navigate(`/search/temple-stay/detail/${ts.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
