import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TempleStay } from '/public/data/templeStayData/templeStayRepository';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={templeStay.imageUrl} 
        alt={templeStay.templeName} 
        className="w-full h-40 object-cover" 
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{templeStay.templeName}</h3>
        <p className="text-gray-500 text-sm mb-3">{templeStay.location}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">
            {templeStay.price.toLocaleString()} 원
          </span>
          <span className="text-gray-500 text-xs">
            찜 {templeStay.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
