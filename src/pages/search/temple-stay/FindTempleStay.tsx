
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ArrowLeft, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '@/components/search/DateRangePicker';
import GuestSelector from '@/components/search/GuestSelector';
import { regionSearchRankings } from '@/data/searchRankingRepository';
import { regions } from '@/data/templeStayData/templeStayRepository';

const FindTempleStay = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState<{ adults: number; children: number }>({ adults: 2, children: 0 });
  
  const handleGuestsChange = (newValue: { adults: number; children: number }) => {
    setGuests(newValue);
  };
  
  const handleSearch = () => {
    // Navigate to search results
    navigate('/search/temple-stay/results', { 
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
  
  // Get the popular search regions for temple stays
  const popularRegions = regionSearchRankings
    .filter(r => regions.some(region => region.toLowerCase().includes(r.name.toLowerCase())))
    .slice(0, 10);
  
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button 
          className="mr-3"
          onClick={() => navigate('/search')}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold flex-1">템플스테이 찾기</h1>
      </div>
      
      <div className="px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            placeholder="템플스테이 이름 또는 지역"
            className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
        
        {/* Search Options */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
          <button 
            className="flex items-center bg-gray-100 rounded-full px-4 py-2 whitespace-nowrap"
            onClick={() => setShowDatePicker(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {dateRange.from 
                ? `${dateRange.from?.toLocaleDateString('ko-KR', {month: 'short', day: 'numeric'})} - ${dateRange.to?.toLocaleDateString('ko-KR', {month: 'short', day: 'numeric'})}`
                : '날짜'}
            </span>
          </button>
          
          <button 
            className="flex items-center bg-gray-100 rounded-full px-4 py-2 whitespace-nowrap"
            onClick={() => setShowGuestSelector(true)}
          >
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">
              성인 {guests.adults}, 어린이 {guests.children}
            </span>
          </button>
        </div>
        
        {/* Popular Regions */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">인기 지역</h2>
          <div className="flex flex-wrap gap-2">
            {popularRegions.map((region, index) => (
              <button 
                key={index}
                className="bg-gray-100 rounded-full px-4 py-2 text-sm"
                onClick={() => {
                  setSearchTerm(region.query);
                  handleSearch();
                }}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Top Temple Stay Regions */}
        <div>
          <h2 className="text-lg font-medium mb-3">인기 템플스테이 지역</h2>
          <div className="grid grid-cols-2 gap-3">
            {regions.slice(0, 6).map((region, index) => (
              <button 
                key={index}
                className="bg-gray-100 rounded-lg p-4 flex items-center justify-center"
                onClick={() => {
                  setSearchTerm(region);
                  handleSearch();
                }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span>{region}</span>
              </button>
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

export default FindTempleStay;
