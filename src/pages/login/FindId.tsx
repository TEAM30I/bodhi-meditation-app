import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { sendVerificationCode, verifyCode, getVerificationTimeRemaining } from '@/services/smsService';
import { supabase } from '@/lib/supabase'; // Assuming you have supabase configured

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
  
  // Timer for verification code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft]);
  
  // Check remaining time on component mount
  useEffect(() => {
    const checkRemainingTime = async () => {
      const remaining = await getVerificationTimeRemaining();
      if (remaining > 0) {
        setTimeLeft(remaining);
        setShowVerification(true);
      }
    };
    
    checkRemainingTime();
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const sendVerificationSMS = async () => {
    if (!phone) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await sendVerificationCode(phone);
      
      // Set timeout for 3 minutes
      setTimeLeft(180);
      setShowVerification(true);
      
      toast({
        title: "인증번호 발송",
        description: "인증번호가 발송되었습니다. 3분 안에 입력해주세요.",
      });
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "인증번호 발송 실패",
        description: error.message || "인증번호 발송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      // Verify the code
      const isVerified = await verifyCode(verificationCode);
      
      if (!isVerified) {
        toast({
          title: "인증 실패",
          description: "유효하지 않은 인증번호입니다.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Find the user by phone number in the database
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('phone', phone.replace(/[^\d]/g, ''))
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setFoundUsername(data.username);
        setShowResult(true);
      } else {
        toast({
          title: "사용자 찾기 실패",
          description: "해당 전화번호로 가입된 계정이 없습니다.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error finding ID:', error);
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
      onClick={sendVerificationSMS}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || timeLeft > 0}
      type="button"
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