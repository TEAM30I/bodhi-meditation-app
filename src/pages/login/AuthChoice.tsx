import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import CommonButton from '@/components/login/CommonButton';

const AuthChoice: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in max-w-[480px] mx-auto w-full">
        <div className="w-48 h-48 sm:w-60 sm:h-60 mb-8 sm:mb-10">
          <img src="/authchoice.png" alt="authchoice image" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="text-white text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-10">
          불교를 일상 속에서<br />자연스럽게 경험해보세요
        </h1>
        
        <p className="text-gray-500 text-sm sm:text-base text-center mb-8 sm:mb-12">
          아직 회원이 아니신가요? 
          <span className="text-app-orange cursor-pointer" onClick={() => navigate('/signup')}>
            회원가입
          </span>
        </p>

        <CommonButton 
          label="로그인" 
          onClick={() => navigate('/login')} 
        />
      </div>
    </div>
  );
};

export default AuthChoice;