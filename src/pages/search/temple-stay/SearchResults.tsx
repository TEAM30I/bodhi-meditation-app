import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, X, Calendar, Users } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TempleStayItem from '@/components/search/TempleStayItem';
import { GuestSelector } from '@/components/search/GuestSelector';
import {
  searchTempleStays,
  getTempleStayList,
  TempleStay,
} from '@/utils/repository';
import { typedData } from '@/utils/typeUtils';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { tomorrow, dayAfterTomorrow, fmt } from '@/utils/dateUtils';

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  /* ───────────── 파라미터 → 초기 상태 ───────────── */
  const query       = searchParams.get('query')   || '';
  const region      = searchParams.get('region')  || '';
  const initialGuests = Number(searchParams.get('guests') || 1);

  /* ───────────── 상태 ───────────── */
  const [searchValue, setSearchValue] = useState(query || region);
  const [guestCount,  setGuestCount]  = useState(initialGuests);

  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'recent'>('popular');
  const [loading, setLoading] = useState(true);

  const [showDatePicker,   setShowDatePicker]   = useState(false);
  const [showGuestSelector,setShowGuestSelector]= useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: searchParams.get('from') ? new Date(searchParams.get('from')!) : tomorrow(),
    to:   searchParams.get('to')   ? new Date(searchParams.get('to')!)   : dayAfterTomorrow(),
  });

  /* ───────────── 데이터 로드 ───────────── */
  useEffect(() => {
    setLoading(true);
    const term = query || region;
    if (term) {
      setTempleStays(typedData<TempleStay[]>(searchTempleStays(term)));
    } else {
      setTempleStays(typedData<TempleStay[]>(getTempleStayList()));
    }
    setLoading(false);
  }, [location.search]);

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
    <div className="bg-[#F8F8F8] min-h-screen pb-24">
      {/* ── 헤더 ── */}
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/main')}>
            <ArrowLeft className="h-6 w-6" />
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
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
        </div>
      </div>

      {/* ── 본문 ── */}
      <div className="max-w-[480px] mx-auto px-5 py-3">
        {/* 날짜·인원 필터 */}
        <div className="flex gap-3 mb-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center gap-1 rounded-lg bg-white"
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
            className="flex-1 flex items-center gap-1 rounded-lg bg-white"
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

        {/* 검색하기 */}
        <Button
          className="w-full h-11 mb-4 bg-[#DE7834] hover:bg-[#c96b2e]"
          onClick={handleSearchSubmit}
        >
          검색하기
        </Button>

        {/* 정렬 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeFilter === 'popular' ? 'default' : 'outline'}
            size="sm"
            className={activeFilter === 'popular' ? 'bg-[#DE7834]' : 'bg-white'}
            onClick={() => setActiveFilter('popular')}
          >
            인기순
          </Button>
          <Button
            variant={activeFilter === 'recent' ? 'default' : 'outline'}
            size="sm"
            className={activeFilter === 'recent' ? 'bg-[#DE7834]' : 'bg-white'}
            onClick={() => setActiveFilter('recent')}
          >
            최신순
          </Button>
        </div>

        {/* 결과 리스트 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
          </div>
        ) : (
          <div className="space-y-4">
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
