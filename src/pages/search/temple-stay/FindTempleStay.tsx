import React, { useState, useEffect } from 'react';
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
// 레포지토리에서 필요한 함수와 타입 임포트
import { 
  getLocations, 
  getTempleStayList, 
  getTopLikedTempleStays, 
  filterTempleStaysByTag,
  getTempleStaysByRegion,
  TempleStay 
} from '@/utils/repository';
import { 
  getTempleStaySearchRankings,
  addSearchTerm,
  type SearchRanking 
} from '@/utils/repository';
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

  /* ──────────────── 데이터 상태 ──────────────── */
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [latestTempleStays, setLatestTempleStays] = useState<TempleStay[]>([]);
  const [popularTempleStays, setPopularTempleStays] = useState<TempleStay[]>([]);
  const [filteredTempleStays, setFilteredTempleStays] = useState<TempleStay[]>([]);
  const [searchRankings, setSearchRankings] = useState<SearchRanking[]>([]);
  const [locations, setLocations] = useState<{name: string; active: boolean}[]>([]);
  const [loading, setLoading] = useState({
    templeStays: true,
    popular: true,
    rankings: true,
    filtered: false,
    locations: true
  });

  /* ──────────────── 데이터 로드 ──────────────── */
  // 지역 데이터 로드
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationData = await getLocations();
        setLocations(locationData);
        setLoading(prev => ({...prev, locations: false}));
      } catch (error) {
        console.error("Failed to load locations:", error);
        // 기본 지역 데이터 설정
        setLocations([
          { name: '서울', active: true },
          { name: '경주', active: false },
          { name: '부산', active: false }
        ]);
        setLoading(prev => ({...prev, locations: false}));
      }
    };

    loadLocations();
  }, []);

  // 모든 템플스테이 데이터 로드
  useEffect(() => {
    const loadTempleStays = async () => {
      try {
        const allTempleStays = await getTempleStayList();
        setTempleStays(allTempleStays);
        
        // 최신순으로 정렬 (id가 최신이라고 가정)
        const latest = [...allTempleStays].sort((a, b) => 
          b.id.localeCompare(a.id)
        ).slice(0, 4);
        setLatestTempleStays(latest);
        
        // 초기 필터링된 템플스테이는 서울 지역
        const seoulTempleStays = allTempleStays.filter(
          ts => ts.location.includes('서울')
        );
        setFilteredTempleStays(seoulTempleStays.length ? seoulTempleStays : allTempleStays.slice(0, 4));
        
        setLoading(prev => ({...prev, templeStays: false}));
      } catch (error) {
        console.error("Failed to load temple stays:", error);
        setLoading(prev => ({...prev, templeStays: false}));
      }
    };

    loadTempleStays();
  }, []);

  // 인기 템플스테이 로드
  useEffect(() => {
    const loadPopularTempleStays = async () => {
      try {
        const popular = await getTopLikedTempleStays(5);
        setPopularTempleStays(popular);
        setLoading(prev => ({...prev, popular: false}));
      } catch (error) {
        console.error("Failed to load popular temple stays:", error);
        setLoading(prev => ({...prev, popular: false}));
      }
    };

    loadPopularTempleStays();
  }, []);

  // 검색 랭킹 로드
  useEffect(() => {
    const loadSearchRankings = async () => {
      try {
        const rankings = await getTempleStaySearchRankings();
        setSearchRankings(rankings);
        setLoading(prev => ({...prev, rankings: false}));
      } catch (error) {
        console.error("Failed to load search rankings:", error);
        setLoading(prev => ({...prev, rankings: false}));
      }
    };

    loadSearchRankings();
  }, []);

  /* ──────────────── 이벤트 핸들러 ──────────────── */
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    try {
      // 검색어를 검색 기록에 추가
      await addSearchTerm(searchValue, 'temple_stay');
      navigate(buildQuery());
    } catch (error) {
      console.error("Error submitting search:", error);
      // 에러가 발생해도 검색 결과 페이지로 이동
      navigate(buildQuery());
    }
  };

  const handleRegionClick = async (region: string) => {
    setActiveRegion(region);
    setLoading(prev => ({...prev, filtered: true}));

    try {
      // 검색어를 검색 기록에 추가
      await addSearchTerm(region, 'temple_stay');
      
      // 지역으로 템플스테이 필터링 (API 호출)
      const regionTempleStays = await getTempleStaysByRegion(region);
      
      if (regionTempleStays.length > 0) {
        setFilteredTempleStays(regionTempleStays);
      } else {
        // 태그로 검색 시도
        const tagFiltered = await filterTempleStaysByTag(region);
        if (tagFiltered.length > 0) {
          setFilteredTempleStays(tagFiltered);
        } else {
          // 그래도 없다면 전체 데이터에서 필터링
          const filtered = templeStays.filter(ts => 
            ts.location.includes(region) || 
            ts.templeName.includes(region) ||
            (ts.tags && ts.tags.some(tag => tag.includes(region)))
          );
          setFilteredTempleStays(filtered.length ? filtered : templeStays.slice(0, 4));
        }
      }
    } catch (error) {
      console.error("Error filtering by region:", error);
      // 에러 시 클라이언트 측 필터링으로 폴백
      const filtered = templeStays.filter(ts => 
        ts.location.includes(region)
      );
      setFilteredTempleStays(filtered.length ? filtered : templeStays.slice(0, 4));
    } finally {
      setLoading(prev => ({...prev, filtered: false}));
    }
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

  const handleSearchRankingClick = (term: string) => {
    setSearchValue(term);
    handleSearch();
  };

  /* ──────────────── 로딩 상태 ──────────────── */
  if (loading.templeStays && loading.popular) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p>데이터를 로딩 중입니다...</p>
      </div>
    );
  }

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

        {/* 인기 검색어 섹션 */}
        {!loading.rankings && searchRankings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold mb-2">인기 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {searchRankings.slice(0, 5).map((ranking) => (
                <button
                  key={ranking.id}
                  onClick={() => handleSearchRankingClick(ranking.term)}
                  className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 flex items-center"
                >
                  <span className="text-[#DE7834] font-medium mr-1">{ranking.term}</span>
                  {ranking.trend === 'up' && <span className="text-green-500 text-xs">↑</span>}
                  {ranking.trend === 'down' && <span className="text-red-500 text-xs">↓</span>}
                  {ranking.trend === 'new' && <span className="text-blue-500 text-xs">N</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        
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
          locations={locations}
          activeRegion={activeRegion}
          onRegionClick={handleRegionClick}
          onMore={() => navigate('/search/temple-stay/results?section=latest')}
          templeStays={loading.filtered ? templeStays.slice(0, 2) : filteredTempleStays.slice(0, 2)}
          isLoading={loading.filtered}
          onItemClick={handleTempleStayClick}
        />

        {/* 많이 찾는 템플스테이 */}
        <Section
        title="많이 찾는 템플스테이"
        locations={locations}
        activeRegion={activeRegion}
        onRegionClick={handleRegionClick}
        onMore={() => navigate('/search/temple-stay/results?section=popular')}
        templeStays={!loading.popular ? popularTempleStays : templeStays.slice(0, 4)}
        isLoading={loading.popular}
        onItemClick={handleTempleStayClick}
        />
        </div>
        </div>
        );
    };

/* ───────────── 재사용 섹션 컴포넌트 ───────────── */
interface SectionProps {
title: string;
locations: {name: string; active: boolean}[];
activeRegion: string;
onRegionClick: (r: string) => void;
onMore: () => void;
templeStays: TempleStay[];
isLoading?: boolean;
onItemClick: (id: string) => void;
}
const Section: React.FC<SectionProps> = ({
title,
locations,
activeRegion,
onRegionClick,
onMore,
templeStays,
isLoading = false,
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

{isLoading ? (
<div className="grid grid-cols-2 gap-4 h-[120px] items-center justify-center">
<p className="text-center col-span-2 text-gray-500">로딩 중...</p>
</div>
) : (
<div className="grid grid-cols-2 gap-4">
{templeStays.map((ts) => (
<div
  key={ts.id}
  className="bg-gray-200 rounded-lg p-2 h-[120px] relative cursor-pointer"
  onClick={() => onItemClick(ts.id)}
>
  {ts.likeCount && (
    <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs px-1.5 py-0.5 rounded flex items-center">
      <span className="mr-1">★</span> {typeof ts.likeCount === 'number' ? ts.likeCount.toFixed(1) : ts.likeCount}
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
)}
</div>
);

export default FindTempleStay;
