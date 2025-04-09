
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { TempleStay } from '@/data/templeStayData';

export interface TempleStayItemProps {
  templeStay: TempleStay;
  onClick?: () => void;
}

const TempleStayItem: React.FC<TempleStayItemProps> = ({ templeStay, onClick }) => {
  const { title, location, price, imageUrl, rating, reviewCount, tags } = templeStay;
  
  // Get default image if none available
  const defaultImage = "https://images.unsplash.com/photo-1624456735729-03594a40c5fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";
  const image = imageUrl || defaultImage;
  
  // Format price
  const formattedPrice = price ? `${price.toLocaleString()}원` : '가격 문의';
  
  return (
    <div 
      className="mb-5 bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium truncate">{title}</h3>
          {rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{rating}</span>
              {reviewCount && (
                <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
              )}
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{location}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <p className="text-sm font-medium">
          <span className="text-gray-500">1박 </span>
          <span className="text-black">{formattedPrice}</span>
        </p>
      </div>
    </div>
  );
};

export default TempleStayItem;
