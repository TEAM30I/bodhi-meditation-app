import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScriptureSearchProps {
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  results: { index: number; text: string }[];
  currentIndex: number;
  onNavigate: (direction: 'next' | 'prev') => void;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const ScriptureSearch: React.FC<ScriptureSearchProps> = ({
  query,
  onQueryChange,
  results,
  currentIndex,
  onNavigate,
  onClose,
  theme = 'light'
}) => {
  return (
    <div 
      className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
        >
          <ChevronLeft size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={query}
          onChange={onQueryChange}
          className={`flex-1 p-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
          }`}
          autoFocus
        />
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onNavigate('prev')}
            disabled={results.length === 0}
            className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ${results.length === 0 ? 'opacity-50' : ''}`}
          >
            <ChevronLeft size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
          <button 
            onClick={() => onNavigate('next')}
            disabled={results.length === 0}
            className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} ${results.length === 0 ? 'opacity-50' : ''}`}
          >
            <ChevronRight size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
          </button>
          <span className={theme === 'dark' ? 'text-white' : 'text-black'}>
            {results.length > 0 ? `${currentIndex + 1}/${results.length}` : '0/0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScriptureSearch;
