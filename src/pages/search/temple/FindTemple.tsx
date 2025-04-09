
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Home, ChevronRight, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import TempleItem from '@/components/search/TempleItem';
import { typedData } from '@/utils/typeUtils';
import { temples, getTempleList } from '/public/data/templeData/templeRepository';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allTemples = typedData(getTempleList());
  const nearbyTemples = allTemples.slice(0, 2); // Just showing 2 for nearby
  const popularTemples = allTemples.slice(0, 4); // Just showing 4 for popular
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchTerm}`);
  };
  
  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/TempleDetail?id=${id}`);
  };
  
  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">사찰</h1>
          </div>
          <button onClick={() => navigate('/')}>
            <Home className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="px-4 pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="도시, 지역, 사찰명"
              className="w-full pl-10 pr-4 py-2 rounded-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </form>
      </div>
      
      <div className="max-w-[480px] mx-auto px-4 py-6">
        {/* 가까운 사찰 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">가까운 사찰</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => navigate('/search/temple/results?nearby=true')}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {nearbyTemples.map(temple => (
              <div 
                key={temple.id} 
                className="bg-gray-200 rounded-lg h-[120px] relative overflow-hidden cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <img 
                  src={temple.imageUrl} 
                  alt={temple.name} 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white font-medium">{temple.name}</h3>
                  <p className="text-white text-xs opacity-80">{temple.location} • {temple.direction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 많이 찾는 사찰 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">많이 찾는 사찰</h2>
            <button 
              className="text-sm text-gray-500 flex items-center"
              onClick={() => navigate('/search/temple/results?popular=true')}
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mb-3 flex overflow-x-auto py-2 scrollbar-hide gap-2">
            {['서울', '경주', '부산', '속초', '안동', '제주'].map(region => (
              <span 
                key={region} 
                className={`inline-block px-3 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap ${
                  region === '서울' ? 'bg-[#DE7834] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => navigate(`/search/temple/results?region=${region}`)}
              >
                {region}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {popularTemples.map(temple => (
              <div 
                key={temple.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                onClick={() => handleTempleClick(temple.id)}
              >
                <div className="relative h-[100px]">
                  <img 
                    src={temple.imageUrl} 
                    alt={temple.name} 
                    className="w-full h-full object-cover"
                  />
                  {temple.likeCount && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>{temple.likeCount || 4.5}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm">{temple.name}</h3>
                  <p className="text-gray-500 text-xs">{temple.location} • {temple.direction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTemple;
