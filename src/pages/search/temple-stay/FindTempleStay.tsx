import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Calendar,
  Users,
  X,
  ChevronRight,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { locations, templeStays, TempleStay } from '/public/data/templeStayData/templeStayRepository';
import { templeStaySearchRankings, SearchRanking } from '/public/data/searchRankingRepository';
import { typedData } from '@/utils/typeUtils';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { tomorrow, dayAfterTomorrow, fmt } from '@/utils/dateUtils';

const FindTempleStay: React.FC = () => {
  const navigate = useNavigate();

  /* ──────────────── 상태 ──────────────── */
  const [searchValue, setSearchValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('서울');

  const [guestCount, setGuestCount] = useState(1);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: tomorrow(),
    to: dayAfterTomorrow(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  /* ──────────────── 데이터 ──────────────── */
  const typedLocations = typedData<typeof locations>(locations);
  const templeStayArray = typedData<TempleStay[]>(Object.values(templeStays));
  const [filteredTempleStays, setFilteredTempleStays] = useState<TempleStay[]>(templeStayArray);

  /* ──────────────── 이벤트 ──────────────── */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/search/temple-stay/results?query=${searchValue}` +
      `&guests=${guestCount}&from=${fmt(dateRange.from!)}&to=${fmt(dateRange.to!)}`
    );
  };

  const handleRegionClick = (region: string) => {
    setActiveRegion(region);
    const filtered = templeStayArray.filter(t => t.location.includes(region));
    setFilteredTempleStays(filtered.length ? filtered : templeStayArray);

    navigate(`/search/temple-stay/results?query=${region}`);
  };

  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/detail/${id}`);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev);
    setShowGuestSelector(false);
  };

  const toggleGuestSelector = () => {
    setShowGuestSelector(prev => !prev);
    setShowDatePicker(false);
  };

  const changeGuestCount = (next: number) => {
    setGuestCount(next);
    setShowGuestSelector(false);
  };
  const buildQuery = () =>
    `/search/temple-stay/results?query=${searchValue}` +
    `&guests=${guestCount}&from=${fmt(dateRange.from!)}&to=${fmt(dateRange.to!)}`;
  const handleSearch = () => navigate(buildQuery());
  /* ──────────────── 렌더 ──────────────── */
  return (
    <div className="bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center border-b border-[#E5E5EC]">
        <button onClick={() => navigate('/search')} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
      </div>

      {/* 검색 영역 */}
      <div className="px-5 py-4">
        {/* 검색창 + 필터 버튼 */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="도시, 지역, 지하철역"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </form>

          <div className="flex mt-3 gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-300"
              onClick={toggleDatePicker}
            >
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {fmt(dateRange.from!)} - {fmt(dateRange.to!)}
              </span>
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-300"
              onClick={toggleGuestSelector}
            >
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">성인 {guestCount}명</span>
            </button>
          </div>

          {/* 날짜 선택기 */}
          {showDatePicker && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">날짜 선택</h3>
                <button onClick={() => setShowDatePicker(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <DateRangePicker
                dateRange={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  if (range.from && range.to) setShowDatePicker(false);
                }}
              />
            </div>
          )}

          {/* 인원 선택기 */}
          {showGuestSelector && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">인원 선택</h3>
                <button onClick={() => setShowGuestSelector(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>성인</span>
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                    onClick={() => guestCount > 1 && changeGuestCount(guestCount - 1)}
                  >
                    -
                  </button>
                  <span>{guestCount}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full"
                    onClick={() => changeGuestCount(guestCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* ✅ 검색하기 버튼 */}
        <Button
          className="w-full h-11 mt-4 bg-[#DE7834] hover:bg-[#c96b2e]"
          onClick={handleSearch}
        >
          검색하기
        </Button>

        {/* 최신 템플스테이 */}
        <Section
          title="최신 템플스테이"
          locations={typedLocations}
          activeRegion={activeRegion}
          onRegionClick={handleRegionClick}
          onMore={() => navigate('/search/temple-stay/results?section=latest')}
          templeStays={filteredTempleStays.slice(0, 2)}
          onItemClick={handleTempleStayClick}
        />

        {/* 많이 찾는 템플스테이 */}
        <Section
          title="많이 찾는 템플스테이"
          locations={typedLocations}
          activeRegion={activeRegion}
          onRegionClick={handleRegionClick}
          onMore={() => navigate('/search/temple-stay/results?section=popular')}
          templeStays={filteredTempleStays.slice(0, 4)}
          onItemClick={handleTempleStayClick}
        />
      </div>
    </div>
  );
};

/* ───────────── 재사용 섹션 컴포넌트 ───────────── */
interface SectionProps {
  title: string;
  locations: typeof locations;
  activeRegion: string;
  onRegionClick: (r: string) => void;
  onMore: () => void;
  templeStays: TempleStay[];
  onItemClick: (id: string) => void;
}
const Section: React.FC<SectionProps> = ({
  title,
  locations,
  activeRegion,
  onRegionClick,
  onMore,
  templeStays,
  onItemClick,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-base font-bold">{title}</h2>
      <button className="text-sm text-gray-500 flex items-center" onClick={onMore}>
        더보기 <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>

    <div className="flex overflow-x-auto gap-2 pb-2 mb-3 scrollbar-hide">
      {locations.map((loc, idx) => (
        <button
          key={idx}
          onClick={() => onRegionClick(loc.name)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            activeRegion === loc.name ? 'bg-[#DE7834] text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {loc.name}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-4">
      {templeStays.map((ts) => (
        <div
          key={ts.id}
          className="bg-gray-200 rounded-lg p-2 h-[120px] relative cursor-pointer"
          onClick={() => onItemClick(ts.id)}
        >
          {ts.likeCount && (
            <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded flex items-center">
              ★ 4.5
            </div>
          )}
          <div className="mt-auto">
            <p className="text-xs text-gray-700">
              {ts.location} {ts.templeName}
            </p>
            <p className="text-xs font-medium">{ts.price.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FindTempleStay;
