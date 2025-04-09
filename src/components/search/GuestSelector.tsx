
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
  onClose?: () => void;
  // Add these props for backward compatibility
  adults?: number;
  children?: number;
  onAdultsChange?: (value: number) => void;
  onChildrenChange?: (value: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ 
  value, 
  onChange, 
  onClose,
  adults,
  children,
  onAdultsChange,
  onChildrenChange
}) => {
  // Handle both direct value/onChange and adults/onAdultsChange patterns
  const actualValue = typeof adults === 'number' ? adults : value;
  
  const handleIncrement = () => {
    if (actualValue < 10) {
      const newValue = actualValue + 1;
      onChange?.(newValue);
      onAdultsChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (actualValue > 1) {
      const newValue = actualValue - 1;
      onChange?.(newValue);
      onAdultsChange?.(newValue);
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
            onClick={handleDecrement}
            disabled={actualValue <= 1}
            className="h-8 w-8 rounded-full"
          >
            <Minus size={16} />
          </Button>
          <span className="mx-4 w-8 text-center">{actualValue}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={actualValue >= 10}
            className="h-8 w-8 rounded-full"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      {children !== undefined && onChildrenChange && (
        <div className="flex items-center justify-between mt-4">
          <p>어린이</p>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChildrenChange(Math.max(0, children - 1))}
              disabled={children <= 0}
              className="h-8 w-8 rounded-full"
            >
              <Minus size={16} />
            </Button>
            <span className="mx-4 w-8 text-center">{children}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChildrenChange(Math.min(5, children + 1))}
              disabled={children >= 5}
              className="h-8 w-8 rounded-full"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      )}
      
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
