
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Globe, Heart, Share, PhoneCall, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TempleBanner from '@/components/TempleBanner';
import TempleCircle from '@/components/TempleCircle';
import IconMenu from '@/components/IconMenu';
import { temples, nearbyTemples, Temple } from '/public/data/templeData/templeRepository';
import { castRepository } from '@/utils/typeAssertions';
import { toast } from '@/components/ui/use-toast';

const TempleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  // id를 기반으로 사찰 정보 가져오기
  const templeObj = Object.values(temples).find((temple) => temple.id === id);
  const temple = castRepository<Temple>(templeObj);

  // 사찰 정보가 없을 경우 예외 처리
  if (!temple) {
    return <div>사찰 정보를 찾을 수 없습니다.</div>;
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

  const handleShare = () => {
    // Implement share functionality
    toast({
      title: "공유하기",
      description: "공유 기능은 아직 개발 중입니다.",
    });
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">{temple.name}</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-[480px] mx-auto">
        {/* Temple Banner */}
        <div className="w-full relative">
          <img 
            src={temple.imageUrl} 
            alt={temple.name} 
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute top-4 right-4">
            <button 
              onClick={handleToggleFavorite}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            >
              <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <h2 className="text-xl font-bold">{temple.name}</h2>
            <div className="flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              <span className="text-sm">{temple.location}</span>
            </div>
          </div>
        </div>

        {/* Temple Info */}
        <div className="bg-white px-5 pt-4 pb-6">
          <div className="flex space-x-2 mb-4">
            {temple.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Heart size={18} className="text-red-500 mr-1" />
              <span className="text-sm font-medium">{temple.likeCount || 0}명이 찜했습니다</span>
            </div>
            <button 
              onClick={handleShare}
              className="text-gray-500 flex items-center"
            >
              <Share size={18} className="mr-1" />
              <span className="text-sm">공유</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 my-6">
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-gray-500 mb-1" />
              <span className="text-xs text-gray-500">{temple.openingHours || '09:00 - 18:00'}</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-4 h-4 text-gray-500 mb-1" />
              <a href={temple.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">웹사이트</a>
            </div>
            {temple.contact?.phone && (
              <div className="flex flex-col items-center">
                <PhoneCall className="w-4 h-4 text-gray-500 mb-1" />
                <span className="text-xs text-gray-500">{temple.contact.phone}</span>
              </div>
            )}
            {temple.social?.instagram && (
              <div className="flex flex-col items-center">
                <Instagram className="w-4 h-4 text-gray-500 mb-1" />
                <a href={temple.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">Instagram</a>
              </div>
            )}
            {temple.social?.facebook && (
              <div className="flex flex-col items-center">
                <Facebook className="w-4 h-4 text-gray-500 mb-1" />
                <a href={temple.social.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">Facebook</a>
              </div>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{temple.description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="bg-white mt-2">
          <TabsList className="px-5 w-full border-b">
            <TabsTrigger value="details" className="flex-1">세부 정보</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">리뷰</TabsTrigger>
            <TabsTrigger value="templeStay" className="flex-1">템플스테이</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="px-5 py-4">
            <h3 className="font-semibold text-lg mb-4">사찰 세부 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{temple.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">운영 시간: {temple.openingHours || '정보 없음'}</span>
              </div>
              {temple.facilities && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">시설: {temple.facilities.join(', ')}</span>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="px-5 py-4">
            <h3 className="font-semibold text-lg mb-4">사찰 리뷰</h3>
            <p className="text-gray-500">리뷰가 없습니다.</p>
          </TabsContent>
          <TabsContent value="templeStay" className="px-5 py-4">
            <h3 className="font-semibold text-lg mb-4">템플스테이</h3>
            {temple.hasTempleStay ? (
              <div>
                <p className="text-gray-700 mb-4">이 사찰에서는 템플스테이를 운영합니다.</p>
                <Button 
                  onClick={() => navigate('/search/temple-stay')} 
                  className="bg-[#DE7834] hover:bg-[#C56A2D]"
                >
                  템플스테이 알아보기
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">이 사찰에서는 템플스테이를 운영하지 않습니다.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* 주변 사찰 정보 */}
        <div className="bg-white px-5 py-6 mt-2">
          <h3 className="font-semibold text-lg mb-4">주변 사찰</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {nearbyTemples.map((nearbyTemple) => (
              <div 
                key={nearbyTemple.id}
                className="flex flex-col items-center"
                onClick={() => navigate(`/search/temple/detail/${nearbyTemple.id}`)}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                  <img 
                    src={nearbyTemple.imageUrl} 
                    alt={nearbyTemple.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="text-xs text-center">{nearbyTemple.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E5EC] py-4 px-5 flex justify-between items-center">
          <Button className="w-full mr-2">
            <MapPin className="w-4 h-4 mr-2" />
            길찾기
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
