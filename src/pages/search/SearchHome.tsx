import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { regionSearchRankings } from '/public/data/searchRankingRepository';

const SearchHome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="사찰 또는 지역 검색"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-[#F5F5F5] border-none"
              onClick={() => navigate('/search/temple/results?query=')}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-5 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">인기 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {regionSearchRankings.map((ranking) => (
              <Badge key={ranking.id} variant="secondary" className="rounded-full cursor-pointer">
                {ranking.term}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">테마별 사찰</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/search/temple" className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-start">
              <MapPin className="h-5 w-5 text-[#DE7834] mb-2" />
              <span className="text-sm font-medium text-gray-800">지역별 사찰</span>
              <span className="text-xs text-gray-500 mt-1">가까운 사찰을 찾아보세요</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-3" />
            </Link>

            <Link to="/search/temple-stay" className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-start">
              <Calendar className="h-5 w-5 text-[#DE7834] mb-2" />
              <span className="text-sm font-medium text-gray-800">템플스테이</span>
              <span className="text-xs text-gray-500 mt-1">휴식과 치유를 경험하세요</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-3" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">급상승 검색어</h2>
          <ul>
            {regionSearchRankings.slice(0, 3).map((ranking) => (
              <li key={ranking.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-none">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-800">{ranking.term}</span>
                </div>
                <span className="text-xs text-gray-500">{ranking.count}회 검색</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchHome;
