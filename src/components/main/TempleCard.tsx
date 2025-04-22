
import React from 'react';
import { MapPin } from 'lucide-react';
import { Temple } from '@/types/temple';

interface TempleCardProps {
  temple: Temple;
  onClick: () => void;
}

const TempleCard: React.FC<TempleCardProps> = ({ temple, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={temple.imageUrl} 
        alt={temple.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold mb-1">{temple.name}</h3>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{temple.location}</span>
        </div>
      </div>
    </div>
  );
};

export default TempleCard;
