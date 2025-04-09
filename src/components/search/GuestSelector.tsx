
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface GuestSelectorProps {
  value: { adults: number; children: number };
  onChange: (value: { adults: number; children: number }) => void;
  onClose?: () => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ 
  value, 
  onChange, 
  onClose 
}) => {
  const handleIncrease = (type: 'adults' | 'children') => {
    const newValue = {...value};
    if (type === 'adults') {
      newValue.adults = Math.min(10, newValue.adults + 1);
    } else {
      newValue.children = Math.min(10, newValue.children + 1);
    }
    onChange(newValue);
  };

  const handleDecrease = (type: 'adults' | 'children') => {
    const newValue = {...value};
    if (type === 'adults') {
      newValue.adults = Math.max(1, newValue.adults - 1);
    } else {
      newValue.children = Math.max(0, newValue.children - 1);
    }
    onChange(newValue);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-6">투숙객</h3>
        
        <div className="space-y-6">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">성인</p>
              <p className="text-sm text-gray-500">만 18세 이상</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleDecrease('adults')}
                disabled={value.adults <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <span className="w-5 text-center">{value.adults}</span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleIncrease('adults')}
                disabled={value.adults >= 10}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">어린이</p>
              <p className="text-sm text-gray-500">만 17세 이하</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleDecrease('children')}
                disabled={value.children <= 0}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <span className="w-5 text-center">{value.children}</span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleIncrease('children')}
                disabled={value.children >= 10}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {onClose && (
        <Button 
          className="w-full"
          onClick={onClose}
        >
          확인
        </Button>
      )}
    </div>
  );
};

export default GuestSelector;
