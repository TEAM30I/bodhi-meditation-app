
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Heart, Share, Globe, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { temples, Temple } from '/public/data/templeData/templeRepository';
import { castRepository } from '@/utils/typeAssertions';
import { toast } from '@/components/ui/use-toast';

const TempleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const templeObj = id ? Object.values(temples).find(t => t.id === id) : undefined;
  const temple = castRepository<Temple>(templeObj);
  
  if (!temple) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>사찰을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast({
        title: "찜 목록에 추가되었습니다.",
        description: `${temple.name}이(가) 찜 목록에 추가되었습니다.`,
      });
    } else {
      toast({
        title: "찜 목록에서 제거되었습니다.",
        description: `${temple.name}이(가) 찜 목록에서 제거되었습니다.`,
      });
    }
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="w-6" />
        <button 
          onClick={() => navigate('/main')}
          className="flex items-center space-x-1"
        >
          <Home size={24} />
        </button>
      </div>

      {/* Temple Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={temple.imageUrl} 
          alt={temple.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={handleToggleFavorite}
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          >
            <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} />
          </button>
          <button 
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          >
            <Share size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <h1 className="text-xl font-bold">{temple.name}</h1>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{temple.location}</span>
          </div>
        </div>
      </div>

      {/* Temple Info */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {temple.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        
        {temple.description && (
          <p className="text-gray-700 text-sm mb-4">{temple.description}</p>
        )}
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span>운영시간: {temple.openingHours}</span>
        </div>
      </div>
      
      {/* Temple Tags/Features */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex flex-wrap gap-2">
          {temple.facilities?.map((facility, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 rounded-full">
              {facility}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Temple Website */}
      {temple.websiteUrl && (
        <div className="bg-white px-5 py-4 mb-2">
          <button 
            className="flex items-center justify-between w-full" 
            onClick={() => window.open(temple.websiteUrl, '_blank')}
          >
            <div className="flex items-center text-gray-700">
              <Globe className="w-5 h-5 mr-2" />
              <span>공식 웹사이트</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TempleDetail;
