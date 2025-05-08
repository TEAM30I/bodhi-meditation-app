import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';
import { getTempleDetail, isTempleFollowed, toggleTempleFollow } from '@/lib/repository';
import { Temple } from '@/types';
import { useAuth } from '@/hooks/useAuth';

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
        console.log('Loading temple detail for ID:', id); // 디버깅용 로그 추가
        const data = await getTempleDetail(id);
        console.log('Temple detail data:', data); // 디버깅용 로그 추가
        
        if (data) {
          // DB 필드명과 프론트엔드 필드명 매핑
          if (data.image_url && !data.imageUrl) {
            data.imageUrl = data.image_url;
          }
          setTemple(data);
          
          // 사용자가 로그인한 경우 찜 상태 확인
          if (user) {
            console.log('Checking if temple is followed by user:', user.id); // 디버깅용 로그 추가
            const followed = await isTempleFollowed(user.id, id);
            console.log('Temple followed status:', followed); // 디버깅용 로그 추가
            setIsFavorite(followed);
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

  // 찜하기/찜 해제 토글
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('로그인이 필요한 기능입니다.');
      navigate('/login', { state: { from: `/search/temple/${id}` } });
      return;
    }
    
    if (!temple || !id) return;
    
    try {
      const result = await toggleTempleFollow(user.id, id);
      setIsFavorite(result);
      toast.success(`${temple.name}을(를) ${result ? '찜 목록에 추가했습니다.' : '찜 목록에서 제거했습니다.'}`);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('찜하기 처리 중 오류가 발생했습니다.');
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
      <div className="fixed top-0 left-0 right-0 z-10 bg-transparent flex justify-between items-center p-4">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleToggleFavorite} className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#DE7834] stroke-[#DE7834]' : 'stroke-black'}`} />
          </button>
          <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
            <Share className="h-5 w-5 text-black" />
          </button>
        </div>
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
        <div className="max-w-[480px] mx-auto flex items-center gap-3">
          <Button
            onClick={handleToggleFavorite}
            variant="outline"
            className="w-12 h-12 rounded-full flex items-center justify-center p-0"
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-[#DE7834] stroke-[#DE7834]' : 'stroke-gray-600'}`} />
          </Button>
          <Button className="flex-1 h-12 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl">
            예약하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
