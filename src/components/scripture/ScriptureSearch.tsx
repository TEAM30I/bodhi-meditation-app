
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScriptureSearchProps {
  showSearch: boolean;
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  navigateSearchResult: (direction: 'next' | 'prev') => void;
  searchResults: Array<{ index: number; text: string }>;
  currentSearchIndex: number;
  theme: 'light' | 'dark';
}

const ScriptureSearch = ({
  showSearch,
  searchQuery,
  handleSearchQueryChange,
  navigateSearchResult,
  searchResults,
  currentSearchIndex,
  theme
}: ScriptureSearchProps) => {
  if (!showSearch) return null;

  return (
    <div 
      className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className={`flex-1 p-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
          }`}
          autoFocus
        />
        <button 
          onClick={() => navigateSearchResult('prev')}
          disabled={searchResults.length === 0}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
        >
          <ChevronLeft size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        <button 
          onClick={() => navigateSearchResult('next')}
          disabled={searchResults.length === 0}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
        >
          <ChevronRight size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        <span className={theme === 'dark' ? 'text-white' : 'text-black'}>
          {searchResults.length > 0 ? `${currentSearchIndex + 1}/${searchResults.length}` : '0/0'}
        </span>
      </div>
    </div>
  );
};

export default ScriptureSearch;
