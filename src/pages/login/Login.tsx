
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

  const handleGoBack = () => {
    if (showResetConfirmation) {
      setShowResetConfirmation(false);
      setShowResetPassword(true);
    } else if (showResetPassword) {
      setShowResetPassword(false);
    } else {
      navigate('/login/auth');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  // 비밀번호 재설정 확인 화면
  if (showResetConfirmation) {
    return (
      <div className="w-full min-h-screen bg-[#181A20] flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
          <div className="w-full flex items-center h-14">
            <ArrowLeft 
              className="text-white cursor-pointer" 
              size={24} 
              onClick={handleGoBack}
            />
            <span className="text-white text-lg font-medium ml-4">비밀번호 재설정</span>
          </div>
          
          <div className="mt-[92px] w-full">
            <p className="mb-4 text-sm text-gray-400 text-center">
              {email}로 전송된 인증 코드를 입력하고<br />새 비밀번호를 설정해주세요
            </p>
            
            <div className="flex flex-col mb-9">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
                인증 코드
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="인증 코드 6자리"
                  maxLength={6}
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
                새 비밀번호
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력해 주세요"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-[37px] w-full flex flex-col gap-[14px]">
            <button
              onClick={handleConfirmResetPassword}
              disabled={isLoading}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
            >
              비밀번호 변경하기
            </button>
            
            <button
              onClick={handleGoBack}
              disabled={isLoading}
              className="w-full h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 비밀번호 재설정 요청 화면
  if (showResetPassword) {
    return (
      <div className="w-full min-h-screen bg-[#181A20] flex flex-col items-center">
        <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
          <div className="w-full flex items-center h-14">
            <ArrowLeft 
              className="text-white cursor-pointer" 
              size={24} 
              onClick={handleGoBack}
            />
            <span className="text-white text-lg font-medium ml-4">비밀번호 찾기</span>
          </div>
          
          <div className="mt-[92px] w-full">
            <p className="mb-4 text-sm text-gray-400 text-center">
              가입하신 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다
            </p>
            
            <div className="flex flex-col">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
                이메일 주소
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예) bodhi@bodhi.com"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-[37px] w-full flex flex-col gap-[14px]">
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
            >
              인증 코드 받기
            </button>
            
            <button
              onClick={handleGoBack}
              disabled={isLoading}
              className="w-full h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 로그인 화면
  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col items-center">
      <div className="w-full max-w-[390px] px-[25px] pt-[42px] flex flex-col items-center">
        <div className="w-full flex items-center h-14">
          <ArrowLeft 
            className="text-white cursor-pointer" 
            size={24} 
            onClick={handleGoBack}
          />
          <span className="text-white text-lg font-medium ml-4">로그인</span>
        </div>
        
        <div className="mt-[92px] w-full">
          <div className="flex flex-col mb-9">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
              이메일 주소
            </label>
            <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="예) bodhi@bodhi.com"
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
              비밀번호
            </label>
            <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setShowResetPassword(true)}
                className="text-bodhi-orange text-sm"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-[37px] w-full flex flex-col gap-[14px]">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
          >
            로그인
          </button>
          
          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
          >
            회원가입하기
          </button>
        </div>
        
        <div className="flex justify-center items-center gap-1.5 mt-auto mb-[65px]">
          <span className="text-[#9EA3B2] font-pretendard text-[14px] font-normal tracking-[-0.35px]">
            아직 회원이 아니신가요?
          </span>
          <span 
            onClick={handleSignup}
            className="text-bodhi-orange font-pretendard text-[14px] font-semibold tracking-[-0.35px] underline cursor-pointer"
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
