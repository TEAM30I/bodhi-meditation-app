
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding2 = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate('/login/auth');
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#181A20]">
      <div className="w-full max-w-[390px] flex flex-col items-center">
        <div className="flex flex-col items-center justify-center flex-grow px-5 mt-[103px]">
          <img 
            src="/assets/location-pin-map.png" 
            alt="Location Pin Map Icon" 
            className="w-[180px] h-[180px] mb-[55px]"
          />
          
          <div className="flex flex-col items-center gap-3 max-w-[230px]">
            <h1 className="text-white text-center font-pretendard text-[32px] md:text-[28px] font-medium leading-[140%] tracking-[-0.8px]">
              마음 쉬어갈 곳, 지금 찾아보세요
            </h1>
            <p className="text-white text-center font-pretendard text-[14px] font-normal leading-[140%] tracking-[-0.35px]">
              전국 사찰과 템플스테이를 한눈에
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 w-full px-5 mt-auto mb-[34px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#776D62]"></div>
            <div className="w-8 h-2 rounded-full bg-bodhi-orange"></div>
          </div>
          <button 
            onClick={handleStart}
            className="w-full max-w-[320px] h-[60px] rounded-[18px] bg-bodhi-orange text-white font-medium text-lg flex items-center justify-center font-pretendard tracking-[-0.45px]"
          >
            시작하기
          </button>
        </div>
        
        <div className="flex justify-center items-center w-full h-[34px] pb-2">
          <div className="w-[134px] h-[5px] rounded-full bg-[#626877]"></div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding2;
