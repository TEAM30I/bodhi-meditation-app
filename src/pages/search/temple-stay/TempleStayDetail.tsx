
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Home } from 'lucide-react';
import { getTempleStayDetail, TempleStay } from '@/utils/repository';
import { toast, Toaster } from 'sonner';
import TempleStayDetailContent from '@/components/search/TempleStayDetailContent';

const TempleStayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [templeStay, setTempleStay] = useState<TempleStay | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          setTempleStay(data);
          console.log('Loaded temple stay:', data);
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
  }, [id, navigate]);

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
    <div className="bg-white min-h-screen pb-24">
      {/* Sonner Toaster */}
      <Toaster position="bottom-center" />
      
      {/* Header with navigation */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-transparent flex justify-between items-center p-4">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        <button onClick={() => navigate('/')} className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
          <Home className="h-5 w-5 text-black" />
        </button>
      </div>

      {/* Image at the top */}
      <div className="relative">
        <img 
          src={templeStay.imageUrl || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay"} 
          alt={templeStay.templeName}
          className="w-full h-64 object-cover"
        />
        
        {/* Image indicator (e.g., 1/4) */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          1/4
        </div>
      </div>

      {/* Title and actions */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold">{templeStay.templeName}</h1>
          <div className="flex space-x-2">
            <button className="p-1">
              <Share className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mt-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{templeStay.location} • {templeStay.direction || '도보 10분'}</span>
        </div>
        
        {/* Website */}
        {templeStay.websiteUrl && (
          <div className="text-gray-500 text-sm mt-1">
            {templeStay.websiteUrl}
          </div>
        )}
        
        {/* Divider */}
        <div className="border-b border-gray-200 my-4"></div>
        
        {/* Detail content */}
        <TempleStayDetailContent 
          templeStay={templeStay} 
          onGoToReservation={handleReservation}
        />
      </div>
    </div>
  );
};

export default TempleStayDetail;
