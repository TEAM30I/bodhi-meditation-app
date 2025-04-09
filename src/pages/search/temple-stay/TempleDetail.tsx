import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Globe, Heart, Share, PhoneCall, Instagram as InstagramIcon, Facebook as FacebookIcon } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { templeStays, TempleStay } from '@/utils/repository';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use typedData with explicit TempleStay type
  const temple = typedData<TempleStay>(templeStays[id || '']);

  if (!temple) {
    return <div>사찰 정보를 찾을 수 없습니다.</div>;
  }

  const handleShare = () => {
    // Implement share functionality
    alert('공유 기능은 아직 준비 중입니다.');
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">{temple.templeName}</h1>
      </div>

      {/* Banner */}
      <div className="relative">
        <img
          src={temple.imageUrl}
          alt={temple.templeName}
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-lg font-bold">{temple.templeName}</h2>
          <div className="flex items-center text-sm">
            <MapPin className="mr-1 w-4 h-4" />
            {temple.location}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Info Bar */}
      <div className="bg-white px-5 py-4 flex items-center justify-around border-b border-[#E5E5EC]">
        <div className="flex flex-col items-center">
          <Clock className="w-5 h-5 text-gray-500 mb-1" />
          <span className="text-xs text-gray-700">
            {temple.duration || '09:00 - 18:00'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <MapPin className="w-5 h-5 text-gray-500 mb-1" />
          <span className="text-xs text-gray-700">{temple.direction}</span>
        </div>
        <div className="flex flex-col items-center">
          <Globe className="w-5 h-5 text-gray-500 mb-1" />
          <a href={temple.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">
            웹사이트
          </a>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white px-5 py-4 flex items-center justify-around border-b border-[#E5E5EC]">
        <Button className="w-full mx-1 flex-1" onClick={() => alert('예약 기능은 아직 준비 중입니다.')}>
          예약하기
        </Button>
        <Button variant="outline" className="w-full mx-1 flex-1" onClick={handleShare}>
          <Share className="w-4 h-4 mr-2" />
          공유하기
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-6">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="w-full bg-white rounded-lg">
            <TabsTrigger value="information" className="w-1/2 data-[state=active]:bg-[#DE7834] data-[state=active]:text-white">
              정보
            </TabsTrigger>
            <TabsTrigger value="review" className="w-1/2 data-[state=active]:bg-[#DE7834] data-[state=active]:text-white">
              리뷰
            </TabsTrigger>
          </TabsList>
          <TabsContent value="information" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">사찰 소개</h3>
              <p className="text-gray-700">{temple.description}</p>
            </div>
            {temple.tags && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">주요 태그</h3>
                <div className="flex gap-2">
                  {temple.tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">오시는 길</h3>
              <p className="text-gray-700">{temple.direction}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">연락처</h3>
              <p className="text-gray-700">
                <PhoneCall className="inline-block w-4 h-4 mr-1 align-middle" />
                문의전화: {temple.price ? `${temple.price.toLocaleString()}원` : '가격정보없음'}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">웹사이트</h3>
              <a href={temple.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                <Globe className="inline-block w-4 h-4 mr-1 align-middle" />
                {temple.templeName} 웹사이트 방문하기
              </a>
            </div>
          </TabsContent>
          <TabsContent value="review">
            <div>리뷰 기능은 아직 준비 중입니다.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TempleDetail;
