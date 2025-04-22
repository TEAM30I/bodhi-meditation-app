// TempleStayDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Heart, Share, Globe, ChevronRight, Home } from 'lucide-react';
import { 
  getTempleStayDetail, 
  followTempleStay, 
  unfollowTempleStay, 
  TempleStay 
} from '@/utils/repository';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const TempleStayDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [templeStay, setTempleStay] = useState<TempleStay | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 템플스테이 상세 정보 로드
  useEffect(() => {
    const loadTempleStayDetail = async () => {
      if (!id) {
        setError('템플스테이 ID가 제공되지 않았습니다.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const templeStayData = await getTempleStayDetail(id);
        
        if (!templeStayData) {
          setError('템플스테이 정보를 찾을 수 없습니다.');
        } else {
          setTempleStay(templeStayData);
          
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

  // 찜하기/찜 해제 토글
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

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>템플스테이 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error || !templeStay) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error || '템플스테이를 찾을 수 없습니다.'}</p>
        <button 
          className="px-4 py-2 bg-gray-200 rounded-md" 
          onClick={() => navigate(-1)}
        >
          이전 화면으로 돌아가기
        </button>
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
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="rounded-full">
            {templeStay.duration}
          </Badge>
          {templeStay.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        
        {templeStay.description && (
          <p className="text-gray-700 text-sm mb-4">{templeStay.description}</p>
        )}
      </div>
      
      {/* Temple Stay Schedule */}
      {templeStay.schedule && templeStay.schedule.length > 0 && (
        <div className="bg-white px-5 py-4 mb-2">
          <h2 className="text-base font-bold mb-3">프로그램 일정</h2>
          <div className="space-y-3">
            {templeStay.schedule.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-16 text-sm font-medium text-gray-700">{item.time}</div>
                <div className="flex-1 text-sm text-gray-600">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Temple Stay Program */}
      <div className="bg-white px-5 py-4 mb-2">
        <h2 className="text-base font-bold mb-3">이용안내</h2>
        
        <div className="mb-3">
          <h3 className="text-sm font-medium mb-2">위치</h3>
          <div className="text-gray-700 text-sm mb-2">
            {templeStay.direction}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">유의사항</h3>
          <div className="text-gray-700 text-sm">
            <p>• 프로그램은 현장 상황에 따라 일부 변경될 수 있습니다.</p>
            <p>• 사찰 내에서는 정숙하여 주시기 바랍니다.</p>
            <p>• 자연을 훼손하는 행위는 삼가 주시기 바랍니다.</p>
          </div>
        </div>
      </div>
      
      {/* Temple Stay Website */}
      {templeStay.websiteUrl && (
        <div className="bg-white px-5 py-4 mb-2">
          <button 
            className="flex items-center justify-between w-full" 
            onClick={() => window.open(templeStay.websiteUrl, '_blank')}
          >
            <div className="flex items-center text-gray-700">
              <Globe className="w-5 h-5 mr-2" />
              <span>공식 웹사이트</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
      
      {/* Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">{templeStay.price.toLocaleString()}원</span>
            <span className="text-sm text-gray-500">/ 인</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">찜</span>
            <div className="flex items-center">
              <Heart size={16} className="text-red-500 mr-1" />
              <span className="text-sm font-medium">{templeStay.likeCount}</span>
            </div>
          </div>
        </div>
        <button 
          className="w-full bg-[#DE7834] text-white py-3 rounded-lg font-medium"
          onClick={() => templeStay.websiteUrl ? window.open(templeStay.websiteUrl, '_blank') : null}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default TempleStayDetail;
