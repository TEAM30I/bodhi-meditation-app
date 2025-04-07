
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding1 = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate('/login/onboarding2');
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#181A20]">
      <div className="w-full max-w-[390px] flex flex-col items-center h-full">
        <div className="flex flex-col items-center justify-center flex-grow px-5 mt-8">
          <img 
            src="/lovable-uploads/4250c085-a971-447f-a02e-e5dea198362f.png" 
            alt="Books Icon" 
            className="w-[250px] h-[250px] mb-[30px]"
          />
          
          <div className="flex flex-col items-center gap-3 max-w-[230px]">
            <h1 className="text-white text-center font-pretendard text-[32px] font-medium leading-[140%] tracking-[-0.8px]">
              한 구절의 깨달음, 매일 새롭게
            </h1>
            <p className="text-white text-center font-pretendard text-[14px] font-normal leading-[140%] tracking-[-0.35px]">
              경전 속 지혜, 오늘도 가볍게 한 구절씩
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 w-full px-5 mt-auto mb-[60px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 rounded-full bg-bodhi-orange"></div>
            <div className="w-2 h-2 rounded-full bg-[#776D62]"></div>
          </div>
          <button 
            onClick={handleStart}
            className="w-full max-w-[320px] h-[60px] rounded-[18px] bg-bodhi-orange text-white font-medium text-lg flex items-center justify-center font-pretendard tracking-[-0.45px]"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding1;
