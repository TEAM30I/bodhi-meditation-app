
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  onClose?: () => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ value, onChange, onClose }) => {
  const increment = () => {
    if (value < 10) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">인원 수</h3>
        {onClose && (
          <button 
            className="text-gray-400 text-sm"
            onClick={onClose}
          >
            닫기
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <p>성인</p>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={value <= 1}
            className="h-8 w-8 rounded-full"
          >
            <Minus size={16} />
          </Button>
          <span className="mx-4 w-8 text-center">{value}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            disabled={value >= 10}
            className="h-8 w-8 rounded-full"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-gray-900 hover:bg-black text-white"
          onClick={onClose}
        >
          완료
        </Button>
      </div>
    </div>
  );
};

export default GuestSelector;
