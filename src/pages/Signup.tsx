
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BodhiButton from '@/components/BodhiButton';
import InputField from '@/components/InputField';
import { toast } from '@/components/ui/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock signup - in a real app, you'd call an API
    navigate('/main');
    toast({
      title: "회원가입 성공",
      description: "환영합니다!",
    });
  };

  return (
    <div className="w-full min-h-screen bg-bodhi-background flex flex-col items-center">
      <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
        <div className="text-[20px] font-bold text-[#111] font-pretendard leading-[130%] tracking-[0.4px] self-start">
          회원가입
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
        
        <div className="mt-[37px] w-full">
          <InputField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <div className="mt-[37px] w-full flex flex-col gap-[14px]">
          <BodhiButton 
            variant="primary"
            onClick={handleSignup}
          >
            회원가입
          </BodhiButton>
          
          <BodhiButton 
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            로그인으로 돌아가기
          </BodhiButton>
        </div>
      </div>
    </div>
  );
};

export default Signup;
