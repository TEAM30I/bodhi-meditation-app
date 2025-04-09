
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Globe, Heart, Share2, Calendar, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { temples } from '@/data/templeData';
import { imageRepository } from '@/data/imageRepository';

const TempleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  
  // Find the temple in the temples object
  const temple = id ? temples[id] : undefined;

  if (!temple) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Temple not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // Get image from the image repository based on the temple's ID
  const image = temple.name && imageRepository.templeBanner ? imageRepository.templeBanner.default : '';

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header image */}
      <div className="relative h-64 bg-gray-300">
        <img 
          src={image} 
          alt={temple.name} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 p-2 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Temple info */}
      <div className="bg-white px-5 py-6 -mt-6 rounded-t-3xl relative">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{temple.name}</h1>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded-full ${isLiked ? 'bg-red-50' : 'bg-gray-100'}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart size={20} className={isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
            </button>
            <button className="p-2 bg-gray-100 rounded-full">
              <Share2 size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-1">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{temple.address}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-6">
          <div className="flex">
            {Array(5).fill(0).map((_, index) => (
              <svg 
                key={index} 
                className={`w-4 h-4 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-sm font-medium">4.2</span>
          <span className="ml-1 text-sm text-gray-500">(56)</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="info">정보</TabsTrigger>
            <TabsTrigger value="programs">프로그램</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            {/* Address and Directions */}
            <div>
              <h3 className="font-medium mb-2">주소 및 오시는 길</h3>
              <p className="text-sm text-gray-600 mb-1">{temple.address}</p>
              <p className="text-sm text-gray-600">{temple.direction || "길 안내 정보가 없습니다."}</p>
              <div className="mt-3 h-40 bg-gray-200 rounded-lg">
                {/* Map placeholder */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  지도 표시 영역
                </div>
              </div>
            </div>
            
            {/* Operating Hours */}
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Clock size={18} className="mr-2" />
                운영 시간
              </h3>
              <p className="text-sm text-gray-600">
                {temple.operatingHours || "매일 09:00 - 17:00"}
              </p>
            </div>
            
            {/* History */}
            <div>
              <h3 className="font-medium mb-2">사찰 소개</h3>
              <p className="text-sm text-gray-600">
                {temple.description || "이 사찰에 대한 정보가 아직 등록되지 않았습니다."}
              </p>
            </div>
            
            {/* Contact information */}
            <div>
              <h3 className="font-medium mb-2">연락처</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Phone size={16} className="mr-2" />
                <span>{temple.contactNumber || "연락처 정보가 없습니다"}</span>
              </div>
              {temple.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe size={16} className="mr-2" />
                  <a href={temple.website} className="text-blue-500 underline">웹사이트 방문</a>
                </div>
              )}
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="font-medium mb-2">소셜 미디어</h3>
              <div className="flex gap-2">
                {temple.instagram && (
                  <a href={temple.instagram} className="p-2 bg-gray-100 rounded-full">
                    <Instagram size={20} className="text-gray-600" />
                  </a>
                )}
                {temple.facebook && (
                  <a href={temple.facebook} className="p-2 bg-gray-100 rounded-full">
                    <Facebook size={20} className="text-gray-600" />
                  </a>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="programs" className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-1">명상 프로그램</h3>
                <p className="text-sm text-gray-600 mb-2">
                  매일 오전 6시 - 7시<br />
                  전통적인 불교 명상법을 배울 수 있는 시간입니다.
                </p>
                <Button className="w-full" variant="outline">예약하기</Button>
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-1">템플스테이</h3>
                <p className="text-sm text-gray-600 mb-2">
                  주말 1박 2일<br />
                  사찰 생활과 불교 문화를 체험할 수 있는 프로그램입니다.
                </p>
                <Button className="w-full" variant="outline">예약하기</Button>
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-medium mb-1">불교 문화 체험</h3>
                <p className="text-sm text-gray-600 mb-2">
                  매주 토요일 오후 2시 - 4시<br />
                  연등 만들기, 차 명상 등 다양한 체험 프로그램을 제공합니다.
                </p>
                <Button className="w-full" variant="outline">예약하기</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">리뷰 56개</h3>
              <Button variant="outline" size="sm">리뷰 작성</Button>
            </div>
            
            <div className="space-y-4">
              {/* Sample reviews */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">김민준</h4>
                    <div className="flex">
                      {Array(5).fill(0).map((_, index) => (
                        <svg 
                          key={index} 
                          className={`w-3 h-3 ${index < 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2025.04.01</span>
                </div>
                <p className="text-sm text-gray-600">
                  아름다운 자연 속에 위치한 역사적인 사찰입니다. 조용히 명상하기 좋았습니다.
                </p>
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">이서연</h4>
                    <div className="flex">
                      {Array(5).fill(0).map((_, index) => (
                        <svg 
                          key={index} 
                          className={`w-3 h-3 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2025.03.15</span>
                </div>
                <p className="text-sm text-gray-600">
                  템플스테이 프로그램을 통해 많은 것을 배웠습니다. 스님들의 친절한 가르침이 인상적이었습니다.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={() => navigate(`/search/temple-stay?templeId=${id}`)}
        >
          <Calendar size={18} />
          템플스테이 예약
        </Button>
        <Button 
          className="flex-1 gap-2 bg-black hover:bg-gray-800"
          onClick={() => window.open(`tel:${temple.contactNumber || ''}`)}
        >
          <Phone size={18} />
          전화 문의
        </Button>
      </div>
    </div>
  );
};

export default TempleDetail;
