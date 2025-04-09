
import React from 'react';
import { TempleStay } from '@/data/templeStayData';
import { Heart } from 'lucide-react';

export interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick?: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative w-full h-40 overflow-hidden">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{templeStay.templeName}</h3>
        <p className="text-sm text-gray-600 mb-2">{templeStay.location}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">₩{templeStay.price.toLocaleString()}~</p>
          <div className="flex items-center text-gray-500">
            <Heart size={14} className="mr-1" />
            <span className="text-sm">{templeStay.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
