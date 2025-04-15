
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Heart, Share, Globe, ChevronRight, Home } from 'lucide-react';
import { templeStays, TempleStay } from '@/utils/repository';
import { castRepository } from '@/utils/typeAssertions';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const TempleStayDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const templeStayObj = id ? Object.values(templeStays).find(t => t.id === id) : undefined;
  const templeStay = castRepository<TempleStay>(templeStayObj);
  
  if (!templeStay) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>템플스테이를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast({
        title: "찜 목록에 추가되었습니다.",
        description: `${templeStay.templeName}이(가) 찜 목록에 추가되었습니다.`,
      });
    } else {
      toast({
        title: "찜 목록에서 제거되었습니다.",
        description: `${templeStay.templeName}이(가) 찜 목록에서 제거되었습니다.`,
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

      {/* Temple Stay Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName} 
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
          <h1 className="text-xl font-bold">{templeStay.templeName}</h1>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{templeStay.location}</span>
          </div>
        </div>
      </div>

      {/* Temple Stay Info */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="rounded-full">
            {templeStay.duration}
          </Badge>
          {templeStay.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        
        {templeStay.description && (
          <p className="text-gray-700 text-sm mb-4">{templeStay.description}</p>
        )}
      </div>
      
      {/* Temple Stay Program */}
      <div className="bg-white px-5 py-4 mb-2">
        <h2 className="text-base font-bold mb-3">이용안내</h2>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-2">위치</h3>
          <div className="text-gray-700 text-sm mb-2">
            {templeStay.direction}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">유의사항</h3>
          <div className="text-gray-700 text-sm">
            <p>• 프로그램은 현장 상황에 따라 일부 변경될 수 있습니다.</p>
            <p>• 사찰 내에서는 정숙하여 주시기 바랍니다.</p>
            <p>• 자연을 훼손하는 행위는 삼가 주시기 바랍니다.</p>
          </div>
        </div>
      </div>
      
      {/* Temple Stay Website */}
      {templeStay.websiteUrl && (
        <div className="bg-white px-5 py-4 mb-2">
          <button 
            className="flex items-center justify-between w-full" 
            onClick={() => window.open(templeStay.websiteUrl, '_blank')}
          >
            <div className="flex items-center text-gray-700">
              <Globe className="w-5 h-5 mr-2" />
              <span>공식 웹사이트</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
      
      {/* Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{templeStay.price.toLocaleString()}원</span>
            <span className="text-sm text-gray-500">/ 인</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">찜</span>
            <div className="flex items-center">
              <Heart size={16} className="text-red-500 mr-1" />
              <span className="text-sm font-medium">{templeStay.likeCount}</span>
            </div>
          </div>
        </div>
        <button className="w-full bg-[#DE7834] text-white py-3 rounded-lg font-medium">
          예약하기
        </button>
      </div>
    </div>
  );
};

export default TempleStayDetail;
