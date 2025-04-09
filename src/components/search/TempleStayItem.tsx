import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TempleStay } from '@/data/templeStayData';

interface TempleStayItemProps {
  templeStay: TempleStay;
}

const TempleStayItem = ({ templeStay }: TempleStayItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/search/temple-stay/detail/${templeStay.id}`);
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };
  
  return (
    <div 
      className="flex cursor-pointer mb-6"
      onClick={handleClick}
    >
      <div className="w-[120px] h-[120px] rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={templeStay.imageUrl}
          alt={templeStay.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-bold mb-1">{templeStay.name}</h3>
        <p className="text-gray-500 text-sm mb-1">{templeStay.location}</p>
        
        {templeStay.distance && (
          <p className="text-gray-700 text-sm mb-1">{templeStay.distance}</p>
        )}
        
        <div className="flex items-center mb-2">
          <Badge className="flex items-center gap-1 bg-[#ffc83b] text-black font-bold text-xs rounded-full h-6 mr-2">
            <Star className="w-3 h-3 fill-current" />
            <span>{templeStay.rating}</span>
          </Badge>
          
          <span className="text-gray-500 text-xs">
            {templeStay.reviews}개의 평가
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {templeStay.tags && templeStay.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-gray-100 border-none text-gray-700 font-medium text-[10px] px-2 py-1 rounded-full"
              >
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="text-bodhi-orange font-bold">
            {formatPrice(templeStay.price)}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayItem;
