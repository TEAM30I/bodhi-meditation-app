
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';

const FindPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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
    if (!username || !phone) {
      toast({
        title: "오류",
        description: "아이디와 전화번호를 모두 입력해주세요.",
        variant: "destructive"
      });
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
  
  const verifyCodeAndShowResetForm = async () => {
    if (!username || !phone) {
      toast({
        title: "오류",
        description: "아이디와 전화번호를 모두 입력해주세요.",
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowResetForm(true);
    } catch (error: any) {
      toast({
        title: "오류",
        description: "인증 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "오류",
        description: "새 비밀번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "오류",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "오류",
        description: "비밀번호는 8자 이상이어야 합니다.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, reset password via Cognito
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "성공",
        description: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "오류",
        description: "비밀번호 변경 중 문제가 발생했습니다.",
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
  
  if (showResetForm) {
    return (
      <div className="min-h-screen bg-app-dark flex flex-col p-5">
        <StatusBar />
        
        <BackButton label="비밀번호 재설정" />
        
        <div className="mt-8 animate-slide-up">
          <InputField
            type="password"
            label="새 비밀번호"
            placeholder="새 비밀번호를 입력해 주세요"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon="lock"
            highlightFocus={true}
          />
          
          <InputField
            type="password"
            label="새 비밀번호 확인"
            placeholder="새 비밀번호를 다시 입력해 주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="lock"
            highlightFocus={true}
            className="mb-12"
          />
          
          <AuthButton 
            label={isLoading ? "변경 중..." : "비밀번호 변경"}
            onClick={resetPassword}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="비밀번호 찾기" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="text"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon="user"
        />
        
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
          label={isLoading ? "확인 중..." : "비밀번호 찾기"}
          onClick={verifyCodeAndShowResetForm}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default FindPassword;
