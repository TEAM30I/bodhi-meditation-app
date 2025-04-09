import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Temple } from '@/data/templeData';

interface TempleItemProps {
  temple: Temple;
}

const TempleItem = ({ temple }: TempleItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/search/temple/detail/${temple.id}`);
  };
  
  return (
    <div 
      className="flex cursor-pointer mb-6"
      onClick={handleClick}
    >
      <div className="w-[120px] h-[120px] rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-bold mb-1">{temple.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{temple.location}</p>
        
        {temple.distance && (
          <p className="text-gray-700 text-sm mb-2">{temple.distance}</p>
        )}
        
        <div className="flex items-center mb-2">
          {temple.rating && (
            <Badge className="flex items-center gap-1 bg-[#ffc83b] text-black font-bold text-xs rounded-full h-6 mr-2">
              <Star className="w-3 h-3 fill-current" />
              <span>{temple.rating}</span>
            </Badge>
          )}
          
          {temple.reviews && (
            <span className="text-gray-500 text-xs">
              {temple.reviews}개의 평가
            </span>
          )}
        </div>
        
        {temple.tags && temple.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {temple.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-gray-100 border-none text-gray-700 font-medium text-[10px] px-2 py-1 rounded-full"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleItem;
