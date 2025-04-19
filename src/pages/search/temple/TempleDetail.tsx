
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, MapPin, Globe } from 'lucide-react';
import { temples } from '@/utils/repository';

const TempleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  const temple = temples[id || ''] || temples.jogyesa; // Fallback to 조계사 if not found

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-10 flex items-center justify-between p-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Temple Image */}
      <div className="pt-16">
        <div className="relative">
          <img
            src={temple.imageUrl}
            alt={temple.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 right-4 text-white text-sm">
            1 / 4
          </div>
        </div>
      </div>

      {/* Temple Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold">{temple.name}</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full bg-gray-100"
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button className="p-2 rounded-full bg-gray-100">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{temple.direction}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <a href={temple.websiteUrl} className="text-gray-600 underline">
              www.bodhis.com
            </a>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">위치/교통</h3>
          <div className="bg-gray-100 h-40 rounded-lg mb-3">
            {/* Map placeholder */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              지도
            </div>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>3호선 안국역</p>
            <p>1호선 종각역</p>
            <p>5호선 광화문역</p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">주차</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">[요금]</h4>
              <p className="text-sm text-gray-600">10분 당 1,000원</p>
            </div>
            <div>
              <h4 className="font-medium">[유형]</h4>
              <p className="text-sm text-gray-600">조계사 경내 주차장</p>
            </div>
            <div>
              <h4 className="font-medium">[안내]</h4>
              <p className="text-sm text-gray-600">
                조계사는 주차공간이 협소합니다. 대중교통을 이용해 주시면 감사하겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
