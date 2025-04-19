
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Globe, Share, Heart, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Temple {
  id: string;
  name: string;
  address: string;
  contact: string;
  description: string;
  image_url: string;
  region: string;
}

const TempleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTemple = async () => {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching temple:', error);
        return;
      }

      setTemple(data);
    };

    fetchTemple();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast({
        title: "찜 목록에 추가되었습니다.",
        description: temple?.name + "이(가) 찜 목록에 추가되었습니다.",
      });
    } else {
      toast({
        title: "찜 목록에서 제거되었습니다.",
        description: temple?.name + "이(가) 찜 목록에서 제거되었습니다.",
      });
    }
  };

  if (!temple) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>사찰 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
        <button onClick={() => navigate(-1)} className="flex items-center">
          <ArrowLeft size={24} />
        </button>
        <div className="w-6" />
        <button onClick={() => navigate('/main')} className="flex items-center">
          <Home size={24} />
        </button>
      </div>

      {/* Temple Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={temple.image_url || 'https://via.placeholder.com/400x300'} 
          alt={temple.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={handleToggleFavorite}
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          >
            <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"} />
          </button>
          <button className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
            <Share size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <h1 className="text-xl font-bold">{temple.name}</h1>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{temple.region}</span>
          </div>
        </div>
      </div>

      {/* Temple Info */}
      <div className="px-5 py-4">
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
          <MapPin size={14} className="text-gray-500" />
          <span>{temple.address}</span>
        </div>
        
        {temple.description && (
          <p className="text-gray-700 text-sm mb-4">{temple.description}</p>
        )}

        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => window.open(`https://map.kakao.com/link/search/${temple.address}`, '_blank')}
            className="flex-1 py-2 bg-[#DE7834] text-white rounded-lg text-sm font-medium"
          >
            길찾기
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(temple.address);
              toast({ title: "주소가 복사되었습니다." });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            주소복사
          </button>
        </div>

        {/* Contact */}
        {temple.contact && (
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Globe size={14} className="text-gray-500" />
            <span>{temple.contact}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleDetail;
