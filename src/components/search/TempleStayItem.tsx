
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';

// Update import path to use relative imports
import { TempleStay } from '../../../public/data/templeStayData/templeStayRepository';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  const navigate = useNavigate();
  const typedTempleStay = typedData<TempleStay>(templeStay);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={typedTempleStay.imageUrl} 
          alt={typedTempleStay.templeName} 
          className="w-full h-40 object-cover" 
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
          <Heart className="w-3 h-3 mr-1 text-white" />
          <span>{typedTempleStay.likeCount}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{typedTempleStay.templeName}</h3>
        <p className="text-gray-500 text-sm mb-3">{typedTempleStay.location}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">
            {typedTempleStay.price.toLocaleString()} 원
          </span>
          <span className="text-gray-500 text-xs flex items-center">
            <Heart className="w-3 h-3 mr-1 text-red-500" />
            찜 {typedTempleStay.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
