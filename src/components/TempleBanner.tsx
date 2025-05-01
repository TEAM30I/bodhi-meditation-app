
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopLikedTemples, Temple } from '@/utils/repository';

const TempleBanner = () => {
  const navigate = useNavigate();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        const topTemples = await getTopLikedTemples(3);
        if (topTemples.length > 0) {
          setTemples(topTemples);
        }
      } catch (error) {
        console.error("Error fetching top temples for banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();

    // Auto rotate banners every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, temples.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [temples.length]);

  const handleClick = () => {
    if (temples.length > 0) {
      navigate(`/search/temple/detail/${temples[currentIndex].id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-[24px] mb-[20px]">
        <div className="w-full h-[130px] rounded-[10px] bg-gray-200 animate-pulse relative overflow-hidden">
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[24px] mb-[20px]">
      <div 
        className="w-full h-[130px] rounded-[10px] bg-gray-200 relative overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="w-full h-full flex items-center justify-center bg-[#DE7834] text-white">
          {temples.length > 0 ? (
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 bg-center bg-cover" 
                style={{
                  backgroundImage: `url(${temples[currentIndex]?.imageUrl || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
                <p className="text-2xl font-semibold">{temples[currentIndex]?.name}</p>
                <p className="text-sm mt-2">{temples[currentIndex]?.location}</p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold">사찰 배너</p>
          )}
        </div>
        {temples.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{temples.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleBanner;
