
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Home } from 'lucide-react';
import { nearbyTemples, regionTags } from '@/data/templeData';
import { temples } from '@/data/templeRepository'; // Fixed import
import BottomNav from '@/components/BottomNav';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState(['seoul']);

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
        <h1 className="text-lg font-bold flex-1 text-center">사찰 찾기</h1>
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
            placeholder="사찰 이름, 지역명으로 검색"
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
      
      {/* Region Tags */}
      <div className="px-6 mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {regionTags.map(tag => (
            <Button
              key={tag.id}
              variant="outline"
              className={`rounded-full px-4 py-1 h-auto ${
                tag.id === 'all' && selectedTags.length === 0 || selectedTags.includes(tag.id)
                  ? 'bg-[#DE7834] text-white border-[#DE7834]'
                  : 'bg-white text-black border-gray-300'
              }`}
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Nearby Temples */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold mb-4">가까운 사찰</h2>
        <div className="grid grid-cols-2 gap-4">
          {nearbyTemples.map(temple => (
            <div 
              key={temple.id} 
              className="cursor-pointer"
              onClick={() => handleTempleClick(temple.id)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
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
      
      {/* Popular Temples */}
      <div className="px-6">
        <h2 className="text-lg font-bold mb-4">인기 사찰</h2>
        <div className="grid grid-cols-2 gap-4">
          {temples.slice(0, 4).map(temple => (
            <div 
              key={temple.id} 
              className="cursor-pointer"
              onClick={() => handleTempleClick(temple.id)}
            >
              <div className="aspect-square rounded-lg overflow-hidden">
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
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default FindTemple;
