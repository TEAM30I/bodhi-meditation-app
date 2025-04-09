
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { typedData } from '@/utils/typeUtils';

// Use relative import with `public` at the beginning
import { imageRepository } from '../../public/data/imageRepository';
import { regionSearchRankings } from '../../public/data/searchRankingRepository';

const TempleBanner = () => {
  const navigate = useNavigate();
  const typedImageRepo = typedData<typeof imageRepository>(imageRepository);

  return (
    <div className="w-full px-[24px] mb-[20px]">
      <div className="w-full h-[130px] rounded-[10px] bg-gray-200 relative overflow-hidden">
        <img 
          src={typedImageRepo.templeBanner.default} 
          alt="메인 배너" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          1/3
        </div>
      </div>
    </div>
  );
};

export default TempleBanner;
