import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { regionTags, getTempleList } from "../../../data/templeData";
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState(['seoul']);
  
  // Get temple data from the repository
  const allTemples = getTempleList();
  
  const handleTagClick = (tagId: string) => {
    if (tagId === 'all') {
      setSelectedTags([]);
    } else if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
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

  const handleTempleClick = (templeId: string) => {
    navigate(`/search/temple/detail/${templeId}`);
  };

  // Get the nearby temples - assuming the first few temples as nearby for demo
  const nearbyTemplesDisplay = allTemples.slice(0, 4);
  
  // Get the popular temples - sort by likeCount for popular temples
  const popularTemples = [...allTemples]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, 4);

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
          <h1 className="text-lg font-bold flex-1 text-center">사찰</h1>
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
              className="pl-10 bg-[#F5F5F5] border border-[#2196F3] focus-visible:ring-0 rounded-lg"
              placeholder="도시, 지역, 사찰명"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Nearby Temples */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">가까운 사찰</h2>
            <button 
              onClick={() => navigate('/search/temple/results?query=nearby')}
              className="text-sm text-gray-500"
            >
              더보기 &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {nearbyTemplesDisplay.map(temple => (
              <div 
                key={temple.id} 
                className="cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={temple.imageUrl}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm mt-2">{temple.name}</h3>
                <p className="text-xs text-gray-500">{temple.location}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Regional Filters */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">많이 찾는 사찰</h2>
            <button 
              onClick={() => navigate('/search/temple/results')}
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
            {popularTemples.map(temple => (
              <div 
                key={temple.id} 
                className="cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={temple.imageUrl}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm mt-2">{temple.name}</h3>
                <p className="text-xs text-gray-500">{temple.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  {temple.rating && (
                    <span className="flex items-center gap-1 bg-[#FFC83B] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      ★ {temple.rating}
                    </span>
                  )}
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
