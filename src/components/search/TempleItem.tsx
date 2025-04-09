
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Navigation, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Temple } from '/public/data/templeData/templeRepository';
import { castRepository } from '@/utils/typeAssertions';

interface TempleItemProps {
  temple: Temple;
  onClick?: () => void;
}

const TempleItem: React.FC<TempleItemProps> = ({ temple, onClick }) => {
  const navigate = useNavigate();
  const typedTemple = castRepository<Temple>(temple);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={typedTemple.imageUrl} 
          alt={typedTemple.name} 
          className="w-full h-40 object-cover" 
        />
        <div className="absolute top-2 left-2">
          {typedTemple.tags && typedTemple.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-1">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{typedTemple.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {typedTemple.location}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{typedTemple.description}</p>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center text-gray-700 text-sm">
          <Heart className="w-4 h-4 mr-1 text-red-500" />
          {typedTemple.likeCount || '0'} 찜
        </div>
        <button 
          className="text-[#DE7834] text-sm font-medium flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search/temple/detail/${typedTemple.id}`);
          }}
        >
          자세히 보기 <Navigation className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TempleItem;
