import React from 'react';

export interface GuestCount {
  adults: number;
  children: number;
}

export interface GuestSelectorProps {
  value: GuestCount;
  onChange: (guests: GuestCount) => void;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({ value, onChange }) => {
  const handleIncrement = (type: 'adults' | 'children') => {
    onChange({
      ...value,
      [type]: value[type] + 1
    });
  };

  const handleDecrement = (type: 'adults' | 'children') => {
    if (type === 'adults' && value.adults <= 1) return;
    if (type === 'children' && value.children <= 0) return;
    
    onChange({
      ...value,
      [type]: value[type] - 1
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-2 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium">성인</h4>
          <p className="text-sm text-gray-500">만 18세 이상</p>
        </div>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
            onClick={() => handleDecrement('adults')}
            disabled={value.adults <= 1}
          >
            <span className="text-lg">-</span>
          </button>
          <span className="mx-3 w-6 text-center">{value.adults}</span>
          <button 
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
            onClick={() => handleIncrement('adults')}
          >
            <span className="text-lg">+</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">어린이</h4>
          <p className="text-sm text-gray-500">만 18세 미만</p>
        </div>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
            onClick={() => handleDecrement('children')}
            disabled={value.children <= 0}
          >
            <span className="text-lg">-</span>
          </button>
          <span className="mx-3 w-6 text-center">{value.children}</span>
          <button 
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
            onClick={() => handleIncrement('children')}
          >
            <span className="text-lg">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};
