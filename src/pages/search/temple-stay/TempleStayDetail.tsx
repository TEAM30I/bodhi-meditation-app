import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Heart, Phone, Link } from 'lucide-react';
import { getTempleStayDetail } from '@/utils/repository';
import { TempleStay } from '@/types/templeStay';
import Button from '@/components/ui/Button';
import TempleStayMap from '@/components/TempleStayMap';

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [templeStay, setTempleStay] = useState<TempleStay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTempleStay = async () => {
      if (id) {
        setLoading(true);
        try {
          const detail = await getTempleStayDetail(id);
          setTempleStay(detail);
        } catch (error) {
          console.error("Error fetching temple stay detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTempleStay();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!templeStay) {
    return <div className="text-center py-8">Temple Stay not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">{templeStay.templeName}</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{templeStay.location}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Heart className="w-4 h-4 mr-2" />
          <span>{templeStay.likeCount || 0} Likes</span>
        </div>
      </div>

      <div className="mb-6">
        <img
          src={templeStay.imageUrl}
          alt={templeStay.templeName}
          className="w-full h-64 object-cover rounded-md"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">소개</h3>
        <p className="text-gray-700">{templeStay.description || "No description available."}</p>
      </div>

      {templeStay.tags && templeStay.tags.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">태그</h3>
          <div className="flex flex-wrap gap-2">
            {templeStay.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">가격</h3>
        <p className="text-gray-700">{templeStay.price} 원 / 1인</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">오시는 길</h3>
        <p className="text-gray-700">{templeStay.direction || "No direction information available."}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">일정</h3>
        {templeStay.schedule && templeStay.schedule.length > 0 ? (
          <ul className="list-disc pl-5">
            {templeStay.schedule.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.day && `Day ${item.day}: `} {item.time} - {item.activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No schedule information available.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">편의시설</h3>
        {templeStay.facilities && templeStay.facilities.length > 0 ? (
          <ul className="list-disc pl-5">
            {templeStay.facilities.map((facility, index) => (
              <li key={index} className="text-gray-700">{facility}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No facilities information available.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">문의</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Phone className="w-4 h-4 mr-2" />
          <span>{templeStay.contact?.phone || "No contact information available."}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{templeStay.duration || "일정 정보 없음"}</span>
        </div>
        {templeStay.websiteUrl && (
          <div className="flex items-center text-gray-600 mb-2">
            <Link className="w-4 h-4 mr-2" />
            <a href={templeStay.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Website
            </a>
          </div>
        )}
      </div>

      {templeStay.latitude && templeStay.longitude && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">위치 정보</h3>
          <TempleStayMap latitude={templeStay.latitude} longitude={templeStay.longitude} />
        </div>
      )}

      {templeStay.websiteUrl && (
        <Button
          onClick={() => window.open(templeStay.websiteUrl, '_blank')}
          className="bg-[#DE7834] text-white hover:bg-[#C56A2D] w-full"
        >
          예약 사이트 방문
        </Button>
      )}
    </div>
  );
};

export default TempleStayDetail;
