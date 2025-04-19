
import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TempleInfoSectionProps {
  temple: {
    address: string;
    description: string;
    contact: string;
  };
}

const TempleInfoSection = ({ temple }: TempleInfoSectionProps) => {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
        <MapPin size={14} className="text-gray-500" />
        <span>{temple.address}</span>
      </div>
      
      {temple.description && (
        <p className="text-gray-700 text-sm mb-4">{temple.description}</p>
      )}

      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => window.open(`https://map.kakao.com/link/search/${temple.address}`, '_blank')}
          className="flex-1 py-2 bg-[#DE7834] text-white rounded-lg text-sm font-medium"
        >
          길찾기
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(temple.address);
            toast({ title: "주소가 복사되었습니다." });
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          주소복사
        </button>
      </div>

      {temple.contact && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Globe size={14} className="text-gray-500" />
          <span>{temple.contact}</span>
        </div>
      )}
    </div>
  );
};

export default TempleInfoSection;
