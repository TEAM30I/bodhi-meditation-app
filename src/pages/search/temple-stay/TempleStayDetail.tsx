import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Share, Globe, Heart } from 'lucide-react';
import { templeStays } from '/public/data/templeStayData/templeStayRepository';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const TempleStayDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const templeStay = Object.values(templeStays).find(ts => ts.id === id);

  if (!templeStay) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>템플스테이를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/search/temple-stay')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">{templeStay.templeName}</h1>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={templeStay.imageUrl}
          alt={templeStay.templeName}
          className="w-full h-[240px] object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/80 rounded-md px-2 py-1 text-xs font-medium">
          {templeStay.location}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{templeStay.templeName}</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">{templeStay.location}</p>
            </div>
          </div>
          <button className="flex items-center justify-center px-3 py-2 bg-[#F5F5F5] rounded-full">
            <Heart className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full mb-4">
          <TabsList className="bg-[#F5F5F5] rounded-full p-1 inline-flex">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-4 py-2 text-sm font-medium">정보</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-4 py-2 text-sm font-medium">일정</TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full px-4 py-2 text-sm font-medium">리뷰</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">사찰 정보</h3>
              <p className="text-sm text-gray-700">{templeStay.description}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">오시는 길</h3>
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">{templeStay.location}</p>
              </div>
              <p className="text-sm text-gray-700">{templeStay.direction}</p>
            </div>
          </TabsContent>
          <TabsContent value="schedule">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">템플스테이 일정</h3>
              <ul className="space-y-2">
                {templeStay.schedule.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.activity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="review">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">리뷰</h3>
              <p className="text-sm text-gray-700">리뷰 기능은 준비 중입니다.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Buttons */}
        <div className="space-y-2">
          <Button className="w-full" onClick={() => window.open(templeStay.websiteUrl, '_blank')}>
            <Globe className="w-4 h-4 mr-2" />
            웹사이트 방문
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            예약하기
          </Button>
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span className="text-sm">공유하기</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{templeStay.likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleStayDetail;
