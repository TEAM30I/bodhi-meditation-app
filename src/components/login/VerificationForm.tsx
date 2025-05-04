import React, { useState } from 'react';
import InputField from '@/components/login/InputField';
import { useVerificationTimer } from '@/hooks/use-verification-timer';
import { sendVerificationCode, verifyCode } from '@/services/smsService';
import { useToast } from '@/hooks/use-toast';

interface VerificationFormProps {
  phone: string;
  onVerificationSuccess: () => void;
  isUserChecking?: boolean; 
  username?: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  phone,
  onVerificationSuccess,
  isUserChecking = false,
  username = '',
}) => {
  const { timeLeft, isActive, startTimer, formatTime } = useVerificationTimer();
  const { toast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const handleSendVerificationCode = async () => {
    if (!phone) {
      toast({
        title: "인증 실패",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (isUserChecking && !username) {
      toast({
        title: "인증 실패",
        description: "아이디를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isUserChecking) {
        // Additional validation logic if needed
        // e.g., check if username and phone match
      }
      
      await sendVerificationCode(phone);
      
      // Start the timer
      startTimer(180); // 3 minutes
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
  
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "인증 실패",
        description: "인증번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (timeLeft <= 0) {
      toast({
        title: "인증 실패",
        description: "인증 시간이 만료되었습니다. 다시 인증번호를 발송해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const isValid = await verifyCode(verificationCode);
      
      if (isValid) {
        setIsVerified(true);
        toast({
          title: "인증 성공",
          description: "전화번호가 인증되었습니다.",
        });
        onVerificationSuccess();
      } else {
        toast({
          title: "인증 실패",
          description: "유효하지 않은 인증번호입니다.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "인증 실패",
        description: error.message || "인증 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send code button component
  const SendCodeButton = () => (
    <button
      onClick={handleSendVerificationCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || isActive}
      type="button"
    >
      {isActive ? "재발송" : "인증코드 발송"}
    </button>
  );
  
  // Verify button component
  const VerifyButton = () => (
    <button
      onClick={handleVerifyCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || isVerified || !isActive}
      type="button"
    >
      {isVerified ? "인증완료" : "인증하기"}
    </button>
  );
  
  return (
    <>
      <InputField
        type="tel"
        label="전화번호"
        placeholder="전화번호를 입력해 주세요"
        value={phone}
        onChange={() => {}} // This should be passed from parent
        icon="phone"
        rightElement={<SendCodeButton />}
        state={isVerified ? 'success' : 'default'}
        disabled={isVerified}
      />
      
      {showVerification && (
        <div>
          <InputField
            type="text"
            label="인증코드"
            placeholder="인증코드를 입력해 주세요"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            state={isVerified ? 'success' : timeLeft === 0 ? 'error' : 'default'}
            errorMessage={timeLeft === 0 ? "인증 시간이 만료되었습니다." : ""}
            rightElement={<VerifyButton />}
            disabled={isVerified}
          />
          
          {isActive && !isVerified && (
            <div className="text-right text-app-orange text-sm mb-4">
              남은 시간: {formatTime()}
            </div>
          )}
          
          {!isActive && showVerification && !isVerified && (
            <div className="text-right text-red-500 text-sm mb-4">
              인증 시간이 만료되었습니다. 재발송해주세요.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VerificationForm;