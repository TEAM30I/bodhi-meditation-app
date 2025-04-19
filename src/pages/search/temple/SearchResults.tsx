
import React from 'react';
import { useTempleSearch } from '@/hooks/useTempleSearch';
import SearchResultsHeader from '@/components/search/temple/SearchResultsHeader';
import SearchResultsFilters from '@/components/search/temple/SearchResultsFilters';
import SearchResultsList from '@/components/search/temple/SearchResultsList';

const SearchResults = () => {
  const {
    searchValue,
    setSearchValue,
    temples,
    activeFilter,
    setActiveFilter,
    loading,
    handleSearchSubmit,
    handleSearch,
    handleTempleClick
  } = useTempleSearch();

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-16">
      <SearchResultsHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => setSearchValue('')}
        onSearch={handleSearch}
      />
      
      <div className="max-w-[480px] mx-auto px-5 py-3">
        <SearchResultsFilters
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
