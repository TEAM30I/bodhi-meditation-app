
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, Users, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { getRegionSearchRankings, getTempleStaySearchRankings, addSearchTerm, type SearchRanking } from '@/utils/repository';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { typedData } from '@/utils/typeUtils';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';

const SearchHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'temple' | 'temple-stay'>('temple');
  const [searchValue, setSearchValue] = useState('');
  const [regionSearchRankings, setRegionSearchRankings] = useState<SearchRanking[]>([]);
  const [templeStaySearchRankings, setTempleStaySearchRankings] = useState<SearchRanking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set default dates to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: tomorrow, 
    to: dayAfterTomorrow 
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  // Fetch search rankings on component mount
  useEffect(() => {
    const fetchSearchRankings = async () => {
      try {
        const [regionRankings, templeStayRankings] = await Promise.all([
          getRegionSearchRankings(),
          getTempleStaySearchRankings()
        ]);
        
        setRegionSearchRankings(regionRankings);
        setTempleStaySearchRankings(templeStayRankings);
      } catch (error) {
        console.error('Error fetching search rankings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchRankings();
  }, []);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    // Record search term
    try {
      await addSearchTerm(
        searchValue,
        activeTab === 'temple' ? 'region' : 'temple_stay'
      );
    } catch (error) {
      console.error('Error adding search term:', error);
    }
    
    // Navigate to search results
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${searchValue}`);
    } else {
      let queryParams = `query=${searchValue}`;
      
      if (dateRange.from) {
        queryParams += `&from=${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })}`;
      }
      
      if (dateRange.to) {
        queryParams += `&to=${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
      }
      
      queryParams += `&guests=${guestCount}`;
      
      navigate(`/search/temple-stay/results?${queryParams}`);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTabChange = (tab: 'temple' | 'temple-stay') => {
    setActiveTab(tab);
  };

  const handleNearbySearch = () => {
    if (activeTab === 'temple') {
      navigate('/search/temple/results?nearby=true');
    } else {
      navigate('/search/temple-stay/results?nearby=true');
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      setShowDatePicker(false);
    }
  };

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })} - ${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    return '날짜 선택';
  };

  const handleRankingItemClick = async (term: string) => {
    setSearchValue(term);
    
    // Record search term click
    try {
      await addSearchTerm(
        term, 
        activeTab === 'temple' ? 'region' : 'temple_stay'
      );
    } catch (error) {
      console.error('Error adding search term:', error);
    }
    
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${term}`);
    } else {
      navigate(`/search/temple-stay/results?query=${term}`);
    }
  };

  const activeSearchRankings = activeTab === 'temple' 
    ? regionSearchRankings
    : templeStaySearchRankings;

  return (
    <PageLayout>
      <div className="w-full min-h-screen bg-[#F8F8F8] font-['Pretendard']">
        <div className="w-full bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3 max-w-[480px] mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1 mx-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-2 bg-[#E5E9ED] bg-opacity-87 rounded-full"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[480px] mx-auto pb-20">
          <div className="px-6 py-4">
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'temple' ? 'default' : 'outline'}
                className={`flex-1 ${activeTab === 'temple' ? 'bg-[#DE7834]' : ''}`}
                onClick={() => handleTabChange('temple')}
              >
                사찰
              </Button>
              <Button
                variant={activeTab === 'temple-stay' ? 'default' : 'outline'}
                className={`flex-1 ${activeTab === 'temple-stay' ? 'bg-[#DE7834]' : ''}`}
                onClick={() => handleTabChange('temple-stay')}
              >
                템플스테이
              </Button>
            </div>

            {activeTab === 'temple-stay' && (
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{formatDateRange()}</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>

                <button
                  onClick={() => setShowGuestSelector(true)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">인원 {guestCount}명</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            )}

            <button
              onClick={handleNearbySearch}
              className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-6"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-sm">내 주변 사찰</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <p className="text-sm text-gray-500">검색어를 불러오는 중...</p>
                ) : activeSearchRankings.length > 0 ? (
                  activeSearchRankings.map((ranking, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 text-sm cursor-pointer"
                      onClick={() => handleRankingItemClick(ranking.term)}
                    >
                      {ranking.term}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">검색어가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">날짜 선택</h3>
              <button onClick={() => setShowDatePicker(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <DateRangePicker
              dateRange={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>
      )}

      {showGuestSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">인원 선택</h3>
              <button onClick={() => setShowGuestSelector(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <GuestSelector
              value={guestCount}
              onChange={handleGuestCountChange}
            />
          </div>
        </div>
      )}

      <BottomNav />
    </PageLayout>
  );
};

export default SearchHome;
