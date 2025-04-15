
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';

const FindId: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [foundUsername, setFoundUsername] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const sendVerificationCode = () => {
    if (!phone) {
      <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          rightElement={<SendCodeButton />}
        />
      return;
    }
    
    // Start countdown timer for 3 minutes (180 seconds)
    setTimeLeft(180);
    
    // Generate random 4 digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Verification code:", code); // In real app, send via SMS
    
    toast({
      title: "인증번호 발송",
      description: "인증번호가 발송되었습니다. 3분 안에 입력해주세요.",
    });
    
    setShowVerification(true);
  };
  
  const verifyAndFindId = async () => {
    if (!phone) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (showVerification && !verificationCode) {
      toast({
        title: "오류",
        description: "인증번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (timeLeft <= 0 && showVerification) {
      toast({
        title: "오류",
        description: "인증 시간이 만료되었습니다. 다시 인증번호를 발송해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, verify the code against Cognito or your SMS provider
      // Here we're simulating finding a user by phone number
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate found username
      const mockUsername = "bodhi_user" + Math.floor(Math.random() * 100);
      setFoundUsername(mockUsername);
      setShowResult(true);
      
    } catch (error: any) {
      toast({
        title: "오류",
        description: "아이디 찾기 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send code button component for phone verification
  const SendCodeButton = () => (
    <button
      onClick={sendVerificationCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={timeLeft > 0}
    >
      {timeLeft > 0 ? "재발송" : "인증코드 발송"}
    </button>
  );
  
  if (showResult) {
    return (
      <div className="min-h-screen bg-app-dark flex flex-col p-5">
        <StatusBar />
        
        <BackButton label="아이디 찾기 결과" />
        
        <div className="flex-1 flex flex-col items-center justify-center animate-slide-up">
          <div className="bg-app-input-bg p-5 rounded-lg w-full mb-8">
            <p className="text-white text-center mb-2">회원님의 아이디는</p>
            <p className="text-app-orange text-xl font-bold text-center">{foundUsername}</p>
          </div>
          
          <AuthButton 
            label="로그인 하기" 
            onClick={() => navigate('/login')}
            className="mb-4 w-full"
          />
          
          <AuthButton 
            label="비밀번호 찾기" 
            onClick={() => navigate('/find-password')}
            className="w-full bg-transparent border border-app-orange"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="아이디 찾기" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          rightElement={<SendCodeButton />}
        />
        
        {showVerification && (
          <div>
            <InputField
              type="text"
              label="인증코드"
              placeholder="인증코드를 입력해 주세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mb-1"
            />
            {timeLeft > 0 && (
              <div className="text-right text-app-orange text-sm mb-12">
                남은 시간: {formatTime(timeLeft)}
              </div>
            )}
            {timeLeft === 0 && (
              <div className="text-right text-red-500 text-sm mb-12">
                인증 시간이 만료되었습니다. 재발송해주세요.
              </div>
            )}
          </div>
        )}
        
        <AuthButton 
          label={isLoading ? "확인 중..." : "아이디 찾기"}
          onClick={verifyAndFindId}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default FindId;
