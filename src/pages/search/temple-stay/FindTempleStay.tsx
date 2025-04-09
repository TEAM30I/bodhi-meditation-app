
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TempleStayItem from '@/components/search/TempleStayItem';
import { Badge } from "@/components/ui/badge";
import { locations, nearbyTempleStays } from "@/data/templeStayData";

const FindTempleStay = () => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  
  const handleLocationClick = (locationName: string) => {
    setActiveLocation(locationName);
  };
  
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full py-4 px-6 flex items-center border-b">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-center flex-1">템플스테이 찾기</h1>
      </div>
      
      {/* Location Filters */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-medium mb-4">가까운 지역</h2>
        <div className="flex space-x-2 overflow-x-auto">
          {locations.map((location) => (
            <Badge 
              key={location.name}
              variant="outline"
              className={`rounded-full px-4 py-1 h-auto ${
                location.active ? 'bg-[#DE7834] text-white border-[#DE7834]' : 'bg-white text-black border-gray-300'
              }`}
              onClick={() => handleLocationClick(location.name)}
            >
              {location.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Temple Stay List */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-medium mb-4">추천 템플스테이</h2>
        <div>
          {nearbyTempleStays.map((templeStay) => (
            <TempleStayItem key={templeStay.id} templeStay={templeStay} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTempleStay;
