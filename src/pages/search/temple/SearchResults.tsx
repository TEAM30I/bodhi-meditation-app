import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTemples } from '@/lib/repository';
import { Temple, TempleSort } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TempleItem from '@/components/search/temple/TempleItem';
import PageLayout from '@/components/PageLayout';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<TempleSort>('popular');
  const [searchValue, setSearchValue] = useState('');
  
  // URL 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearby = queryParams.get('nearby') === 'true';
  const sortByParam = queryParams.get('sort') as TempleSort || 'popular';
  
  // 현재 활성화된 탭 (temple 또는 temple-stay)
  const isTempleTab = !location.pathname.includes('temple-stay');

  // 템플스테이 탭으로 이동
  const handleTempleStayTab = () => {
    navigate('/search/temple-stay');
  };

  // 사찰 탭으로 이동
  const handleTempleTab = () => {
    navigate('/search/temple');
  };
  
  // 검색어 초기화
  useEffect(() => {
    if (query) {
      setSearchValue(query);
    }
  }, [query]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 검색어 유무와 관계없이 searchTemples 함수만 사용
        const results = await searchTemples(query, sortByParam);
        setTemples(results);
        setSortBy(sortByParam);
      } catch (error) {
        console.error('Error fetching temples:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, sortByParam]);
  
  const handleSortChange = (newSort: TempleSort) => {
    setSortBy(newSort);
    
    // URL 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newSort);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };
  
  const title = query 
    ? `'${query}' 검색 결과` 
    : '검색 결과';
  
  // 지역 버튼 클릭 핸들러
  const handleRegionClick = (region: string) => {
    navigate(`/search/temple/results?query=${region}`);
  };
  
  return (
    <PageLayout 
      title="사찰 찾기" 
      showBackButton 
      onBackButtonClick={() => navigate(-1)}
    >
      <div className="p-4">
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={isTempleTab ? 'default' : 'outline'}
            className={`flex-1 ${isTempleTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleTab}
          >
            사찰
          </Button>
          <Button
            variant={!isTempleTab ? 'default' : 'outline'}
            className={`flex-1 ${!isTempleTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleStayTab}
          >
            템플스테이
          </Button>
        </div>
        
        {/* 검색창 추가 */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="사찰명 또는 지역으로 검색"
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </form>
        
        {/* 검색 결과 타이틀 */}
        {(query) && (
          <h2 className="font-semibold text-lg mb-4">{title}</h2>
        )}
        
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-4">
          <Tabs value={sortBy} onValueChange={handleSortChange} className="w-full">
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="popular">인기순</TabsTrigger>
              <TabsTrigger value="recent">최신순</TabsTrigger>
              <TabsTrigger value="distance">거리순</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" className="ml-2 flex-shrink-0">
            <Filter size={16} className="mr-1" />
            필터
          </Button>
        </div>
        
        {/* 검색 결과 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
          </div>
        ) : (
          <div>
            {temples.length ? (
              temples.map((temple) => (
                <TempleItem
                  key={temple.id}
                  temple={temple}
                  onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchResults;
