import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Home, Navigation } from 'lucide-react';
import { getTempleStayDetail } from '@/lib/repository';
import { TempleStay } from '@/types';
import { toast, Toaster } from 'sonner';
import TempleStayDetailContent from '@/components/search/TempleStayDetailContent';
import { useAuth } from '@/context/AuthContext';
import { isTempleStayFollowed, toggleTempleStayFollow } from '@/lib/repository';
import { getCurrentLocation, calculateDistance, formatDistance } from '@/utils/locationUtils';

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [templeStay, setTempleStay] = useState<TempleStay | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const handleReservation = () => {
    if (templeStay?.websiteUrl) {
      window.open(templeStay.websiteUrl, '_blank');
    } else {
      toast.error('예약 링크가 없습니다.');
    }
  };

  useEffect(() => {
    const fetchTempleStay = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTempleStayDetail(id);
        if (data) {
          // 위치 정보가 있는 경우 현재 위치와의 거리 계산
          if (data.temple?.latitude && data.temple?.longitude) {
            try {
              const userLocation = await getCurrentLocation();
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                data.temple.latitude,
                data.temple.longitude
              );
              data.distance = formatDistance(distance);
            } catch (error) {
              console.error('Error calculating distance:', error);
            }
          }
          
          setTempleStay(data);
          console.log('Loaded temple stay:', data);
          
          // 사용자가 로그인한 경우 찜 상태 확인
          if (user && id) {
            try {
              const status = await isTempleStayFollowed(user.id, id);
              setIsLiked(status);
            } catch (error) {
              console.error('Error checking like status:', error);
            }
          }
        } else {
          toast.error('템플스테이 정보를 찾을 수 없습니다.');
          navigate('/search/temple-stay');
        }
      } catch (error) {
        console.error('Error fetching temple stay:', error);
        toast.error('템플스테이 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTempleStay();
  }, [id, navigate, user]);

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      const newStatus = await toggleTempleStayFollow(user.id, id!);
      setIsLiked(newStatus);
      
      // 좋아요 카운트 업데이트
      setTempleStay(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likeCount: (prev.likeCount || 0) + (newStatus ? 1 : -1)
        };
      });
      
      toast.success(newStatus ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]" />
      </div>
    );
  }

  if (!templeStay) {
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
            src={templeStay.imageUrl || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay"} 
            alt={templeStay.templeName}
            className="w-full h-[300px] object-cover"
          />
          
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title and actions */}
          <div className="flex flex-col mb-4">
            {/* 사찰 이름을 위로 이동 */}
            {templeStay.temple?.name && (
              <div className="text-base font-medium text-gray-800 mb-1">
                <Home className="w-4 h-4 inline mr-1" />
                {templeStay.temple.name}
              </div>
            )}
            {/* 템플스테이 이름을 아래로 이동하고 스타일 조정 */}
            <h1 className="text-xl font-bold text-gray-900 mt-1">{templeStay.templeName}</h1>
          </div>
          
          {/* Location and Direction with separate sections */}
          <div className="flex flex-col space-y-4 text-gray-600 text-sm mb-3">
            {/* Temple Address with MapPin icon */}
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="leading-relaxed">{templeStay.temple?.address || templeStay.location}</span>
            </div>
            
            {/* 거리 정보가 있는 경우 표시 */}
            {templeStay.distance && (
              <div className="flex items-center">
                <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="leading-relaxed">현재 위치에서 {templeStay.distance}</span>
              </div>
            )}
            
            {/* Direction as "오시는 길" section without icon */}
            {templeStay.direction && (
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">오시는 길</h3>
                <div className="flex items-start">
                  <span className="leading-relaxed">{templeStay.direction}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="border-b border-gray-200 my-5"></div>
          
          {/* Detail content */}
          <TempleStayDetailContent 
            templeStay={templeStay} 
            onGoToReservation={handleReservation}
            isLiked={isLiked}
            onLikeToggle={handleToggleLike}
          />
        </div>
      </div>

      {/* Bottom Padding for Mobile */}
      <div className="h-24"></div>
    </div>
  );
};

export default TempleStayDetail;
