
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import AuthButton from '@/components/AuthButton';

const AuthChoice: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-60 h-60 mb-10">
          <img 
            src="/lovable-uploads/ebc6445a-2b8f-465b-a537-0032026e76d8.png" 
            alt="Praying hands illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-white text-2xl font-bold text-center mb-10">
          BODHI와 함께 시작해보세요
        </h1>
        
        <div className="w-full mt-auto">
          <AuthButton 
            label="로그인" 
            onClick={() => navigate('/login')} 
            className="w-full mb-4"
          />
          
          <p className="text-gray-500 text-center mb-4">
            아직 회원이 아니신가요? <span className="text-app-orange" onClick={() => navigate('/signup')}>회원가입</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
