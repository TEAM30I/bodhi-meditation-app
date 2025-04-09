
import React from 'react';
import { Heart } from 'lucide-react';
import { TempleStay } from '@/data/templeStayData';

interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm" onClick={onClick}>
      <div className="relative">
        <img
          src={templeStay.imageUrl}
          alt={templeStay.templeName}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full">
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{templeStay.templeName}</h3>
        <p className="text-sm text-gray-600 mb-1">{templeStay.location}</p>
        <div className="flex justify-between items-end mt-2">
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-xs bg-gray-100 py-0.5 px-2 rounded-full">
                {templeStay.tags && templeStay.tags.length > 0 ? templeStay.tags[0] : '템플스테이'}
              </span>
            </div>
          </div>
          <p className="font-semibold">
            {templeStay.price > 0 ? `${templeStay.price.toLocaleString()}원~` : '무료'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
