
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Heart, Share, Link, ExternalLink, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTempleStayDetail, followTempleStay, unfollowTempleStay, TempleStay } from '@/utils/repository';
import { toast } from '@/components/ui/use-toast';

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [templeStay, setTempleStay] = useState<TempleStay | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTempleStayDetail = async () => {
      if (!id) {
        setError('템플스테이 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getTempleStayDetail(id);
        
        if (!data) {
          setError('템플스테이 정보를 찾을 수 없습니다.');
        } else {
          setTempleStay(data);
          
          // 사용자의 찜 상태 확인 (예시 - 실제로는 사용자 인증 정보 필요)
          const userId = localStorage.getItem('userId'); // 실제 구현에서는 사용자 인증 시스템과 연동
          if (userId) {
            // 사용자가 로그인한 상태라면 찜 상태 확인 로직 구현
            // 예: checkFavoriteStatus(userId, id);
          }
        }
      } catch (err) {
        console.error('Error loading temple stay detail:', err);
        setError('템플스테이 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    loadTempleStayDetail();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!templeStay) return;
    
    try {
      const userId = localStorage.getItem('userId') || 'anonymous'; // 실제 구현에서는 실제 사용자 ID 필요
      
      if (isFavorite) {
        // 찜 해제
        await unfollowTempleStay(userId, templeStay.id);
        setIsFavorite(false);
        toast({
          title: "찜 목록에서 제거되었습니다.",
          description: `${templeStay.templeName}이(가) 찜 목록에서 제거되었습니다.`,
        });
      } else {
        // 찜하기
        await followTempleStay(userId, templeStay.id);
        setIsFavorite(true);
        toast({
          title: "찜 목록에 추가되었습니다.",
          description: `${templeStay.templeName}이(가) 찜 목록에 추가되었습니다.`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>템플스테이 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !templeStay) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error || '템플스테이를 찾을 수 없습니다.'}</p>
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

      {/* Temple Stay Image */}
      <div className="w-full h-[250px] relative">
        <img 
          src={templeStay.imageUrl} 
          alt={templeStay.templeName} 
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
          <h1 className="text-xl font-bold">{templeStay.templeName}</h1>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{templeStay.location}</span>
          </div>
        </div>
      </div>

      {/* Temple Stay Info */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex flex-wrap gap-2 mb-4">
          {templeStay.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>기간: {templeStay.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>가격: {templeStay.price.toLocaleString()}원</span>
          </div>
        </div>
        
        {templeStay.description && (
          <p className="text-gray-700 text-sm mt-4">
            {templeStay.description}
          </p>
        )}
      </div>
      
      {/* Direction */}
      {templeStay.direction && (
        <div className="bg-white px-5 py-4 mb-2">
          <h2 className="text-base font-bold mb-3">오시는 길</h2>
          <p className="text-sm text-gray-700">
            {templeStay.direction}
          </p>
        </div>
      )}
      
      {/* Schedule */}
      {templeStay.schedule && templeStay.schedule.length > 0 && (
        <div className="bg-white px-5 py-4 mb-2">
          <h2 className="text-base font-bold mb-3">일정</h2>
          <div className="space-y-3">
            {templeStay.schedule.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-20 text-sm text-gray-700 font-medium">{item.time}</div>
                <div className="flex-1 text-sm text-gray-700">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Reservation Link */}
      {templeStay.websiteUrl && (
        <div className="bg-white px-5 py-4 mb-2">
          <button 
            className="flex items-center justify-between w-full" 
            onClick={() => window.open(templeStay.websiteUrl, '_blank')}
          >
            <div className="flex items-center text-gray-700">
              <ExternalLink className="w-5 h-5 mr-2" />
              <span>예약 페이지로 이동</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TempleStayDetail;
