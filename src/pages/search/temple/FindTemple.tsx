import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';
import { getTempleDetail } from '@/lib/repository';
import { Temple } from '@/types';

const TempleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // 사찰 상세 정보 로드
  useEffect(() => {
    const fetchTemple = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTempleDetail(id);
        if (data) {
          setTemple(data);
          console.log('Loaded temple:', data);
        } else {
          toast.error('사찰 정보를 찾을 수 없습니다.');
          navigate('/search/temple');
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
        toast.error('사찰 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemple();
  }, [id, navigate]);

  // 찜하기/찜 해제 토글
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(`${temple?.name}을(를) ${!isFavorite ? '찜 목록에 추가했습니다.' : '찜 목록에서 제거했습니다.'}`);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
      </div>
    );
  }

  // 에러 상태 표시
  if (!temple) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen relative">
      {/* Sonner Toaster */}
      <Toaster position="bottom-center" />
      
      {/* Header with navigation */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-transparent flex justify-between items-center p-4 max-w-[480px] mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:bg-white/90 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:bg-white/90 transition-colors"
        >
          <Home className="h-5 w-5 text-black" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[480px] mx-auto">
        {/* Image at the top */}
        <div className="relative w-full">
          <img 
            src={temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple"} 
            alt={temple.name}
            className="w-full h-[300px] object-cover"
          />
          
          {/* Image indicator */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
            1/1
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title and actions */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{temple.name}</h1>
            <div className="flex space-x-2">
              <button 
                onClick={handleToggleFavorite}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#DE7834] stroke-[#DE7834]' : 'text-gray-600'}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-5">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="leading-relaxed">{temple.address}</span>
          </div>
          
          {/* Divider */}
          <div className="border-b border-gray-200 my-5"></div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">소개</h2>
            <p className="text-gray-700 leading-relaxed">{temple.description}</p>
          </div>
          
          {/* Region */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">지역</h2>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {temple.region}
            </Badge>
          </div>
          
          {/* Contact */}
          {temple.contact && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">연락처</h2>
              <p className="text-gray-700">{temple.contact}</p>
            </div>
          )}
          
          {/* Map */}
          {(temple.latitude && temple.longitude) && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">위치</h2>
              <div className="bg-gray-100 rounded-lg h-[200px] flex items-center justify-center" id="kakao-map">
                <div className="text-gray-500">지도 로딩 중...</div>
              </div>
            </div>
          )}
          
          {/* Temple Stay Link (if available) */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => navigate('/search/temple-stay')}
            >
              <div>
                <h3 className="font-medium">이 사찰의 템플스테이 보기</h3>
                <p className="text-sm text-gray-500">템플스테이 프로그램을 확인해보세요</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="max-w-[480px] mx-auto flex items-center gap-3">
          <Button
            onClick={handleToggleFavorite}
            variant="outline"
            className="w-12 h-12 rounded-full flex items-center justify-center p-0"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-[#DE7834] stroke-[#DE7834]' : 'stroke-gray-600'}`} />
          </Button>
          <Button 
            className="flex-1 h-12 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl"
            onClick={() => navigate(`/search/temple-stay?temple=${temple.id}`)}
          >
            템플스테이 보기
          </Button>
        </div>
      </div>
      
      {/* Bottom Padding for Mobile */}
      <div className="h-24"></div>
    </div>
  );
};

export default TempleDetail;