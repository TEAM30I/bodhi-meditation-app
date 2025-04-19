
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { temples } from '@/utils/repository';

const SearchResults = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'nearby' | 'distance'>('nearby');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-10">
        <div className="flex items-center gap-3 p-4 border-b">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <Input
              value="서울"
              className="pl-9 pr-8 py-2 bg-[#F5F5F5] rounded-full"
              placeholder="사찰 검색"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button onClick={() => navigate('/main')}>
            <Home className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-2 gap-2">
          <Button
            variant={activeTab === 'nearby' ? 'default' : 'outline'}
            onClick={() => setActiveTab('nearby')}
            className={`rounded-full px-4 ${activeTab === 'nearby' ? 'bg-[#DE7834]' : ''}`}
          >
            추천순
          </Button>
          <Button
            variant={activeTab === 'distance' ? 'default' : 'outline'}
            onClick={() => setActiveTab('distance')}
            className={`rounded-full px-4 ${activeTab === 'distance' ? 'bg-[#DE7834]' : ''}`}
          >
            거리순
          </Button>
        </div>
      </div>

      {/* Temple List */}
      <div className="pt-28 pb-20">
        {temples.map((temple) => (
          <div 
            key={temple.id}
            className="p-4 border-b cursor-pointer"
            onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
          >
            <div className="flex gap-4">
              <img
                src={temple.imageUrl}
                alt={temple.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{temple.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{temple.location}</p>
                <p className="text-sm text-gray-400 mt-2">도보 10분</p>
                {temple.tags && (
                  <div className="flex gap-1 mt-2">
                    {temple.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
