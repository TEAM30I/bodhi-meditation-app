
import { useState } from 'react';
import { useTimer } from './useTimer';
import { toast } from '@/components/ui/use-toast';

interface VerificationOptions {
  initialValue?: string;
  validationFn: (value: string) => boolean;
  sendVerificationFn: (value: string) => Promise<any>;
  verifyCodeFn: (value: string, code: string) => Promise<any>;
  timerMinutes?: number;
  timerSeconds?: number;
}

export function useVerification({
  initialValue = '',
  validationFn,
  sendVerificationFn,
  verifyCodeFn,
  timerMinutes = 3,
  timerSeconds = 0,
}: VerificationOptions) {
  // Basic states
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Timer hook
  const {
    timer,
    timerExpired,
    startTimer,
    setTimerExpired,
    formatTime
  } = useTimer(timerMinutes, timerSeconds);

  // Validate input
  const validateInput = (input: string) => {
    const valid = validationFn(input);
    setIsValid(valid);
    return valid;
  };

  // Update value and validate
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    validateInput(newValue);
  };

  // Send verification
  const handleSendVerification = async () => {
    if (!isValid) {
      toast({
        title: "입력 오류",
        description: "올바른 형식을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendVerificationFn(value);

      if (result.success) {
        setVerificationSent(true);
        startTimer();

        toast({
          title: "인증 코드 발송",
          description: `인증 코드가 발송되었습니다.`,
        });
      } else {
        toast({
          title: "인증 오류",
          description: result.message || "인증 과정에서 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "인증 오류",
        description: error.message || "인증 과정에서 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code
  const handleVerifyCode = async (): Promise<void> => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "인증 코드 오류",
        description: "올바른 인증 코드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyCodeFn(value, verificationCode);

      if (result.success) {
        setVerificationComplete(true);
        
        toast({
          title: "인증 완료",
          description: "인증이 완료되었습니다.",
        });
      } else {
        toast({
          title: "인증 코드 오류",
          description: result.message || "인증 코드 확인 중 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Code verification error:", error);
      toast({
        title: "인증 코드 오류",
        description: error.message || "인증 코드 확인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification
  const handleResendVerification = () => {
    startTimer();
    setTimerExpired(false);
    handleSendVerification();
  };

  return {
    value,
    setValue: handleValueChange,
    isValid,
    verificationCode,
    setVerificationCode,
    verificationSent,
    verificationComplete,
    isLoading,
    timer,
    timerExpired,
    formatTime,
    handleSendVerification,
    handleVerifyCode,
    handleResendVerification,
  };
}
