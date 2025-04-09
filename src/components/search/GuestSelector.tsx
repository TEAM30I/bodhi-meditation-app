
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({ value, onChange }) => {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="bg-white rounded-lg p-4 mt-2 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">성인</span>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrease}
            disabled={value <= 1}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center">{value}</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleIncrease}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
