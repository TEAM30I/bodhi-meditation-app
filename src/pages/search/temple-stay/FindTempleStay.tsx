
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Home, Calendar, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TempleStayItem from '@/components/search/TempleStayItem';
import { locations, nearbyTempleStays } from "@/data/templeStayData";
import BottomNav from '@/components/BottomNav';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-15~2025-04-16");
  const [selectedGuests, setSelectedGuests] = useState<string>("성인 1명");
  
  const handleLocationClick = (locationName: string) => {
    setActiveLocation(locationName);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search/temple-stay/results?query=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-20">
      <div className="w-full max-w-[480px] mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center h-[56px] px-5 border-b border-gray-100">
          <button 
            onClick={() => navigate('/search')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
          <button 
            onClick={() => navigate('/main')}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Input */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-10 bg-[#F5F5F5] border-0 focus-visible:ring-0 rounded-lg"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Date and Guest Selection */}
        <div className="flex border-b border-gray-100">
          <button className="flex items-center justify-between flex-1 px-4 py-3 border-r border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedDate}</span>
            </div>
          </button>
          <button className="flex items-center justify-between flex-1 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedGuests}</span>
            </div>
          </button>
        </div>
        
        {/* Recommended Temple Stays */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">최신 템플스테이</h2>
            <button 
              onClick={() => navigate('/search/temple-stay/results')}
              className="text-sm text-gray-500"
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {nearbyTempleStays.slice(0, 4).map((stay) => (
              <div 
                key={stay.id} 
                className="cursor-pointer"
                onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={stay.imageUrl}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold bg-[#FFC83B] text-black px-2 py-0.5 rounded-full">★ {stay.rating}</span>
                  </div>
                  <h3 className="font-medium text-sm">{stay.name}</h3>
                  <p className="text-xs text-gray-500">{stay.location}</p>
                  <p className="text-[#FF8433] text-sm font-bold mt-1">{new Intl.NumberFormat('ko-KR').format(stay.price)}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Temple Stays */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">많이 찾는 템플스테이</h2>
            <button 
              onClick={() => navigate('/search/temple-stay/results')}
              className="text-sm text-gray-500"
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-3 gap-2 mb-4">
            {['서울', '대구', '부산', '속초', '인천', '제주'].map((region, index) => (
              <Badge 
                key={region}
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto cursor-pointer whitespace-nowrap
                  ${index === 0 ? 'bg-[#FF8433] text-white border-[#FF8433]' : 'bg-white text-black border-gray-300'}`}
              >
                {region}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {nearbyTempleStays.slice(0, 4).map((stay) => (
              <div 
                key={`popular-${stay.id}`} 
                className="cursor-pointer"
                onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={stay.imageUrl}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold bg-[#FFC83B] text-black px-2 py-0.5 rounded-full">★ {stay.rating}</span>
                  </div>
                  <h3 className="font-medium text-sm">{stay.name}</h3>
                  <p className="text-xs text-gray-500">{stay.location}</p>
                  <p className="text-[#FF8433] text-sm font-bold mt-1">{new Intl.NumberFormat('ko-KR').format(stay.price)}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default FindTempleStay;
