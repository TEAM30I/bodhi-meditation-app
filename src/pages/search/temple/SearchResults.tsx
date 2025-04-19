
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { searchTemples, type Temple } from '@/utils/repository';
import { typedData } from '@/utils/typeUtils';
import SearchHeader from '@/components/search/temple/SearchHeader';
import FilterButtons from '@/components/search/temple/FilterButtons';
import SearchResultsList from '@/components/search/temple/SearchResultsList';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const region = searchParams.get('region') || '';
  const nearby = searchParams.get('nearby') === 'true';
  
  const [searchValue, setSearchValue] = useState(query || region);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [activeFilter, setActiveFilter] = useState<'popular' | 'recent'>('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const searchTerm = query || region;
    if (searchTerm) {
      const results = searchTemples(searchTerm);
      setTemples(typedData<Temple[]>(results));
    } else if (nearby) {
      const results = searchTemples("");
      setTemples(typedData<Temple[]>(results));
    } else {
      setTemples([]);
    }
    setLoading(false);
  }, [query, region, nearby]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/temple/results?query=${searchValue}`);
  };

  const handleSearch = () => navigate(`/search/temple/results?query=${searchValue}`);
  
  const handleTempleClick = (id: string) => {
    navigate(`/search/temple/detail/${id}`);
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <SearchHeader
        searchValue={searchValue}
        onSearchChange={(value) => setSearchValue(value)}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => setSearchValue('')}
        onSearch={handleSearch}
      />
      
      <div className="max-w-[480px] mx-auto px-5 py-3">
        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <SearchResultsList
          loading={loading}
          temples={temples}
          onTempleClick={handleTempleClick}
        />
      </div>
    </div>
  );
};

export default SearchResults;
