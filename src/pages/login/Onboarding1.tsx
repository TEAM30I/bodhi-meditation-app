
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import AuthButton from '@/components/AuthButton';

const Onboarding1: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-60 h-60 mb-10">
          <img 
            src="/lovable-uploads/3284e678-049d-45f1-9038-708dc004c935.png" 
            alt="Map location illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          마음 쉬어갈 곳,<br />지금 찾아보세요
        </h1>
        
        <p className="text-app-gray-text text-center mb-24">
          전국 사찰과 템플스테이를 한눈에
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-12">
          <div className="w-7 h-1 rounded-full bg-app-orange"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
        </div>
        
        <AuthButton 
          label="시작하기" 
          onClick={() => navigate('/onboarding2')} 
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Onboarding1;
