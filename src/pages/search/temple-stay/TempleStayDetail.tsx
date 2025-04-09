
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Heart, Share, Globe, ChevronRight } from 'lucide-react';
import { templeStays, TempleStay } from '/public/data/templeStayData/templeStayRepository';

const TempleStayDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const templeStay: TempleStay | undefined = id ? 
    Object.values(templeStays).find(t => t.id === id) : 
    undefined;
  
  if (!templeStay) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>템플스테이를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center">{templeStay.templeName}</h1>
        <div className="w-6" />
      </div>

      {/* Temple Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Temple Info */}
      <div className="px-5 py-4 bg-white">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {templeStay.location}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{templeStay.templeName}</h2>
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-full">{templeStay.location}</span>
          <span className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-full">{templeStay.duration}</span>
          {templeStay.tags && templeStay.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      
      {/* Description */}
      <div className="px-5 py-4 mt-2 bg-white">
        <h3 className="text-lg font-medium mb-2">소개</h3>
        <p className="text-gray-700 text-sm mb-4">{templeStay.description}</p>
        
        <h3 className="text-lg font-medium mb-2">위치</h3>
        <div className="flex flex-col text-sm text-gray-700 space-y-1 mb-4">
          <p>📍 {templeStay.location}</p>
          <p>🚌 {templeStay.direction}</p>
        </div>
        
        <h3 className="text-lg font-medium mb-2">스케줄</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="space-y-3">
            {templeStay.schedule.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-14 text-gray-500 text-sm shrink-0">
                  {item.time}
                </div>
                <div className="flex-1 text-gray-700">
                  {item.activity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Temple Website */}
      <div className="px-5 py-4 mt-2 bg-white">
        <button className="flex items-center justify-between w-full" onClick={() => window.open(templeStay.websiteUrl, '_blank')}>
          <div className="flex items-center text-gray-700">
            <Globe className="w-5 h-5 mr-2" />
            <span>공식 웹사이트</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      {/* Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{templeStay.price.toLocaleString()}원</span>
            <span className="text-sm text-gray-500">/ 인</span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border border-gray-200">
              <Heart className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-full border border-gray-200">
              <Share className="w-5 h-5 text-gray-500" />
            </button>
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
