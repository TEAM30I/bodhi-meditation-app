import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, ChevronRight, Home, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';
import { getTempleDetail, isTempleFollowed, toggleTempleFollow } from '@/lib/repository';
import {getCurrentLocation,calculateDistance, formatDistance} from '@/utils/locationUtils'
import { Temple } from '@/types';
import { useAuth } from '@/context/AuthContext';

const TempleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
        console.log('Loading temple detail for ID:', id);
        const data = await getTempleDetail(id);
        console.log('Temple detail data:', data);
        
        if (data) {
          // DB 필드명과 프론트엔드 필드명 매핑
          if (data.image_url && !data.imageUrl) {
            data.imageUrl = data.image_url;
          }
          
          // 위치 정보가 있는 경우 현재 위치와의 거리 계산
          if (data.latitude && data.longitude) {
            try {
              const userLocation = await getCurrentLocation();
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                data.latitude,
                data.longitude
              );
              data.distance = formatDistance(distance);
            } catch (error) {
              console.error('Error calculating distance:', error);
            }
          }
          
          setTemple(data);
          
          // 사용자가 로그인한 경우 찜 상태 확인
          if (user) {
            try {
              const isFollowed = await isTempleFollowed(user.id, id);
              setIsFavorite(isFollowed);
            } catch (error) {
              console.error('Error checking follow status:', error);
            }
          }
        } else {
          setError('사찰 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error loading temple detail:', err);
        setError('사찰 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadTempleDetail();
  }, [id, user]);

  // 찜하기 토글 핸들러
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      return;
    }

    if (!id) {
      toast.error('사찰 정보가 올바르지 않습니다.');
      return;
    }

    try {
      const result = await toggleTempleFollow(user.id, id);
      setIsFavorite(result);
      
      // 찜 카운트 업데이트
      setTemple(prev => {
        if (!prev) return null;
        return {
          ...prev,
          follower_count: (prev.follower_count || 0) + (result ? 1 : -1)
        };
      });
      
      toast.success(`${result ? '찜 목록에 추가했습니다.' : '찜 목록에서 제거했습니다.'}`);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
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
  if (error || !temple) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error || '사찰을 찾을 수 없습니다.'}</p>
        <Button onClick={() => navigate(-1)}>이전 화면으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
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

      {/* Temple images */}
      <div className="h-72 bg-gray-200">
        <img 
          src={temple.imageUrl || temple.image_url || '/placeholder-temple.jpg'} 
          alt={temple.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Temple info */}
      <div className="max-w-[480px] mx-auto px-5 pt-4">
        <h1 className="text-2xl font-bold">{temple.name}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{temple.address}</span>
        </div>
        
        {/* 거리 정보가 있는 경우 표시 */}
        {temple.distance && (
          <div className="flex items-center mt-2 text-gray-600">
            <Navigation className="h-4 w-4 mr-1" />
            <span className="text-sm">현재 위치에서 {temple.distance}</span>
          </div>
        )}
        
        <div className="mt-6 space-y-6">
          {/* Description */}
          {temple.description && (
            <div>
              <h2 className="text-lg font-bold mb-2">소개</h2>
              <p className="text-gray-700">{temple.description}</p>
            </div>
          )}
          
          {/* Region */}
          {temple.region && (
            <div>
              <h2 className="text-lg font-bold mb-2">지역</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full">
                  {temple.region}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Contact Info */}
          {temple.contact && (
            <div>
              <h2 className="text-lg font-bold mb-2">연락처</h2>
              <p className="text-gray-700">{temple.contact}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom fixed buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="max-w-[480px] mx-auto flex items-center justify-center">
          <Button
            onClick={handleToggleFavorite}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 bg-[#DE7834] hover:bg-[#C26A2D] text-white"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white stroke-white' : 'stroke-white'}`} />
            <span>{isFavorite ? '찜 해제하기' : '찜하기'}</span>
            <span className="ml-1">({temple?.follower_count || 0})</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
