import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { sendVerificationCode, verifyCode, getVerificationTimeRemaining, clearVerificationData } from '@/services/smsService';
import { supabase } from '@/lib/supabase'; // Assuming you have supabase configured

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
    if (!username || !phone) {
      toast({
        title: "오류",
        description: "아이디와 전화번호를 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if the username exists and matches the phone number
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('phone', phone.replace(/[^\d]/g, ''))
        .single();
      
      if (error || !data) {
        toast({
          title: "오류",
          description: "아이디와 전화번호가 일치하지 않습니다.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Send verification code
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
      
      setShowResetForm(true);
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "오류",
        description: "인증 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPasswordHandler = async () => {
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
      // Update the user's password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Clear verification data
      await clearVerificationData();
      
      toast({
        title: "성공",
        description: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
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
      onClick={sendVerificationSMS}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || timeLeft > 0}
      type="button"
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
            onClick={resetPasswordHandler}
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