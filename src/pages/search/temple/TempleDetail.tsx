
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Instagram, 
  Facebook,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { temples, Temple } from '@/data/templeData';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (id) {
      // Find temple by ID
      const foundTemple = temples[id];
      if (foundTemple) {
        setTemple(foundTemple);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="p-5 text-center">사찰 정보를 불러오는 중...</div>;
  }

  if (!temple) {
    return <div className="p-5 text-center">사찰 정보를 찾을 수 없습니다.</div>;
  }

  // Default image if none available
  const defaultImage = "https://images.unsplash.com/photo-1624456735729-03594a40c5fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80";
  
  // We need to use the imageUrl directly since Temple type doesn't have images field
  const imageUrl = temple.imageUrl || defaultImage;
  
  // Get contact info
  const phoneNumber = temple.contact?.phone || '정보 없음';
  const website = temple.websiteUrl || '';
  
  // Social media fallbacks - these fields may not exist in Temple interface
  const instagram = temple.social?.instagram || '';
  const facebook = temple.social?.facebook || '';
  
  // Facilities and attractions fallbacks
  const facilities = temple.facilities || [];
  const nearbyAttractions = temple.nearbyAttractions || [];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center h-14 px-5 border-b">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold flex-1">{temple.name}</h1>
        <button className="p-2">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Temple Image Gallery */}
      <div className="relative w-full h-[250px] bg-gray-200">
        <img 
          src={imageUrl} 
          alt={temple.name}
          className="w-full h-full object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Temple Basic Info */}
      <div className="p-5">
        <h2 className="text-xl font-bold mb-1">{temple.name}</h2>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{temple.location}</span>
        </div>
        
        {temple.tags && temple.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {temple.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-gray-100 border-none text-gray-700 font-normal"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-5">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="facilities">시설 안내</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            {/* Opening Hours */}
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">운영 시간</h3>
                <p className="text-sm text-gray-600">{temple.openingHours || "정보 없음"}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start">
              <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">전화번호</h3>
                <a href={`tel:${phoneNumber}`} className="text-sm text-blue-600">{phoneNumber}</a>
              </div>
            </div>
            
            {/* Website */}
            {website && (
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">웹사이트</h3>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">{website}</a>
                </div>
              </div>
            )}
            
            {/* Instagram */}
            {instagram && (
              <div className="flex items-start">
                <Instagram className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">인스타그램</h3>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">{instagram}</a>
                </div>
              </div>
            )}
            
            {/* Facebook */}
            {facebook && (
              <div className="flex items-start">
                <Facebook className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">페이스북</h3>
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">{facebook}</a>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="facilities" className="space-y-4">
            {/* Facilities */}
            <div>
              <h3 className="font-medium mb-2">시설 안내</h3>
              {facilities.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {facilities.map((facility, index) => (
                    <li key={index} className="text-gray-700">{facility}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">시설 정보가 없습니다.</p>
              )}
            </div>
            
            {/* Nearby Attractions */}
            <div>
              <h3 className="font-medium mb-2">주변 관광지</h3>
              {nearbyAttractions.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {nearbyAttractions.map((attraction, index) => (
                    <li key={index} className="text-gray-700">{attraction}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">주변 관광지 정보가 없습니다.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Call Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-black hover:bg-gray-800"
          disabled={!phoneNumber || phoneNumber === '정보 없음'}
          onClick={() => phoneNumber && phoneNumber !== '정보 없음' && window.location.href = `tel:${phoneNumber}`}
        >
          전화 문의하기
        </Button>
      </div>
    </div>
  );
};

export default TempleDetail;
