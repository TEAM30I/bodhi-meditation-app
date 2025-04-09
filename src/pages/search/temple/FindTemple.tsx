
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Heart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getTempleList, getTopLikedTemples, regionTags } from '@/data/templeData';
import TempleItem from '@/components/search/TempleItem';
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('서울');
  
  // Get all temples
  const allTemples = getTempleList();
  
  // Get top liked temples
  const topLikedTemples = getTopLikedTemples(5);
  
  // Filter temples by region - for demo purposes
  const filteredTemples = allTemples.filter(temple => 
    temple.location.includes(selectedRegion)
  ).slice(0, 5);
  
  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
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
      <div className="w-full max-w-[480px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between h-[56px] px-5 border-b border-gray-100">
          <button 
            onClick={() => navigate('/search')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
        </div>
        
        {/* Search Input */}
        <div className="px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              className="pl-10 bg-[#F5F5F5] border-0 focus-visible:ring-0 rounded-lg"
              placeholder="사찰명, 지역명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Region Filters */}
        <div className="px-5 mb-6">
          <div className="flex overflow-x-auto pb-3 gap-2">
            {regionTags.map(tag => (
              <Badge 
                key={tag.id}
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto cursor-pointer whitespace-nowrap
                  ${tag.name === selectedRegion ? 'bg-[#FF8433] text-white border-[#FF8433]' : 'bg-white text-black border-gray-300'}`}
                onClick={() => handleRegionClick(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Popular Temples */}
        <div className="px-5 mb-8">
          <h2 className="text-lg font-bold mb-4">인기 있는 사찰</h2>
          
          {topLikedTemples.map((temple) => (
            <div
              key={temple.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer mb-4"
              onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={temple.imageUrl}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{temple.name}</h3>
                  <p className="text-sm text-gray-500">{temple.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge className="flex items-center gap-1 bg-pink-100 text-pink-600 font-normal text-xs">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>{temple.likeCount}</span>
                </Badge>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => navigate('/search/temple/results')}
            className="text-center text-blue-500 w-full py-2"
          >
            더보기
          </button>
        </div>
        
        {/* Regional Temples */}
        <div className="px-5">
          <h2 className="text-lg font-bold mb-4">{selectedRegion} 인근 사찰</h2>
          
          {filteredTemples.map((temple) => (
            <TempleItem key={temple.id} temple={temple} />
          ))}
          
          <button 
            onClick={() => navigate(`/search/temple/results?region=${selectedRegion}`)}
            className="text-center text-blue-500 w-full py-2"
          >
            더보기
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default FindTemple;
