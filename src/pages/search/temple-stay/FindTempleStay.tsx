
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Home } from 'lucide-react';
import { templeStays, locations, nearbyTempleStays } from '@/data/templeStayData';
import BottomNav from "@/components/BottomNav";

interface LocationTag {
  id: string;
  name: string;
  active: boolean;
}

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Convert locations to have id property
  const locationTags: LocationTag[] = locations.map(loc => ({
    id: loc.name.toLowerCase(),
    name: loc.name,
    active: loc.active
  }));

  const handleLocationClick = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter(id => id !== locationId));
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
    }
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

  const handleTempleStayClick = (templeStayId: string) => {
    navigate(`/search/temple-stay/detail/${templeStayId}`);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <button 
          onClick={() => navigate('/search')}
          className="text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">템플스테이 찾기</h1>
        <button 
          onClick={() => navigate('/main')}
          className="text-gray-800"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
      
      {/* Search Input */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            className="pl-10 bg-gray-100 border-0 focus-visible:ring-1"
            placeholder="템플스테이 이름, 지역명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#DE7834] h-8 text-white"
            onClick={handleSearch}
          >
            검색
          </Button>
        </div>
      </div>
      
      {/* Location Tags */}
      <div className="px-6 mb-6 overflow-x-auto">
        <div className="flex gap-2 flex-wrap">
          {locationTags.map(location => (
            <Badge
              key={location.id}
              variant={selectedLocations.includes(location.id) ? "default" : "outline"}
              className={`rounded-full px-4 py-1 cursor-pointer mb-2 ${
                selectedLocations.includes(location.id)
                  ? 'bg-[#DE7834] hover:bg-[#DE7834] text-white border-[#DE7834]'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black'
              }`}
              onClick={() => handleLocationClick(location.id)}
            >
              {location.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Nearby Temple Stays */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold mb-4">가까운 템플스테이</h2>
        <div className="grid grid-cols-2 gap-4">
          {nearbyTempleStays.map(templeStay => (
            <div 
              key={templeStay.id} 
              className="cursor-pointer"
              onClick={() => handleTempleStayClick(templeStay.id)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={templeStay.imageUrl}
                  alt={templeStay.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-sm mt-2">{templeStay.name}</h3>
              <p className="text-xs text-gray-500">{templeStay.location}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Popular Temple Stays */}
      <div className="px-6">
        <h2 className="text-lg font-bold mb-4">인기 템플스테이</h2>
        <div className="grid grid-cols-2 gap-4">
          {templeStays.slice(0, 4).map(templeStay => (
            <div 
              key={templeStay.id} 
              className="cursor-pointer"
              onClick={() => handleTempleStayClick(templeStay.id)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={templeStay.imageUrl}
                  alt={templeStay.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-sm mt-2">{templeStay.name}</h3>
              <p className="text-xs text-gray-500">{templeStay.location}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default FindTempleStay;
