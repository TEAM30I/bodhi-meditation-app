
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { locations, templeStays, nearbyTempleStays } from '@/data/templeStayRepository';
import BottomNav from '@/components/BottomNav';

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string>(
    locations.find(location => location.active)?.name || "서울"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter temple stays by active region
  const filteredTempleStays = templeStays.filter(stay => 
    stay.location.includes(activeRegion)
  );

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

  const handleRegionChange = (regionName: string) => {
    setActiveRegion(regionName);
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button 
            onClick={() => navigate('/search')}
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

        {/* Nearby Temple Stays Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">가까운 템플스테이</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {nearbyTempleStays.map((stay) => (
              <div 
                key={stay.id} 
                className="cursor-pointer" 
                onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}
              >
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
                <p className="text-xs text-gray-500">{stay.location} · {stay.distance}</p>
                <h3 className="text-sm font-bold">{stay.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Temple Stays Section */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">많이 찾는 템플스테이</h2>
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
                variant={activeRegion === location.name ? "default" : "outline"}
                className={`whitespace-nowrap cursor-pointer ${
                  activeRegion === location.name 
                    ? "bg-bodhi-orange hover:bg-bodhi-orange" 
                    : "text-gray-500"
                }`}
                onClick={() => handleRegionChange(location.name)}
              >
                {location.name}
              </Badge>
            ))}
          </div>

          {/* Temple Stay List */}
          <div className="grid grid-cols-2 gap-4">
            {filteredTempleStays.slice(0, 4).map((stay) => (
              <div 
                key={stay.id} 
                className="cursor-pointer" 
                onClick={() => navigate(`/search/temple-stay/detail/${stay.id}`)}
              >
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
