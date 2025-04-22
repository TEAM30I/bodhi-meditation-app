
// TempleDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Heart, Share, Globe, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTempleDetail, followTemple, unfollowTemple, Temple } from '@/utils/repository';
import { toast } from '@/components/ui/use-toast';

const TempleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 사찰 상세 정보 로드
  useEffect(() => {
    const loadTempleDetail = async () => {
      if (!id) {
        setError('사찰 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const templeData = await getTempleDetail(id);
        
        if (!templeData) {
          setError('사찰 정보를 찾을 수 없습니다.');
        } else {
          setTemple(templeData);
          
          // 사용자의 찜 상태 확인 (예시 - 실제로는 사용자 인증 정보 필요)
          const userId = localStorage.getItem('userId'); // 실제 구현에서는 사용자 인증 시스템과 연동
          if (userId) {
            // 사용자가 로그인한 상태라면 찜 상태 확인 로직 구현
            // 예: checkFavoriteStatus(userId, id);
          }
        }
      } catch (err) {
        console.error('Error loading temple detail:', err);
        setError('사찰 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTempleDetail();
  }, [id]);

  // 찜하기/찜 해제 토글
  const handleToggleFavorite = async () => {
    if (!temple) return;
    
    try {
      const userId = localStorage.getItem('userId') || 'anonymous'; // 실제 구현에서는 실제 사용자 ID 필요
      
      if (isFavorite) {
        // 찜 해제
        await unfollowTemple(userId, temple.id);
        setIsFavorite(false);
        toast({
          title: "찜 목록에서 제거되었습니다.",
          description: `${temple.name}이(가) 찜 목록에서 제거되었습니다.`,
        });
      } else {
        // 찜하기
        await followTemple(userId, temple.id);
        setIsFavorite(true);
        toast({
          title: "찜 목록에 추가되었습니다.",
          description: `${temple.name}이(가) 찜 목록에 추가되었습니다.`,
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "오류 발생",
        description: "찜하기 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>사찰 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error || !temple) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error || '사찰을 찾을 수 없습니다.'}</p>
        <Button onClick={() => navigate(-1)}>이전 화면으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="w-6" />
        <button 
          onClick={() => navigate('/main')}
          className="flex items-center space-x-1"
        >
          <Home size={24} />
        </button>
      </div>

      {/* Temple Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={temple.imageUrl} 
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
          <button 
            className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          >
            <Share size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <h1 className="text-xl font-bold">{temple.name}</h1>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{temple.location}</span>
          </div>
        </div>
      </div>

      {/* Temple Info */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {temple.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        
        {temple.description && (
          <p className="text-gray-700 text-sm mb-4">{temple.description}</p>
        )}
        
        {temple.openingHours && (
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>운영시간: {temple.openingHours}</span>
          </div>
        )}
      </div>
      
      {/* Temple Tags/Features */}
      {temple.facilities && temple.facilities.length > 0 && (
        <div className="bg-white px-5 py-4 mb-2">
          <div className="flex flex-wrap gap-2">
            {temple.facilities.map((facility, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 rounded-full">
                {facility}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Contact Info */}
      {temple.contact && temple.contact.phone && (
        <div className="bg-white px-5 py-4 mb-2">
          <h2 className="text-base font-bold mb-3">연락처 정보</h2>
          <div className="text-sm text-gray-700">
            <p>전화번호: {temple.contact.phone}</p>
          </div>
        </div>
      )}
      
      {/* Temple Website */}
      {temple.websiteUrl && (
        <div className="bg-white px-5 py-4 mb-2">
          <button 
            className="flex items-center justify-between w-full" 
            onClick={() => window.open(temple.websiteUrl, '_blank')}
          >
            <div className="flex items-center text-gray-700">
              <Globe className="w-5 h-5 mr-2" />
              <span>공식 웹사이트</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TempleDetail;
