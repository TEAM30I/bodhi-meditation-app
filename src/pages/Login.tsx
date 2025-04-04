import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BodhiLogo from '@/components/BodhiLogo';
import BodhiButton from '@/components/BodhiButton';
import InputField from '@/components/InputField';
import { toast } from '@/components/ui/use-toast';
import { signIn, resetPassword, confirmResetPassword, signOut, getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext';

// AWS Amplify getCurrentUser 반환 타입 정의
interface AmplifyUser {
  username: string;
  userId?: string;
  signInDetails?: {
    loginId?: string;
  };
}

const Login = () => {
  console.log('Login 컴포넌트 렌더링');
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 비밀번호 재설정 관련 상태
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 페이지 로드시 로그인 상태 체크
  useEffect(() => {
    console.log('로그인 컴포넌트 마운트됨, 로그인 상태 확인');
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log('로그인 상태 확인 중...');
      const userData = await getCurrentUser();
      console.log('이미 로그인된 사용자:', userData);
      
      // 이미 로그인되어 있으면 메인 페이지로 리디렉션
      toast({
        title: "자동 로그인",
        description: "이미 로그인되어 있습니다.",
      });
      
      // 새로고침 방지 방법
      document.body.style.cursor = 'wait'; // 커서를 대기 상태로 변경
      setTimeout(() => {
        document.body.style.cursor = 'default';
        window.location.replace('/main'); // replace로 히스토리 대체 (뒤로가기 방지)
      }, 100);
    } catch (error) {
      console.log('로그인되지 않은 상태:', error);
      // 로그인되지 않은 상태이므로 아무 작업도 하지 않음
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    document.body.style.cursor = 'wait'; // 커서를 대기 상태로 변경

    try {
      console.log('로그인 시도:', email);
      
      // 기존 로그인 세션이 있는지 확인 및 처리
      try {
        const currentUser = await getCurrentUser();
        console.log('기존 로그인 세션 발견:', currentUser);
        
        // 기존 세션과 다른 계정으로 로그인 시도하는 경우
        if (currentUser.username !== email) {
          console.log('다른 계정으로 로그인 시도. 기존 세션 로그아웃 중...');
          await signOut({ global: true }); // global: true로 모든 기기에서 로그아웃
          console.log('기존 세션 로그아웃 완료');
        } else {
          // 이미 같은 계정으로 로그인되어 있는 경우
          console.log('이미 같은 계정으로 로그인되어 있음');
          toast({
            title: "이미 로그인됨",
            description: "이미 로그인되어 있습니다. 메인 페이지로 이동합니다.",
          });
          
          // 페이지 이동 (새로고침 방식)
          window.location.replace('/main');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        // 로그인된 사용자가 없음 - 정상적으로 로그인 진행
        console.log('기존 로그인 세션 없음, 로그인 진행');
      }
      
      // 실제 로그인 수행
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      console.log('로그인 결과:', { isSignedIn, nextStep });

      if (isSignedIn) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        });
        
        // 페이지 이동 (새로고침 방식)
        console.log('메인 페이지로 이동 중...');
        window.location.replace('/main');
      } else {
        // 추가 인증이 필요한 경우
        console.log('추가 인증 필요:', nextStep);
        toast({
          title: "추가 인증 필요",
          description: `다음 단계: ${nextStep.signInStep}`,
          variant: "destructive",
        });
        document.body.style.cursor = 'default'; // 커서를 기본 상태로 복원
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
      document.body.style.cursor = 'default'; // 커서를 기본 상태로 복원
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "이메일 필요",
        description: "비밀번호를 재설정할 이메일 주소를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { nextStep } = await resetPassword({
        username: email,
      });

      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        setShowResetConfirmation(true);
        setShowResetPassword(false);
        toast({
          title: "인증 코드 발송",
          description: "이메일로 인증 코드가 발송되었습니다.",
        });
      }
    } catch (error) {
      console.error('비밀번호 재설정 요청 에러:', error);
      toast({
        title: "재설정 요청 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!resetCode || !newPassword) {
      toast({
        title: "입력 오류",
        description: "인증 코드와 새 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: resetCode,
        newPassword,
      });

      toast({
        title: "비밀번호 변경 완료",
        description: "새 비밀번호로 로그인해주세요.",
      });
      
      // 비밀번호 재설정 완료 후 기본 로그인 화면으로 돌아가기
      setShowResetConfirmation(false);
      setShowResetPassword(false);
      setPassword('');
    } catch (error) {
      console.error('비밀번호 재설정 확인 에러:', error);
      toast({
        title: "비밀번호 재설정 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정 확인 화면
  if (showResetConfirmation) {
    return (
      <div className="w-full min-h-screen bg-bodhi-background flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
          <div className="text-[20px] font-bold text-[#111] font-pretendard leading-[130%] tracking-[0.4px] self-start">
            비밀번호 재설정
          </div>
          <BodhiLogo size="large" className="mt-[73px]" />
          
          <div className="mt-[92px] w-full">
            <p className="mb-4 text-sm text-gray-600 text-center">
              {email}로 전송된 인증 코드를 입력하고<br />새 비밀번호를 설정해주세요
            </p>
            
            <InputField
              label="인증 코드"
              placeholder="인증 코드 6자리"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
            
            <div className="mt-[37px]">
              <InputField
                label="새 비밀번호"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-[37px] w-full flex flex-col gap-[14px]">
            <BodhiButton
              variant="primary"
              onClick={handleConfirmResetPassword}
              disabled={isLoading}
            >
              비밀번호 변경하기
            </BodhiButton>
            
            <BodhiButton
              variant="secondary"
              onClick={() => {
                setShowResetConfirmation(false);
                setShowResetPassword(false);
              }}
              disabled={isLoading}
            >
              로그인으로 돌아가기
            </BodhiButton>
          </div>
        </div>
      </div>
    );
  }

  // 비밀번호 재설정 요청 화면
  if (showResetPassword) {
    return (
      <div className="w-full min-h-screen bg-bodhi-background flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
          <div className="text-[20px] font-bold text-[#111] font-pretendard leading-[130%] tracking-[0.4px] self-start">
            비밀번호 찾기
          </div>
          <BodhiLogo size="large" className="mt-[73px]" />
          
          <div className="mt-[92px] w-full">
            <p className="mb-4 text-sm text-gray-600 text-center">
              가입하신 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다
            </p>
            
            <InputField
              label="이메일 주소"
              placeholder="예) bodhi@bodhi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mt-[37px] w-full flex flex-col gap-[14px]">
            <BodhiButton
              variant="primary"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              인증 코드 받기
            </BodhiButton>
            
            <BodhiButton
              variant="secondary"
              onClick={() => setShowResetPassword(false)}
              disabled={isLoading}
            >
              로그인으로 돌아가기
            </BodhiButton>
          </div>
        </div>
      </div>
    );
  }

  // 기본 로그인 화면
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
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => setShowResetPassword(true)}
              className="text-bodhi-orange text-sm"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
        <div className="mt-[37px] w-full flex flex-col gap-[14px]">
          <BodhiButton
            variant="primary"
            onClick={handleLogin}
            disabled={isLoading}
          >
            로그인
          </BodhiButton>
          <BodhiButton
            variant="secondary"
            onClick={() => navigate('/signup')}
            disabled={isLoading}
          >
            회원가입하기
          </BodhiButton>
        </div>
      </div>
    </div>
  );
};

export default Login;