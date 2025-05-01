
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  onSearch: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  onSearch,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white sticky top-0 z-10 border-b border-[#E5E5EC]">
      <div className="max-w-[480px] mx-auto px-5 py-3 flex items-center space-x-4">
        <button onClick={() => navigate('/search')}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        <form onSubmit={onSearchSubmit} className="flex-1 relative">
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="사찰 검색"
            className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F5F5F5] border-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchValue && (
            <button 
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </form>
      </div>
      <Button
        className="w-full h-11 mb-4 bg-[#DE7834] hover:bg-[#c96b2e]"
        onClick={onSearch}
      >
        검색하기
      </Button>
    </div>
  );
};

export default SearchHeader;
