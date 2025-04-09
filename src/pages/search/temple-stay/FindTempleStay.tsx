
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, X, Calendar, Users, ChevronRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { templeStaySearchRankings } from '/public/data/searchRankingRepository';
import { locations } from '/public/data/templeStayData/templeStayRepository';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface GuestCount {
  adults: number;
  children: number;
}

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [guestCount, setGuestCount] = useState<GuestCount>({
    adults: 1,
    children: 0,
  });

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

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleGuestChange = (guests: GuestCount) => {
    setGuestCount(guests);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
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
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        <h2 className="text-lg font-bold mb-4">템플스테이 찾기</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            지역
          </h3>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Link
                to={`/search/temple-stay/results?location=${location.name}`}
                key={location.name}
                className={`px-3 py-1 rounded-full text-sm ${
                  location.active
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {location.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            날짜 선택
          </h3>
          <Button
            variant="outline"
            className="w-full justify-between py-5 px-4"
            onClick={() => {}}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {dateRange.from
                  ? `${dateRange.from.toLocaleDateString()} ~ ${
                      dateRange.to?.toLocaleDateString() || ''
                    }`
                  : '날짜 선택'}
              </span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <DateRangePicker dateRange={dateRange} onChange={handleDateChange} />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            인원
          </h3>
          <Button
            variant="outline"
            className="w-full justify-between py-5 px-4"
            onClick={() => {}}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {`성인 ${guestCount.adults}명${
                  guestCount.children > 0 ? `, 어린이 ${guestCount.children}명` : ''
                }`}
              </span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <GuestSelector value={guestCount} onChange={handleGuestChange} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            인기 검색어
          </h3>
          <div className="flex flex-col gap-2">
            {templeStaySearchRankings.map((ranking) => (
              <Link
                to={`/search/temple-stay/results?query=${ranking.term}`}
                key={ranking.id}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{ranking.term}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">{ranking.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
