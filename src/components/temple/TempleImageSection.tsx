
import React from 'react';
import { Heart, Share } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TempleImageSectionProps {
  temple: {
    image_url: string;
    name: string;
    region: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TempleImageSection = ({ temple, isFavorite, onToggleFavorite }: TempleImageSectionProps) => {
  return (
    <div className="w-full h-[250px] relative">
      <img 
        src={temple.image_url || 'https://via.placeholder.com/400x300'} 
        alt={temple.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 flex space-x-2">
        <button 
          onClick={onToggleFavorite}
          className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        >
          <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} />
        </button>
        <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          <Share size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
        <h1 className="text-xl font-bold">{temple.name}</h1>
        <div className="flex items-center mt-1">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">{temple.region}</span>
        </div>
      </div>
    </div>
  );
};

export default TempleImageSection;
