
import React from 'react';
import { Bus, Car, Train } from 'lucide-react';

interface TransportationSectionProps {
  transportInfo?: {
    subway?: string[];
    bus?: string[];
    car?: string;
  };
}

const TransportationSection = ({ transportInfo }: TransportationSectionProps) => {
  if (!transportInfo) return null;

  return (
    <div className="px-5 py-4 border-t border-[#E5E5EC]">
      <div className="flex items-center space-x-2 mb-3">
        <Train size={20} className="text-gray-600" />
        <span className="font-medium text-gray-900">교통 안내</span>
      </div>

      {transportInfo.subway && transportInfo.subway.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">지하철</span>
          {transportInfo.subway.map((line, index) => (
            <p key={index} className="text-sm text-gray-600 mb-1">{line}</p>
          ))}
        </div>
      )}

      {transportInfo.bus && transportInfo.bus.length > 0 && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">버스</span>
          {transportInfo.bus.map((route, index) => (
            <p key={index} className="text-sm text-gray-600 mb-1">{route}</p>
          ))}
        </div>
      )}

      {transportInfo.car && (
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700 block mb-2">자가용</span>
          <p className="text-sm text-gray-600">{transportInfo.car}</p>
        </div>
      )}
    </div>
  );
};

export default TransportationSection;
