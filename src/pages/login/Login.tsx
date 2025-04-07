
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Focus states for input fields
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Show password toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if coming from signup page (to auto-fill email)
  const [comingFromSignup, setComingFromSignup] = useState(false);
  
  // Save ID checkbox
  const [saveId, setSaveId] = useState(false);
  
  // 비밀번호 재설정 관련 상태
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Check for saved email in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('bodhiSavedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveId(true);
    }
    
    // Check if coming from signup page
    const params = new URLSearchParams(location.search);
    const signupEmail = params.get('email');
    if (signupEmail) {
      setEmail(signupEmail);
      setComingFromSignup(true);
      // Auto focus on password field if coming from signup
      // This is a comment since we can't directly control native focus
      // In a real app, we would use: passwordInputRef.current?.focus();
    }
  }, [location]);
  
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
      
      // Save email if checkbox is checked
      if (saveId) {
        localStorage.setItem('bodhiSavedEmail', email);
      } else {
        localStorage.removeItem('bodhiSavedEmail');
      }
      
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        
        <div className="mt-[51px] w-full">
          <div className="flex flex-col">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
              이메일
            </label>
            <div className={`flex items-center p-[18px_20px] rounded-[16px] ${emailFocused ? 'bg-[#FF8433]' : 'bg-[#252932]'} w-full h-[60px]`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="예) bodhi@bodhi.com"
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col mt-[27px]">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2">
              비밀번호
            </label>
            <div className={`flex items-center p-[18px_20px] rounded-[16px] ${passwordFocused || comingFromSignup ? 'bg-[#FF8433]' : 'bg-[#252932]'} w-full h-[60px] relative`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="비밀번호를 입력해 주세요"
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none pr-10"
              />
              {showPassword ? (
                <Eye 
                  className={`absolute right-5 cursor-pointer ${showPassword ? 'text-bodhi-orange' : 'text-[#777C89]'}`} 
                  size={24} 
                  onClick={togglePasswordVisibility} 
                />
              ) : (
                <EyeOff 
                  className="absolute right-5 cursor-pointer text-[#777C89]" 
                  size={24} 
                  onClick={togglePasswordVisibility} 
                />
              )}
            </div>
            <div className="flex justify-between items-center mt-5">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-[22px] h-[22px] rounded-md flex items-center justify-center cursor-pointer ${saveId ? 'bg-bodhi-orange' : 'bg-[#252932]'}`}
                  onClick={() => setSaveId(!saveId)}
                >
                  {saveId && (
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M4.17232 7.8999L10.9661 1L12 2.05004L4.17232 10L0 5.7625L1.03389 4.71247L4.17232 7.8999Z" fill="white"/>
                    </svg>
                  )}
                </div>
                <span className="text-[#9EA3BE] font-pretendard text-[14px] font-normal leading-[140%] tracking-[-0.35px]">
                  아이디 저장
                </span>
              </div>
              <button 
                onClick={() => setShowResetPassword(true)}
                className="text-[#9EA3BE] text-[14px] font-normal leading-[140%] tracking-[-0.35px]"
              >
                아이디/비밀번호 찾기
              </button>
            </div>
          </div>
          
          <div className="mt-[61px] w-full">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50 flex items-center justify-center"
            >
              로그인
            </button>
            
            <div className="flex justify-center items-center gap-3 mt-12">
              <div className="w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 12C0 5.3726 5.3726 0 12 0C18.6274 0 24 5.3726 24 12C24 18.6274 18.6274 24 12 24C5.3726 24 0 18.6274 0 12Z" fill="#FFE812"/>
                  <path d="M12 5.5C7.5817 5.5 4 8.3241 4 11.8077C4 14.0599 5.4974 16.0361 7.74985 17.1521C7.6273 17.5747 6.9624 19.8709 6.9359 20.0513C6.9359 20.0513 6.92 20.1868 7.00775 20.2385C7.09555 20.2901 7.19875 20.25 7.19875 20.25C7.45045 20.2149 10.1175 18.3415 10.5791 18.0162C11.0403 18.0815 11.5151 18.1154 12 18.1154C16.4183 18.1154 20 15.2914 20 11.8077C20 8.3241 16.4183 5.5 12 5.5Z" fill="#381F1F"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.57698 14.0096C7.32243 14.0096 7.11543 13.8119 7.11543 13.5688V10.8269H6.39528C6.14553 10.8269 5.94238 10.6241 5.94238 10.375C5.94238 10.1258 6.14558 9.9231 6.39528 9.9231H8.75868C9.00843 9.9231 9.21158 10.1258 9.21158 10.375C9.21158 10.6241 9.00838 10.8269 8.75868 10.8269H8.03853V13.5688C8.03853 13.8119 7.83153 14.0096 7.57698 14.0096ZM11.624 14.0036C11.4316 14.0036 11.2844 13.9255 11.24 13.7998L11.0114 13.2015L9.60403 13.2014L9.37538 13.8001C9.33113 13.9255 9.18398 14.0036 8.99153 14.0036C8.89028 14.0037 8.79018 13.982 8.69813 13.9399C8.57088 13.8812 8.44858 13.7198 8.58873 13.2845L9.69273 10.3787C9.77053 10.1577 10.0067 9.93 10.3074 9.92315C10.6088 9.92995 10.845 10.1577 10.923 10.3791L12.0265 13.2837C12.167 13.72 12.0447 13.8815 11.9174 13.94C11.8253 13.982 11.7253 14.0037 11.624 14.0036ZM10.3077 11.0743L10.7687 12.3839H9.84673L10.3077 11.0743ZM12.7693 13.9423C12.5253 13.9423 12.327 13.7525 12.327 13.5192V10.3846C12.327 10.1301 12.5383 9.9231 12.7981 9.9231C13.0579 9.9231 13.2693 10.1301 13.2693 10.3846V13.0961H14.25C14.494 13.0961 14.6924 13.286 14.6924 13.5192C14.6924 13.7525 14.494 13.9423 14.25 13.9423H12.7693ZM14.8719 13.5421C14.8719 13.7966 15.0789 14.0036 15.3334 14.0036C15.4558 14.0034 15.5732 13.9547 15.6597 13.8682C15.7463 13.7816 15.795 13.6643 15.7951 13.5418V12.5348L15.9553 12.3747L17.0377 13.8088C17.0805 13.8661 17.1362 13.9125 17.2002 13.9444C17.2642 13.9762 17.3348 13.9926 17.4063 13.9923C17.5066 13.9925 17.6042 13.9598 17.684 13.8991C17.7325 13.8628 17.7733 13.8172 17.804 13.7649C17.8347 13.7127 17.8548 13.6548 17.863 13.5948C17.8717 13.5347 17.8683 13.4736 17.853 13.4149C17.8378 13.3562 17.8111 13.3011 17.7744 13.2528L16.6383 11.7478L17.6901 10.6961C17.7624 10.6238 17.7987 10.524 17.792 10.4151C17.7853 10.3072 17.7371 10.2033 17.6563 10.1225C17.5696 10.0359 17.4539 9.98625 17.3387 9.98625C17.2399 9.98625 17.1489 10.0227 17.0827 10.0889L15.795 11.3766V10.3846C15.795 10.1301 15.588 9.9231 15.3334 9.9231C15.0789 9.9231 14.8719 10.1301 14.8719 10.3846V13.5421Z" fill="#FFE812"/>
                </svg>
              </div>
              
              <div className="w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#676E81"/>
                  <path d="M14.1365 12.4225L9.68799 6H6V18H9.86299V11.578L14.312 18H18V6H14.1365V12.4225Z" fill="#381F1F"/>
                </svg>
              </div>
            </div>
          </div>
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
