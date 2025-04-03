
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BodhiButton from '@/components/BodhiButton';
import InputField from '@/components/InputField';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock login - in a real app, you'd call an API
    navigate('/main');
    toast({
      title: "로그인 성공",
      description: "환영합니다!",
    });
  };

  return (
    <div className="w-full min-h-screen bg-bodhi-background flex flex-col items-center">
      <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
        <div className="text-[20px] font-bold text-[#111] font-pretendard leading-[130%] tracking-[0.4px] self-start">
          로그인
        </div>
        
        <BodhiLogo size="large" className="mt-[73px]" />
        
        <div className="mt-[92px] w-full">
          <InputField
            label="이메일 주소"
            placeholder="예) bodhi@bodhi.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mt-[37px] w-full">
          <InputField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="mt-[37px] w-full flex flex-col gap-[14px]">
          <BodhiButton 
            variant="secondary"
            onClick={handleLogin}
          >
            로그인
          </BodhiButton>
          
          <BodhiButton variant="kakao">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8952f40f56043ad05013c0b0e28df22b66421e31" 
              alt="Kakao Logo" 
              className="w-[39px] h-[39px] absolute left-[20px] top-[10px]"
            />
            <span className="mx-auto">카카오로 로그인</span>
          </BodhiButton>
          
          <BodhiButton variant="naver">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/250fd1e34f4480eba3ed785b35bf9c771939c599" 
              alt="Naver Logo" 
              className="w-[45px] h-[45px] absolute left-[18px] top-[7px]"
            />
            <span className="mx-auto">네이버로 로그인</span>
          </BodhiButton>
        </div>
        
        <div className="mt-1 w-full flex items-center justify-center gap-[45px] py-[18px]">
          <div 
            className="text-[#747474] text-[13px] font-noto font-bold leading-[22px] cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            이메일 가입
          </div>
          <div className="text-[#747474] text-[13px] font-noto font-bold leading-[22px] cursor-pointer">
            이메일 찾기
          </div>
          <div className="text-[#747474] text-[13px] font-noto font-bold leading-[22px] cursor-pointer">
            비밀번호 찾기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
