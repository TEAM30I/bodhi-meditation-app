
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import AuthButton from '@/components/login/AuthButton';
import onboarding2 from '../../../public/onboarding2.png'

const Onboarding2: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-60 h-60 mb-10">
          <img src={onboarding2} alt="Onboarding Image" />
        </div>
        
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          마음 쉬어갈 곳,<br />지금 찾아보세요
        </h1>
        
        <p className="text-app-gray-text text-center mb-24">
          전국 사찰과 템플스테이를 한눈에
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-12">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          <div className="w-7 h-1 rounded-full bg-app-orange"></div>
        </div>


        
        <AuthButton 
          label="시작하기" 
          onClick={() => navigate('/auth-choice')} 
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Onboarding2;
