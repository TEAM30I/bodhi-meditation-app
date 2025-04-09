
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { regionSearchRankings } from "../../data/searchRankingRepository";
import BottomNav from '@/components/BottomNav';
import DateRangePicker from "@/components/search/DateRangePicker";
import GuestSelector from "@/components/search/GuestSelector";

export default function SearchHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"temple" | "templeStay">("templeStay");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set default date range to tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: tomorrow,
    to: dayAfterTomorrow,
  });
  
  // Default to 2 adults
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Show date picker and guest selector panels
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const handleRegionClick = (query: string) => {
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${query}`);
    } else {
      // For temple stay, use default values
      navigate(`/search/temple-stay/results?query=${query}&dateFrom=${formatDate(dateRange.from)}&dateTo=${formatDate(dateRange.to)}&guests=${adults + children}`);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'temple') {
      navigate(`/search/temple/results?query=${searchQuery || '서울'}`);
    } else {
      // For temple stay, use default values
      navigate(`/search/temple-stay/results?query=${searchQuery || '서울'}&dateFrom=${formatDate(dateRange.from)}&dateTo=${formatDate(dateRange.to)}&guests=${adults + children}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationSearch = () => {
    if (activeTab === 'temple') {
      setSearchQuery("내 주변");
      navigate(`/search/temple/results?query=nearby`);
    } else {
      setSearchQuery("내 주변");
      navigate(`/search/temple-stay/results?query=nearby&dateFrom=${formatDate(dateRange.from)}&dateTo=${formatDate(dateRange.to)}&guests=${adults + children}`);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleGuestChange = (adults: number, children: number) => {
    setAdults(adults);
    setChildren(children);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen w-full pb-20">
      <div className="w-full max-w-[480px] mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center h-[56px] px-5 border-b border-[#E5E5EC]">
          <button 
            onClick={() => navigate('/main')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center">검색</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5E5EC]">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value as "temple" | "templeStay");
              setShowDatePicker(false);
              setShowGuestSelector(false);
            }}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-transparent h-12">
              <TabsTrigger 
                value="templeStay" 
                className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                ${activeTab === 'templeStay' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
              >
                템플스테이
              </TabsTrigger>
              <TabsTrigger 
                value="temple" 
                className={`data-[state=active]:shadow-none data-[state=active]:bg-transparent h-full
                ${activeTab === 'temple' ? 'text-[#FF8433] border-b-2 border-[#FF8433] font-medium' : 'text-gray-500'}`}
              >
                사찰
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9 py-2 bg-[#F5F5F5] border-none text-sm rounded-full"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Date and Guest Selection - Only for Temple Stay */}
        {activeTab === "templeStay" && (
          <div className="flex border-b border-[#E5E5EC]">
            <div 
              className="flex-1 px-4 py-3 border-r border-[#E5E5EC] cursor-pointer"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowGuestSelector(false);
              }}
            >
              <p className="text-xs text-gray-500 mb-1">날짜</p>
              <p className="text-sm font-medium">
                {dateRange.from ? `${dateRange.from.getMonth() + 1}월 ${dateRange.from.getDate()}일` : '날짜 추가'} - 
                {dateRange.to ? ` ${dateRange.to.getMonth() + 1}월 ${dateRange.to.getDate()}일` : ''}
              </p>
            </div>
            <div 
              className="flex-1 px-4 py-3 cursor-pointer"
              onClick={() => {
                setShowGuestSelector(!showGuestSelector);
                setShowDatePicker(false);
              }}
            >
              <p className="text-xs text-gray-500 mb-1">인원</p>
              <p className="text-sm font-medium">
                성인 {adults}명 {children > 0 ? `, 어린이 ${children}명` : ''}
              </p>
            </div>
          </div>
        )}

        {/* Date Picker Panel */}
        {showDatePicker && (
          <div className="border-b border-[#E5E5EC] p-4">
            <DateRangePicker 
              dateRange={dateRange}
              onChange={handleDateRangeChange}
              onDateRangeChange={setDateRange}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        )}

        {/* Guest Selector Panel */}
        {showGuestSelector && (
          <div className="border-b border-[#E5E5EC] p-4">
            <GuestSelector 
              adults={adults}
              children={children}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              onClose={() => setShowGuestSelector(false)}
            />
          </div>
        )}

        {/* Search Button */}
        <div className="px-4 py-3 border-b border-[#E5E5EC]">
          <Button 
            className="w-full bg-[#FF8433] hover:bg-[#E67422] text-white"
            onClick={handleSearch}
          >
            검색하기
          </Button>
        </div>

        {/* Location Search Button */}
        <div className="px-4 py-3 mb-3 border-b border-[#E5E5EC]">
          <button
            className="flex items-center gap-2 text-sm text-[#FF8433] border border-[#FF8433] rounded-full py-2 px-4 w-full"
            onClick={handleLocationSearch}
          >
            <MapPin className="w-4 h-4" />
            <span>내 주변에서 검색</span>
          </button>
        </div>

        {/* Regional Search Ranking */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-bold mb-4 text-[#333333]">
            {activeTab === 'temple' ? '많이 찜한 사찰' : '인기 검색어'}
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {regionSearchRankings.map((location) => (
              <div
                key={location.id}
                className="flex items-center cursor-pointer"
                onClick={() => handleRegionClick(location.query)}
              >
                <span className="text-[#FF8433] font-bold w-6">{location.id}</span>
                <span className="font-medium">{location.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};
