
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, ChevronRight, X, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { regionTags } from '/public/data/templeData/templeRepository';
import { regionSearchRankings } from '/public/data/searchRankingRepository';

const FindTemple = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Input
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="사찰 검색"
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F5F5F5] border-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchValue && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        <h2 className="text-lg font-bold mb-4">어떤 사찰을 찾고 있나요?</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            가까운 사찰
          </h3>
          <Button
            variant="outline"
            className="w-full justify-start space-x-2"
            onClick={() => navigate('/nearby')}
          >
            <MapPin className="h-4 w-4" />
            <span>내 주변 사찰 찾기</span>
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            지역별 사찰
          </h3>
          <div className="flex flex-wrap gap-2">
            {regionTags.map((tag) => (
              <Link
                to={`/search/temple/results?region=${tag.id}`}
                key={tag.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  tag.active
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            인기 검색어
          </h3>
          <div className="flex flex-col gap-2">
            {regionSearchRankings.map((ranking) => (
              <Link
                to={`/search/temple/results?query=${ranking.term}`}
                key={ranking.id}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{ranking.term}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">{ranking.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTemple;
