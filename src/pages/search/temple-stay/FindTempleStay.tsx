import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, CalendarRange, Users, ChevronRight, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';
import { templeStaySearchRankings } from '/public/data/searchRankingRepository';
import { locations } from '/public/data/templeStayData/templeStayRepository';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

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
              placeholder="가고 싶은 지역이나 템플스테이를 검색해보세요"
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
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-4 border-b border-[#E5E5EC]">
            <h3 className="text-sm font-medium mb-2">
              <CalendarRange className="inline-block mr-1 h-4 w-4" />
              날짜
            </h3>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowDateRangePicker(!showDateRangePicker)}
            >
              {/* 날짜 선택 컴포넌트 */}
              {/* {selectedDateRange ? `${format(selectedDateRange.from, 'yyyy-MM-dd')} ~ ${format(selectedDateRange.to, 'yyyy-MM-dd')}` : '날짜를 선택해주세요'} */}
              {/* 임시 텍스트 */}
              2024년 5월 14일 ~ 2024년 5월 16일
            </Button>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">
              <Users className="inline-block mr-1 h-4 w-4" />
              인원
            </h3>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowGuestSelector(!showGuestSelector)}
            >
              {/* 게스트 선택 컴포넌트 */}
              {/* {guests > 0 ? `${guests}명` : '인원수를 선택해주세요'} */}
              {/* 임시 텍스트 */}
              게스트 2명
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">인기 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {templeStaySearchRankings.map((ranking) => (
              <Link to={`/search/temple-stay/results?query=${ranking.term}`} key={ranking.id}>
                <Button variant="outline" className="rounded-full text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {ranking.term}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">어디로 떠나볼까요?</h2>
          <div className="flex flex-wrap gap-3">
            {locations.map((location) => (
              <Button 
                key={location.name} 
                variant={location.active ? "default" : "outline"} 
                className="rounded-full text-sm"
              >
                {location.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {showDateRangePicker && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6">
            <DateRangePicker />
            <Button onClick={() => setShowDateRangePicker(false)}>닫기</Button>
          </div>
        </div>
      )}

      {showGuestSelector && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6">
            <GuestSelector />
            <Button onClick={() => setShowGuestSelector(false)}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTempleStay;
