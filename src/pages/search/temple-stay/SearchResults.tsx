import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { searchTempleStays } from '@/lib/repository';
import { TempleStay, TempleStaySort } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TempleStayItem from '@/components/search/temple-stay/TempleStayItem';
import PageLayout from '@/components/PageLayout';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TempleStaySort>('popular');
  const [searchValue, setSearchValue] = useState('');
  
  // URL 쿼리 파라미터 가져오기
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const nearby = queryParams.get('nearby') === 'true';
  const isRegion = queryParams.get('isRegion') === 'true';
  const sortByParam = queryParams.get('sort') as TempleStaySort || 'popular';
  
  // 현재 활성화된 탭 (temple 또는 temple-stay)
  const isTempleStayTab = location.pathname.includes('temple-stay');

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
  
  const [sortBy, setSortBy] = useState<TempleStaySort>(sortByParam);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 검색어 유무와 관계없이 searchTempleStays 함수만 사용
        const results = await searchTempleStays(query, sortByParam);
        setTempleStays(results);
        setActiveFilter(sortByParam);
      } catch (error) {
        console.error('Error fetching temple stays:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, sortByParam]);
  
  const handleFilterChange = (newFilter: TempleStaySort) => {
    setActiveFilter(newFilter);
    
    // URL 업데이트
    const params = new URLSearchParams(location.search);
    params.set('sort', newFilter);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/temple-stay/results?query=${searchValue}`);
  };
  
  const title = query 
    ? `'${query}' 검색 결과` 
    : '검색 결과';
  
  return (
    <PageLayout 
      title="템플스테이 찾기" 
      showBackButton 
      onBackButtonClick={() => navigate(-1)}
    >
      <div className="p-4">
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={!isTempleStayTab ? 'default' : 'outline'}
            className={`flex-1 ${!isTempleStayTab ? 'bg-[#DE7834]' : ''}`}
            onClick={handleTempleTab}
          >
            사찰
          </Button>
          <Button
            variant={isTempleStayTab ? 'default' : 'outline'}
            className={`flex-1 ${isTempleStayTab ? 'bg-[#DE7834]' : ''}`}
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
            placeholder="사찰명, 템플스테이명 또는 지역으로 검색"
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </form>
        
        {/* 검색 결과 타이틀 */}
        {(query || nearby) && (
          <h2 className="font-semibold text-lg mb-4">{title}</h2>
        )}
        
        {/* 정렬 옵션 */}
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeFilter} onValueChange={handleFilterChange} className="w-full">
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="popular">인기순</TabsTrigger>
              <TabsTrigger value="price_low">가격낮은순</TabsTrigger>
              <TabsTrigger value="price_high">가격높은순</TabsTrigger>
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
            {templeStays.length ? (
              templeStays.map((ts) => (
                <TempleStayItem
                  key={ts.id}
                  templeStay={{
                    ...ts,
                    // 템플스테이 정보가 완전하게 표시되도록 보장
                    templeName: (ts as any).temple_name || (ts as any).name || ts.templeName,
                    location: ts.temple?.address || ts.location || '주소 정보 없음',
                    price: typeof ts.price === 'number' ? ts.price : 
                           (typeof ts.price === 'string' ? parseInt((ts.price as string).replace(/[^\d]/g, '') || '0') : 0)
                  }}
                  onClick={() => navigate(`/search/temple-stay/detail/${ts.id}`)}
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