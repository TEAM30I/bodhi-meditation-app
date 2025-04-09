
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Heart, Share, Instagram, Facebook } from 'lucide-react';
import { temples, imageRepository } from '@/data/dataRepository';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  
  // Find the temple by id
  const temple = temples[id || ''];
  
  if (!temple) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Temple not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "찜 목록에서 제거되었습니다." : "찜 목록에 추가되었습니다.",
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    // Implementation for sharing
    toast({
      title: "공유 링크가 복사되었습니다.",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-64 bg-black">
        {/* Temple Image */}
        <img 
          src={temple.imageSrc || imageRepository.temples[id || '']} 
          alt={temple.name} 
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Back Button */}
        <button 
          className="absolute top-4 left-4 bg-black/30 rounded-full p-2 text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            className="bg-black/30 rounded-full p-2 text-white"
            onClick={handleLike}
          >
            <Heart size={24} fill={isLiked ? "white" : "none"} />
          </button>
          <button 
            className="bg-black/30 rounded-full p-2 text-white"
            onClick={handleShare}
          >
            <Share size={24} />
          </button>
        </div>
        
        {/* Temple Name */}
        <div className="absolute bottom-4 left-6 right-6 text-white">
          <h1 className="text-2xl font-bold mb-1">{temple.name}</h1>
          <div className="flex items-center">
            <Heart size={16} fill="white" className="mr-1" />
            <span className="text-sm">{temple.likeCount} 명이 저장</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-6 bg-white rounded-t-3xl -mt-6 relative z-10">
        {/* Location Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">위치</h2>
          <div className="flex items-start">
            <MapPin className="text-gray-400 mr-2 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">{temple.location}</p>
              <p className="text-sm text-gray-500 mt-1">{temple.directions}</p>
            </div>
          </div>
        </div>
        
        {/* Operation Hours */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">운영 시간</h2>
          <div className="flex items-start">
            <Clock className="text-gray-400 mr-2 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">매일 개방</p>
              <p className="text-sm text-gray-500 mt-1">{temple.hours}</p>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">태그</h2>
          <div className="flex flex-wrap gap-2">
            {temple.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-sm bg-gray-100 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">소개</h2>
          <p className="text-gray-700 leading-relaxed">
            {temple.description || '불교 문화의 중심지로, 아름다운 자연환경 속에서 불교의 정신과 한국의 전통 건축양식을 느낄 수 있는 사찰입니다.'}
          </p>
        </div>
        
        {/* Additional Info */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">추가 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">전화번호</p>
              <p className="font-medium">{temple.phone || '02-123-4567'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">웹사이트</p>
              <a 
                href={temple.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-500"
              >
                방문하기
              </a>
            </div>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">SNS</h2>
          <div className="flex space-x-4">
            <a 
              href={temple.socialMedia?.instagram || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-pink-500"
            >
              <Instagram size={20} className="mr-1" />
              <span>Instagram</span>
            </a>
            <a 
              href={temple.socialMedia?.facebook || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600"
            >
              <Facebook size={20} className="mr-1" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1 py-6"
            onClick={handleLike}
          >
            <Heart size={20} className="mr-2" fill={isLiked ? "red" : "none"} />
            찜하기
          </Button>
          <Button 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-6"
            onClick={() => navigate(`/search/temple-stay?temple=${temple.name}`)}
          >
            템플스테이 예약
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
