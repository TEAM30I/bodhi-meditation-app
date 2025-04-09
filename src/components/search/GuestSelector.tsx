
import React, { Dispatch, SetStateAction } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface GuestSelectorProps {
  value: { adults: number; children: number };
  onChange: (value: { adults: number; children: number }) => void;
  adults?: number;
  children?: number;
  onAdultsChange?: Dispatch<SetStateAction<number>>;
  onChildrenChange?: Dispatch<SetStateAction<number>>;
  onClose?: () => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ 
  value, 
  onChange, 
  adults, 
  children, 
  onAdultsChange, 
  onChildrenChange, 
  onClose 
}) => {
  // Use either the controlled (value+onChange) or uncontrolled (direct state setters) approach
  const adultCount = adults !== undefined ? adults : value.adults;
  const childCount = children !== undefined ? children : value.children;

  const handleAdultsChange = (count: number) => {
    const newCount = Math.max(1, count); // At least one adult

    if (onAdultsChange) {
      onAdultsChange(newCount);
    } else {
      onChange({ ...value, adults: newCount });
    }
  };

  const handleChildrenChange = (count: number) => {
    const newCount = Math.max(0, count); // Children can be zero

    if (onChildrenChange) {
      onChildrenChange(newCount);
    } else {
      onChange({ ...value, children: newCount });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium">인원 선택</h3>
        <p className="text-sm text-gray-500">여행에 참여하는 인원을 선택하세요</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">성인</p>
            <p className="text-sm text-gray-500">만 18세 이상</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleAdultsChange(adultCount - 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                adultCount <= 1 ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700'
              }`}
              disabled={adultCount <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="mx-4 min-w-8 text-center">{adultCount}</span>
            <button
              onClick={() => handleAdultsChange(adultCount + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">아동</p>
            <p className="text-sm text-gray-500">만 18세 미만</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleChildrenChange(childCount - 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                childCount <= 0 ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700'
              }`}
              disabled={childCount <= 0}
            >
              <Minus size={16} />
            </button>
            <span className="mx-4 min-w-8 text-center">{childCount}</span>
            <button
              onClick={() => handleChildrenChange(childCount + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#DE7834] hover:bg-[#C96E2E] text-white font-medium rounded"
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;
