import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Globe, Heart, Share, PhoneCall, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TempleBanner from '@/components/TempleBanner';
import TempleCircle from '@/components/TempleCircle';
import IconMenu from '@/components/IconMenu';
import { temples, nearbyTemples, Temple } from '/public/data/templeData/templeRepository';

const TempleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // id를 기반으로 사찰 정보 가져오기
  const temple: Temple | undefined = Object.values(temples).find((temple) => temple.id === id);

  // 사찰 정보가 없을 경우 예외 처리
  if (!temple) {
    return <div>사찰 정보를 찾을 수 없습니다.</div>;
  }

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing temple details');
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
        <TempleBanner imageUrl={temple.imageUrl} />

        {/* Temple Info */}
        <div className="bg-white px-5 pt-4 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{temple.name}</h2>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">{temple.location}</span>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex space-x-2 mb-4">
            {temple.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <IconMenu icon={Clock} text={temple.openingHours || '09:00 - 18:00'} />
            <IconMenu icon={Globe} text={<a href={temple.websiteUrl} target="_blank" rel="noopener noreferrer">웹사이트</a>} />
            {temple.contact?.phone && <IconMenu icon={PhoneCall} text={temple.contact.phone} />}
            {temple.social?.instagram && <IconMenu icon={Instagram} text={<a href={temple.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>} />}
            {temple.social?.facebook && <IconMenu icon={Facebook} text={<a href={temple.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>} />}
          </div>

          <p className="text-gray-700 leading-relaxed">{temple.description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="bg-white">
          <TabsList className="px-5">
            <TabsTrigger value="details">세부 정보</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            <TabsTrigger value="templeStay">템플스테이</TabsTrigger>
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
              <p className="text-gray-700">이 사찰에서는 템플스테이를 운영합니다.</p>
            ) : (
              <p className="text-gray-500">이 사찰에서는 템플스테이를 운영하지 않습니다.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* 주변 사찰 정보 */}
        <div className="bg-white px-5 py-6 mt-2">
          <h3 className="font-semibold text-lg mb-4">주변 사찰</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {nearbyTemples.map((nearbyTemple) => (
              <TempleCircle
                key={nearbyTemple.id}
                temple={nearbyTemple}
              />
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
