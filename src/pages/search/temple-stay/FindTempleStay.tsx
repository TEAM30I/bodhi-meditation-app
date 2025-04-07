
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { locations, secondLocations, templeStays } from '@/data/templeStayRepository';
import BottomNav from '@/components/BottomNav';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState("seoul");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/temple-stay/results?query=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button 
            onClick={() => navigate('/main')}
            className="text-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">템플스테이</h1>
          <button 
            onClick={() => navigate('/main')}
            className="text-gray-800"
          >
            <Home size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-9 bg-gray-100 border-none focus-visible:ring-0"
              placeholder="도시, 지역, 지하철역"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Date and People Selection */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 flex-1 mr-2">
            <span className="text-xs">3.21 금 - 3.2 토</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 flex-1">
            <span className="text-xs">성인 2, 아동 0</span>
          </div>
        </div>

        {/* Latest Temple Stay Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold">최신 템플스테이</h2>
              <p className="text-xs text-gray-500">3.21(금) - 3.22(토)</p>
            </div>
            <button
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => navigate('/search/temple-stay/results')}
            >
              더보기 &gt;
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
            {locations.map((location, index) => (
              <Badge
                key={index}
                variant={location.active ? "default" : "outline"}
                className={`whitespace-nowrap ${location.active ? "bg-bodhi-orange hover:bg-bodhi-orange" : "text-gray-500"}`}
              >
                {location.name}
              </Badge>
            ))}
          </div>

          {/* Temple Stay List */}
          <div className="grid grid-cols-2 gap-4">
            {templeStays.slice(0, 2).map((stay) => (
              <div key={stay.id} className="cursor-pointer" onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden relative">
                  <img 
                    src={stay.imageUrl} 
                    alt={stay.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                    <Star className="w-3 h-3 mr-0.5 text-black" />
                    <span className="text-xs font-bold">{stay.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <h3 className="text-sm font-bold">{stay.name}</h3>
                <p className="text-sm font-bold">{stay.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-500">총 {stay.duration} (세금 포함)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Temple Journey Section */}
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold">지친 마음을 쉬게 하는 산사 여행</h2>
              <p className="text-xs text-gray-500">3.21(금) - 3.22(토)</p>
            </div>
            <button
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => navigate('/search/temple-stay/results')}
            >
              더보기 &gt;
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
            {secondLocations.map((location, index) => (
              <Badge
                key={index}
                variant={location.active ? "default" : "outline"}
                className={`whitespace-nowrap ${location.active ? "bg-bodhi-orange hover:bg-bodhi-orange" : "text-gray-500"}`}
              >
                {location.name}
              </Badge>
            ))}
          </div>

          {/* Temple Stay List */}
          <div className="grid grid-cols-2 gap-4">
            {templeStays.slice(0, 2).map((stay) => (
              <div key={stay.id + '-2'} className="cursor-pointer" onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}>
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden relative">
                  <img 
                    src={stay.imageUrl} 
                    alt={stay.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                    <Star className="w-3 h-3 mr-0.5 text-black" />
                    <span className="text-xs font-bold">{stay.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <h3 className="text-sm font-bold">{stay.name}</h3>
                <p className="text-sm font-bold">{stay.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-500">총 {stay.duration} (세금 포함)</p>
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
