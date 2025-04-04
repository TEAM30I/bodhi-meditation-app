import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BodhiButton from '@/components/BodhiButton';
import InputField from '@/components/InputField';
import { toast } from '@/components/ui/use-toast';
import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // 입력 검증
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

    setIsLoading(true);

    try {
      // AWS Cognito를 통한 회원가입
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email
          },
          autoSignIn: true // 이메일 인증이 성공하면 자동으로 로그인
        }
      });

      console.log('회원가입 응답:', { isSignUpComplete, userId, nextStep });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setShowConfirmation(true);
        toast({
          title: "인증 코드 발송",
          description: "이메일로 인증 코드가 발송되었습니다.",
        });
      } else if (isSignUpComplete) {
        toast({
          title: "회원가입 성공",
          description: "환영합니다!"
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      toast({
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    if (!confirmationCode) {
      toast({
        title: "인증 코드 필요",
        description: "인증 코드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode,
      });

      if (isSignUpComplete) {
        toast({
          title: "인증 완료",
          description: "회원가입이 완료되었습니다. 로그인해주세요.",
        });
        navigate('/login');
      } else {
        toast({
          title: "인증 실패",
          description: `다음 단계: ${nextStep.signUpStep}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('인증 에러:', error);
      toast({
        title: "인증 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "이메일 필요",
        description: "이메일 주소를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await resendSignUpCode({
        username: email,
      });

      toast({
        title: "인증 코드 재발송",
        description: "이메일로 인증 코드가 재발송되었습니다.",
      });
    } catch (error) {
      console.error('코드 재발송 에러:', error);
      toast({
        title: "재발송 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 입력 화면
  if (showConfirmation) {
    return (
      <div className="w-full min-h-screen bg-bodhi-background flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
          <div className="text-[20px] font-bold text-[#111] font-pretendard leading-[130%] tracking-[0.4px] self-start">
            이메일 인증
          </div>
          <BodhiLogo size="large" className="mt-[73px]" />
          
          <div className="mt-[92px] w-full text-center">
            <p className="mb-4 text-sm text-gray-600">
              {email}로 전송된 인증 코드를 입력해주세요
            </p>
            <InputField
              label="인증 코드"
              placeholder="인증 코드 6자리"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </div>
          
          <div className="mt-[37px] w-full flex flex-col gap-[14px]">
            <BodhiButton
              variant="primary"
              onClick={handleConfirmSignUp}
              disabled={isLoading}
            >
              인증 완료하기
            </BodhiButton>
            
            <div className="flex justify-center mt-2">
              <button 
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-bodhi-orange underline text-sm"
              >
                인증 코드 재발송
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 회원가입 화면
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
            disabled={isLoading}
          >
            회원가입
          </BodhiButton>
          <BodhiButton
            variant="secondary"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            로그인으로 돌아가기
          </BodhiButton>
        </div>
      </div>
    </div>
  );
};

export default Signup;