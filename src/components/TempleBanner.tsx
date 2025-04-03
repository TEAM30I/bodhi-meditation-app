
import React, { useState } from 'react';

interface TempleBannerProps {
  className?: string;
}

const TempleBanner: React.FC<TempleBannerProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 4;

  return (
    <div className={`w-full h-[188px] rounded-[10px] bg-bodhi-news relative ${className}`}>
      <div className="absolute right-[9px] bottom-[11px] bg-[#5B504F] rounded-[12px] px-[12px] py-[5px]">
        <span className="text-white text-[10px] font-bold">{currentSlide}</span>
        <span className="text-[#B9B8B8] text-[10px] font-bold">/ {totalSlides}</span>
      </div>

      {/* Banner content would go here */}
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-bodhi-textDark font-medium">사찰 이미지</p>
      </div>
    </div>
  );
};

export default TempleBanner;
