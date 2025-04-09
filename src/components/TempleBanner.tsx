
import React from 'react';
import { imageRepository } from '@/data/imageRepository';

interface TempleBannerProps {
  className?: string;
}

const TempleBanner: React.FC<TempleBannerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-[136px] rounded-[10px] overflow-hidden relative ${className}`}>
      <img 
        src={imageRepository.templeBanner.default}
        alt="Temple banner" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-[33px]">
        <div className="text-white font-bold text-[20px] tracking-[-0.5px] leading-7 mb-1">
          마음을 정화하는 시간,<br />
          템플스테이
        </div>
        <div className="text-white text-[14px] tracking-[-0.35px] leading-6">
          일상에서 벗어나 몸과 마음의 휴식을 찾아보세요.
        </div>
      </div>
    </div>
  );
};

export default TempleBanner;
