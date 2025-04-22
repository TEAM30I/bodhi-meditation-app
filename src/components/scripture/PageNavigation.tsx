
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageNavigationProps {
  theme: 'light' | 'dark';
  showControls: boolean;
  onPrevPage: (e: React.MouseEvent) => void;
  onNextPage: (e: React.MouseEvent) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  theme,
  showControls,
  onPrevPage,
  onNextPage,
  isFirstPage,
  isLastPage,
}) => {
  return (
    <div className={`fixed bottom-24 left-0 right-0 flex justify-center ${showControls ? '' : 'hidden'}`}>
      <div className="flex justify-between w-[270px]">
        <button 
          onClick={onPrevPage}
          className={`w-[53px] h-[53px] flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          disabled={isFirstPage}
        >
          <ChevronLeft size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        
        <button 
          onClick={onNextPage}
          className={`w-[53px] h-[53px] flex items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          disabled={isLastPage}
        >
          <ChevronRight size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
      </div>
    </div>
  );
};

export default PageNavigation;
