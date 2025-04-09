
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, MapPin, Clock, Phone, Globe, Instagram, Facebook, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { temples, Temple } from '@/data/templeData';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id && temples[id]) {
      setTemple(temples[id]);
    }
  }, [id]);

  if (!temple) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>사찰 정보를 불러오는 중...</p>
      </div>
    );
  }

  // Toggle description expansion
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Get image array safely
  const images = [temple.imageUrl]; // Default to single image in array if no images property

  // Handle image selection
  const selectImage = (index: number) => {
    setActiveImageIndex(index);
  };

  // Get optional properties safely with default values
  const phone = temple.phone || "";
  const website = temple.websiteUrl || "";
  const instagram = "";
  const facebook = "";
  const facilities = temple.tags || [];
  const nearbyAttractions = [];

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header/Navigation */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="max-w-[480px] mx-auto">
          <div className="flex items-center justify-between h-[56px] px-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-1" 
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-bold">사찰 정보</h1>
            <button className="p-1">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[480px] mx-auto">
        {/* Image gallery */}
        <div className="relative">
          <img 
            src={images[activeImageIndex] || temple.imageUrl} 
            alt={temple.name} 
            className="w-full h-64 object-cover"
          />
          
          {/* Thumbnail selection */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex space-x-2 justify-center">
              {images.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Temple info */}
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold mb-1">{temple.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{temple.location}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">사찰 소개</h2>
            <div className={`text-gray-700 text-sm leading-6 ${showFullDescription ? '' : 'line-clamp-3'}`}>
              {temple.description || "사찰 소개 정보가 준비 중입니다."}
            </div>
            <button 
              onClick={toggleDescription}
              className="mt-2 text-blue-600 text-sm flex items-center"
            >
              {showFullDescription ? '접기' : '더보기'}
              <ChevronDown size={16} className={`ml-1 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Operating hours */}
          <div className="border-t border-gray-200 pt-4 pb-4">
            <div className="flex items-start mb-3">
              <Clock size={18} className="text-gray-500 mr-3 mt-1" />
              <div>
                <h3 className="font-medium mb-1">운영시간</h3>
                <p className="text-sm text-gray-600">{temple.openingHours || "운영시간 정보가 준비 중입니다."}</p>
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="border-t border-gray-200 pt-4 pb-4">
            <h3 className="font-medium mb-3">연락처 정보</h3>
            
            {phone && (
              <div className="flex items-center mb-3">
                <Phone size={18} className="text-gray-500 mr-3" />
                <span className="text-sm">{phone}</span>
              </div>
            )}
            
            {website && (
              <div className="flex items-center mb-3">
                <Globe size={18} className="text-gray-500 mr-3" />
                <a 
                  href={website} 
                  className="text-sm text-blue-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  웹사이트 방문하기
                </a>
              </div>
            )}
            
            {instagram && (
              <div className="flex items-center mb-3">
                <Instagram size={18} className="text-gray-500 mr-3" />
                <a 
                  href={instagram} 
                  className="text-sm text-blue-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
            )}
            
            {facebook && (
              <div className="flex items-center mb-3">
                <Facebook size={18} className="text-gray-500 mr-3" />
                <a 
                  href={facebook} 
                  className="text-sm text-blue-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </div>
            )}
          </div>

          {/* Facility information */}
          <div className="border-t border-gray-200 pt-4 pb-4">
            <h3 className="font-medium mb-3">시설 정보</h3>
            <div className="grid grid-cols-3 gap-3">
              {facilities.map((facility, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    {/* Placeholder for facility icon */}
                    <span className="text-xs">{facility.charAt(0)}</span>
                  </div>
                  <span className="text-xs text-center">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby attractions */}
          {nearbyAttractions.length > 0 && (
            <div className="border-t border-gray-200 pt-4 pb-4">
              <h3 className="font-medium mb-3">주변 명소</h3>
              <div className="space-y-2">
                {nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm">{attraction.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{attraction.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed action bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between">
          <div>
            {phone ? (
              <a 
                href={`tel:${phone}`} 
                className="text-blue-600"
              >
                전화하기
              </a>
            ) : (
              <span className="text-gray-400">전화번호 없음</span>
            )}
          </div>
          <Button className="bg-[#FF8433] hover:bg-[#FF6D1A]">
            길찾기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
