
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterButtonsProps {
  activeFilter: 'popular' | 'recent';
  onFilterChange: (filter: 'popular' | 'recent') => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeFilter === 'popular' ? 'default' : 'outline'}
        onClick={() => onFilterChange('popular')}
        className={activeFilter === 'popular' ? 'bg-[#DE7834]' : 'bg-white'}
        size="sm"
      >
        인기순
      </Button>
      <Button
        variant={activeFilter === 'recent' ? 'default' : 'outline'}
        onClick={() => onFilterChange('recent')}
        className={activeFilter === 'recent' ? 'bg-[#DE7834]' : 'bg-white'}
        size="sm"
      >
        최신순
      </Button>
    </div>
  );
};

export default FilterButtons;
