import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import CommonButton from '@/components/login/CommonButton';

const Onboarding2: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in max-w-[480px] mx-auto w-full">
        <div className="w-48 h-48 sm:w-60 sm:h-60 mb-8 sm:mb-10">
          <img src="/onboarding2.png" alt="Onboarding Image" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="text-white text-xl sm:text-2xl font-bold text-center mb-2">
          마음 쉬어갈 곳,<br />지금 찾아보세요
        </h1>
        
        <p className="text-app-gray-text text-sm sm:text-base text-center mb-16 sm:mb-24">
          전국 사찰과 템플스테이를 한눈에
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-8 sm:mb-12">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          <div className="w-7 h-1 rounded-full bg-app-orange"></div>
        </div>

        <CommonButton 
          label="시작하기" 
          onClick={() => navigate('/auth-choice')} 
        />
      </div>
    </div>
  );
};

export default Onboarding2;
