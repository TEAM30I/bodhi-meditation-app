
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TempleBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-[24px] mb-[20px]">
      <div className="w-full h-[130px] rounded-[10px] bg-gray-200 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-[#DE7834] text-white">
          <p className="text-lg font-semibold">사찰 배너</p>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          1/3
        </div>
      </div>
    </div>
  );
};

export default TempleBanner;
