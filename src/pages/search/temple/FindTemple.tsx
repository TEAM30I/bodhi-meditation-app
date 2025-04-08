
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { temples } from '@/data/templeRepository';
import { regionTags, nearbyTemples } from '@/data/templeData';
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string>(
    regionTags.find(region => region.active)?.id || "seoul"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter temples by region
  const filteredTemples = temples.filter(temple => {
    if (activeRegion === "all") return true;
    return temple.location.toLowerCase().includes(
      regionTags.find(r => r.id === activeRegion)?.name.toLowerCase() || ""
    );
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/temple/results?query=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRegionChange = (regionId: string) => {
    setActiveRegion(regionId);
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
          <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
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

        {/* Nearby Temples Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">가까운 사찰</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {nearbyTemples.map((temple) => (
              <div 
                key={temple.id} 
                className="cursor-pointer" 
                onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
              >
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500">{temple.location} · {temple.distance}</p>
                <h3 className="text-sm font-bold">{temple.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Temples Section */}
        <div className="px-4 pb-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">많이 찾는 사찰</h2>
            <button
              className="text-xs text-gray-500 p-0 h-auto"
              onClick={() => navigate('/search/temple/results')}
            >
              더보기 &gt;
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
            {regionTags.map((region) => (
              <Badge
                key={region.id}
                variant={activeRegion === region.id ? "default" : "outline"}
                className={`whitespace-nowrap cursor-pointer ${
                  activeRegion === region.id 
                    ? "bg-bodhi-orange hover:bg-bodhi-orange" 
                    : "text-gray-500"
                }`}
                onClick={() => handleRegionChange(region.id)}
              >
                {region.name}
              </Badge>
            ))}
          </div>

          {/* Temples List */}
          <div className="grid grid-cols-2 gap-4">
            {filteredTemples.slice(0, 4).map((temple) => (
              <div 
                key={temple.id} 
                className="cursor-pointer" 
                onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
              >
                <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500">{temple.location}</p>
                <h3 className="text-sm font-bold">{temple.name}</h3>
                {temple.tags && (
                  <p className="text-xs text-gray-500">
                    {temple.tags.slice(0, 2).map(tag => `#${tag}`).join(' ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default FindTemple;
