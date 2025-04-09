
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ArrowLeft, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';
import { regionSearchRankings } from '@/data/searchRankingRepository';

const SearchHome = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState<{ adults: number; children: number }>({ adults: 2, children: 0 });
  const [activeTab, setActiveTab] = useState<'templestay' | 'temple'>('templestay');
  
  const handleGuestsChange = (newValue: { adults: number; children: number }) => {
    setGuests(newValue);
  };
  
  const handleSearch = () => {
    // Navigate to search results
    const path = activeTab === 'templestay' ? '/search/temple-stay/results' : '/search/temple/results';
    navigate(path, { 
      state: { 
        searchTerm, 
        date: dateRange, 
        guests 
      } 
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Get the popular search regions
  const popularRegions = regionSearchRankings.slice(0, 9);
  
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          className="mr-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold flex-1">검색</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button 
          className={`flex-1 text-center py-3 relative font-medium ${activeTab === 'templestay' ? 'text-[#DE7834]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('templestay')}
        >
          템플스테이
          {activeTab === 'templestay' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DE7834]"></div>}
        </button>
        <button 
          className={`flex-1 text-center py-3 relative font-medium ${activeTab === 'temple' ? 'text-[#DE7834]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('temple')}
        >
          사찰
          {activeTab === 'temple' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DE7834]"></div>}
        </button>
      </div>
      
      <div className="px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            placeholder="도시, 지역, 사찰명"
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Date Selectors */}
        <div className="flex space-x-2 mb-4">
          <button 
            className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg py-3 px-2"
            onClick={() => setShowDatePicker(true)}
          >
            <Calendar className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">날짜 선택</span>
          </button>
          
          <button 
            className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg py-3 px-2"
            onClick={() => setShowGuestSelector(true)}
          >
            <Users className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">인원 선택</span>
          </button>
        </div>
        
        {/* Search button */}
        <button 
          className="flex items-center justify-center bg-[#DE7834] rounded-lg w-full py-3 mb-6 text-white font-medium"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          내 주변에서 검색
        </button>
        
        {/* Popular Searches */}
        <div className="mb-6">
          <h2 className="text-base font-medium mb-4">
            {activeTab === 'templestay' ? '많이 찾는 템플스테이' : '많이 찾는 사찰'}
          </h2>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            {popularRegions.map((region, index) => (
              <div key={index} className="flex items-center">
                <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${index < 3 ? 'bg-[#DE7834] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {index + 1}
                </span>
                <span className="text-sm truncate">
                  {region.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
            <DateRangePicker 
              dateRange={dateRange}
              onChange={setDateRange}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        </div>
      )}
      
      {/* Guest Selector Modal */}
      {showGuestSelector && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <GuestSelector 
              value={guests}
              onChange={handleGuestsChange}
              onClose={() => setShowGuestSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHome;
