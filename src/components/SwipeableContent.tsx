import React from 'react';

interface SwipeableContentProps {
  title: string;
  items: Array<{
    id: string;
    name: string;
    onClick: () => void;
  }>;
  onTitleClick?: () => void;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  title,
  items,
  onTitleClick
}) => {
  return (
    <div className="mb-8">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer px-6" 
        onClick={onTitleClick}
      >
        <h2 className="font-semibold text-lg">{title}</h2>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-gray-600"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex gap-3 px-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="min-w-[120px] h-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                onClick={item.onClick}
              >
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  <p className="text-xs">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeableContent; 