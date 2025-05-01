
import React from 'react';
import { CircleParking } from 'lucide-react';

interface ParkingInfoSectionProps {
  parkingInfo?: {
    fee?: string;
    type?: string;
    notice?: string;
  };
}

const ParkingInfoSection = ({ parkingInfo }: ParkingInfoSectionProps) => {
  if (!parkingInfo) return null;
  
  return (
    <div className="px-5 py-4 border-t border-[#E5E5EC]">
      <div className="flex items-center space-x-2 mb-3">
        <CircleParking size={20} className="text-gray-600" />
        <span className="font-medium text-gray-900">주차 안내</span>
      </div>
      
      {parkingInfo.fee && (
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">요금</span>
          <p className="text-sm text-gray-600">{parkingInfo.fee}</p>
        </div>
      )}

      {parkingInfo.type && (
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">유형</span>
          <p className="text-sm text-gray-600">{parkingInfo.type}</p>
        </div>
      )}

      {parkingInfo.notice && (
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">안내</span>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{parkingInfo.notice}</p>
        </div>
      )}
    </div>
  );
};

export default ParkingInfoSection;
