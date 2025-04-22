import React from 'react';
import { MapPin } from 'lucide-react';
import { Temple } from '@/utils/repository';

interface TempleCardProps {
  temple: Temple;
  onClick: () => void;
}

const TempleCard: React.FC<TempleCardProps> = ({ temple, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-gray-100">
        <img 
          src={temple.imageUrl || "https://via.placeholder.com/400x300"} 
          alt={temple.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2">{temple.name}</h3>
        <div className="flex items-center text-gray-500 text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{temple.location}</span>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;
