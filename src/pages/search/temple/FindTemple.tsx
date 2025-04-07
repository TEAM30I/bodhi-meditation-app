
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { nearbyTemples, popularTemples, regionTags } from '@/data/templeData';
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState("seoul");
  const [searchQuery, setSearchQuery] = useState("");

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

        {/* Nearby Temples */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-base">가까운 사찰</h2>
            <button 
              className="text-xs text-gray-500"
              onClick={() => navigate('/search/temple/results?query=nearby')}
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {nearbyTemples.map(temple => (
              <div key={temple.id} className="cursor-pointer" onClick={() => navigate(`/search/temple/detail/${temple.id}`)}>
                <div className="bg-gray-200 aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-1">
                  <p className="text-sm font-medium">{temple.name}</p>
                  <p className="text-xs text-gray-500">
                    {temple.location} • {temple.distance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Temples */}
        <div className="px-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-base">많이 찾는 사찰</h2>
            <button 
              className="text-xs text-gray-500"
              onClick={() => navigate('/search/temple/results')}
            >
              더보기 &gt;
            </button>
          </div>

          {/* Region Tags */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
            {regionTags.map(tag => (
              <Badge
                key={tag.id}
                variant={tag.id === activeRegion ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  tag.id === activeRegion ? "bg-bodhi-orange hover:bg-bodhi-orange" : "text-gray-500"
                }`}
                onClick={() => setActiveRegion(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Temple Grid */}
          <div className="grid grid-cols-2 gap-4">
            {popularTemples.map(temple => (
              <div key={temple.id} className="cursor-pointer mb-4" onClick={() => navigate(`/search/temple/detail/${temple.id}`)}>
                <div className="bg-gray-200 aspect-square rounded-lg overflow-hidden relative">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                  {temple.rating && (
                    <div className="absolute left-2 bottom-2 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center">
                      <Star className="w-3 h-3 mr-0.5 text-black" />
                      <span className="text-xs font-bold">{temple.rating}</span>
                    </div>
                  )}
                </div>
                <div className="mt-1">
                  <p className="text-sm font-medium">{temple.name}</p>
                  <p className="text-xs text-gray-500">{temple.location}</p>
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

export default FindTemple;
