
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import AuthButton from '@/components/login/AuthButton';

const FindCredentials: React.FC = () => {
  const navigate = useNavigate();
  
  const handleFindCredentials = () => {
    navigate('/find-credentials-choice');
  };
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="아이디/비밀번호 찾기" />
      
      <div className="flex-1 flex flex-col items-center justify-center animate-slide-up">
        <p className="text-white text-center mb-10">
          찾고자 하는 정보를 선택해주세요
        </p>
        
        <AuthButton 
          label="아이디/비밀번호 찾기" 
          onClick={handleFindCredentials}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FindCredentials;
