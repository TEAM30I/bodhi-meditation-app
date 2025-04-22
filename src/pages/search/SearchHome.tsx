
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, Users, X, ChevronLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { 
  getTopLikedTemples, getTopLikedTempleStays, getTopRegions 
} from '@/utils/repository';
import { formatDateSafe } from '@/utils/dateUtils';
import { ko } from 'date-fns/locale';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';
import { getCurrentLocation } from '@/utils/locationUtils';
import { Temple } from '../../public/data/templeData/templeRepository';
import { TempleStay } from '../../public/data/templeStayData/templeStayRepository';

const SearchHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'temple' | 'temple-stay'>('temple');
  const [searchValue, setSearchValue] = useState('');
  const [topTemples, setTopTemples] = useState<Temple[]>([]);
  const [topRegions, setTopRegions] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'temple') {
          const temples = await getTopLikedTemples(8);
          setTopTemples(temples);
        } else {
          const regions = await getTopRegions(8);
          setTopRegions(regions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTabChange = (tab: 'temple' | 'temple-stay') => {
    setActiveTab(tab);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleNearbySearch = async () => {
    try {
      const userLocation = await getCurrentLocation();
      
      if (activeTab === 'temple') {
        navigate('/search/temple/results?nearby=true');
      } else {
        // For temple-stay, also include date and guest count
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        
        navigate(`/search/temple-stay/results?nearby=true&from=${formatDateSafe(tomorrow)}&to=${formatDateSafe(dayAfterTomorrow)}&guests=1`);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      // Fallback to default location
      if (activeTab === 'temple') {
        navigate('/search/temple/results?nearby=true');
      } else {
        navigate('/search/temple-stay/results?nearby=true');
      }
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

  const handleSearch = () => {
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${searchValue}`);
    } else {
      let queryParams = `query=${searchValue}`;
      
      if (dateRange.from) {
        queryParams += `&from=${formatDateSafe(dateRange.from)}`;
      }
      
      if (dateRange.to) {
        queryParams += `&to=${formatDateSafe(dateRange.to)}`;
      }
      
      queryParams += `&guests=${guestCount}`;
      
      navigate(`/search/temple-stay/results?${queryParams}`);
    }
  };

  const handleRegionClick = (region: string) => {
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?region=${region}`);
    } else {
      navigate(`/search/temple-stay/results?region=${region}`);
    }
  };

  return (
    <PageLayout>
      <div className="w-full min-h-screen bg-white font-['Pretendard']">
        <div className="w-full bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3 max-w-[480px] mx-auto">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1 mx-2 text-center">
              <h1 className="text-lg font-bold">검색</h1>
            </div>
            <div className="w-6"></div> {/* Spacer to center the title */}
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

            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Input
                value={searchValue}
                onChange={handleSearchInputChange}
                placeholder={activeTab === 'temple' ? "도시, 지역, 지하철역" : "도시, 지역, 사찰명"}
                className="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>

            {activeTab === 'temple-stay' && (
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">
                      {dateRange.from && dateRange.to ? 
                        `${formatDateSafe(dateRange.from)} - ${formatDateSafe(dateRange.to)}` : 
                        "날짜 선택"}
                    </span>
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
                <span className="text-sm">내 주변 {activeTab === 'temple' ? '사찰' : '템플스테이'}</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </button>

            {activeTab === 'temple' ? (
              // Temple tab content
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">많이 둘러본 사찰</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                      {topTemples.map((temple, index) => (
                        <div 
                          key={temple.id} 
                          className="cursor-pointer"
                          onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                        >
                          <div className="flex items-center mb-1">
                            <span className="text-[#DE7834] font-bold mr-2">{index + 1}</span>
                            <span className="line-clamp-1">{temple.name}</span>
                          </div>
                          {temple.location && (
                            <div className="text-xs text-gray-500">{temple.location}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Temple-stay tab content
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">많이 찾는 지역</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#DE7834]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                      {topRegions.map((region, index) => (
                        <div 
                          key={region.name} 
                          className="cursor-pointer"
                          onClick={() => handleRegionClick(region.name)}
                        >
                          <div className="flex items-center mb-1">
                            <span className="text-[#DE7834] font-bold mr-2">{index + 1}</span>
                            <span>{region.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
      </div>
    </PageLayout>
  );
};

export default SearchHome;
