import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import AuthButton from '@/components/login/AuthButton';

const FindCredentialsChoice: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="아이디/비밀번호 찾기" />
      
      <div className="flex-1 flex flex-col items-center justify-center animate-slide-up max-w-[480px] mx-auto w-full">
        <p className="text-white text-lg sm:text-xl text-center mb-8 sm:mb-10">
          찾고자 하는 정보를<br />선택해주세요
        </p>
        
        <AuthButton 
          label="아이디 찾기" 
          onClick={() => navigate('/find-id')}
          className="mb-4 w-full max-w-[320px]"
        />
        
        <AuthButton 
          label="비밀번호 찾기" 
          onClick={() => navigate('/find-password')}
          className="w-full max-w-[320px]"
        />
      </div>
    </div>
  );
};

export default FindCredentialsChoice;
