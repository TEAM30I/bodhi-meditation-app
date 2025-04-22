
import React from 'react';

interface TempleStayMapProps {
  latitude: number;
  longitude: number;
}

const TempleStayMap: React.FC<TempleStayMapProps> = ({ latitude, longitude }) => {
  // This is a simple placeholder for a map component
  // In a real application, you would integrate with a map service like Google Maps, Kakao Maps, etc.
  
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="text-center mb-2 text-gray-600 text-sm">위치 정보</div>
      <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="font-medium">지도 위치</div>
          <div className="text-sm text-gray-600">위도: {latitude}</div>
          <div className="text-sm text-gray-600">경도: {longitude}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        * 실제 지도 연동은 추후 구현 예정입니다.
      </div>
    </div>
  );
};

export default TempleStayMap;
