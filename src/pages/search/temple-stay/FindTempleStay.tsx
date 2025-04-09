
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Users, Home, ChevronRight, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker, DateRange } from '@/components/search/DateRangePicker';
import { GuestSelector } from '@/components/search/GuestSelector';
import { typedData } from '@/utils/typeUtils';
import { templeStays, getTempleStayList } from '/public/data/templeStayData/templeStayRepository';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  const allTempleStays = typedData(getTempleStayList());
  const featuredTempleStays = allTempleStays.slice(0, 4);
  const popularTempleStays = allTempleStays.slice(0, 4);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let queryParams = `query=${searchTerm}`;
    
    if (dateRange.from) {
      queryParams += `&from=${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })}`;
    }
    
    if (dateRange.to) {
      queryParams += `&to=${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    
    queryParams += `&guests=${guestCount}`;
    
    navigate(`/search/temple-stay/results?${queryParams}`);
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
  
  const handleTempleStayClick = (id: string) => {
    navigate(`/search/temple-stay/TempleStayDetail?id=${id}`);
  };
  
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MM.dd(EEE)', { locale: ko })} - ${format(dateRange.to, 'MM.dd(EEE)', { locale: ko })}`;
    }
    return '날짜 선택';
  };
  
  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">템플스테이</h1>
          </div>
          <button onClick={() => navigate('/')}>
            <Home className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="px-4 pb-4">
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="도시, 지역, 지하철역"
              className="w-full pl-10 pr-4 py-2 rounded-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 mb-4">
            <div 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-200 cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">날짜 선택</span>
            </div>
            <div 
              className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg p-2 border border-gray-200 cursor-pointer"
              onClick={() => setShowGuestSelector(!showGuestSelector)}
            >
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">인원 선택</span>
            </div>
          </div>
          
          {showDatePicker && (
            <div className="mb-3">
              <DateRangePicker 
                dateRange={dateRange} 
                onChange={handleDateRangeChange} 
              />
            </div>
          )}
          
          {showGuestSelector && (
            <div className="mb-3">
              <GuestSelector 
                value={guestCount} 
                onChange={handleGuestCountChange} 
              />
            </div>
          )}
        </form>
      </div>
      
      <div className="max-w-[480px] mx-auto px-4 py-6">
        {/* 최신 템플스테이 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">최신 템플스테이</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => navigate('/search/temple-stay/results?newest=true')}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-3 flex overflow-x-auto py-2 scrollbar-hide gap-2">
            {['서울', '대구', '부산', '속초', '안동', '제주'].map(region => (
              <span 
                key={region} 
                className={`inline-block px-3 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap ${
                  region === '서울' ? 'bg-[#DE7834] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => navigate(`/search/temple-stay/results?region=${region}`)}
              >
                {region}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {featuredTempleStays.map(templeStay => (
              <div 
                key={templeStay.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                onClick={() => handleTempleStayClick(templeStay.id)}
              >
                <div className="relative h-[100px]">
                  <img 
                    src={templeStay.imageUrl} 
                    alt={templeStay.templeName} 
                    className="w-full h-full object-cover"
                  />
                  {templeStay.likeCount && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{templeStay.likeCount || 4.5}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm">{templeStay.templeName}</h3>
                  <p className="text-gray-500 text-xs">{templeStay.location} 방면</p>
                  <p className="font-medium text-sm mt-1">{templeStay.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 많이 찾는 템플스테이 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">많이 찾는 템플스테이</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => navigate('/search/temple-stay/results?popular=true')}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-3 flex overflow-x-auto py-2 scrollbar-hide gap-2">
            {['서울', '대구', '부산', '속초', '안동', '제주'].map(region => (
              <span 
                key={region} 
                className={`inline-block px-3 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap ${
                  region === '서울' ? 'bg-[#DE7834] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => navigate(`/search/temple-stay/results?region=${region}`)}
              >
                {region}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularTempleStays.map(templeStay => (
              <div 
                key={templeStay.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                onClick={() => handleTempleStayClick(templeStay.id)}
              >
                <div className="relative h-[100px]">
                  <img 
                    src={templeStay.imageUrl} 
                    alt={templeStay.templeName} 
                    className="w-full h-full object-cover"
                  />
                  {templeStay.likeCount && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{templeStay.likeCount || 4.5}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm">{templeStay.templeName}</h3>
                  <p className="text-gray-500 text-xs">{templeStay.location} 방면</p>
                  <p className="font-medium text-sm mt-1">{templeStay.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
