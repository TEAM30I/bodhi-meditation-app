import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Clock, Car } from 'lucide-react';
import { temples } from '@/data/templeData';

const TempleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the temple by id
  const temple = Object.values(temples).find(temple => temple.id === id);

  if (!temple) {
    return <div>사찰을 찾을 수 없습니다.</div>;
  }

  const handleBackClick = () => {
    navigate('/search/temple');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full px-6 py-4 flex items-center border-b">
        <button 
          onClick={handleBackClick}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1">
          <h1 className="text-lg font-bold">{temple.name}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button>
            <Heart size={20} />
          </button>
          <button>
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={temple.imageUrl}
          alt={temple.name}
          className="w-full h-[240px] object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Location and Distance */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{temple.location}</span>
          {temple.distance && (
            <span className="ml-2">({temple.distance})</span>
          )}
        </div>

        {/* Opening Hours */}
        {temple.openingHours && (
          <div className="flex items-center text-gray-600 mb-2">
            <Clock className="w-4 h-4 mr-1" />
            <span>{temple.openingHours}</span>
          </div>
        )}

        {/* Description */}
        {temple.description && (
          <p className="text-gray-700 mb-4">{temple.description}</p>
        )}

        {/* Tags */}
        {temple.tags && temple.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {temple.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Parking Lot Information */}
        <div className="flex items-center text-gray-600 mb-2">
          <Car className="w-4 h-4 mr-1" />
          <span>
            {temple.hasParkingLot ? '주차 가능' : '주차 불가'}
          </span>
        </div>

        {/* Temple Stay Information */}
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>
            {temple.hasTempleStay ? '템플스테이 운영' : '템플스테이 미운영'}
          </span>
        </div>

        {/* Direction */}
        {temple.direction && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">오시는 길</h4>
            <p className="text-gray-700">{temple.direction}</p>
          </div>
        )}

        {/* Website URL */}
        {temple.websiteUrl && (
          <div>
            <h4 className="font-semibold mb-2">웹사이트</h4>
            <a
              href={temple.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {temple.websiteUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleDetail;
