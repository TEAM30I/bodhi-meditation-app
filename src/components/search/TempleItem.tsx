import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Navigation, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Temple } from '/public/data/templeData/templeRepository';

interface TempleItemProps {
  temple: Temple;
  onClick?: () => void;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={temple.imageUrl} 
          alt={temple.name} 
          className="w-full h-40 object-cover" 
        />
        <div className="absolute top-2 left-2">
          {temple.tags && temple.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-1">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{temple.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {temple.location}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{temple.description}</p>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center text-gray-700 text-sm">
          <Star className="w-4 h-4 mr-1 text-yellow-500" />
          {temple.rating || '4.5'} ({temple.reviews || '22'})
        </div>
        <button 
          className="text-[#DE7834] text-sm font-medium flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search/temple/detail/${temple.id}`);
          }}
        >
          자세히 보기 <Navigation className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TempleItem;
