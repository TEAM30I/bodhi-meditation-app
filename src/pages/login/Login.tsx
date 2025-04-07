
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Check if email was passed in query params (from signup process)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
      setActiveField('password');
      
      // Focus password field
      const passwordInput = document.getElementById('password-input');
      if (passwordInput) {
        setTimeout(() => {
          passwordInput.focus();
        }, 300);
      }
    }
  }, [location]);

  // Check for existing login session
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await getCurrentUser();
      console.log('이미 로그인된 사용자:', userData);
      
      toast({
        title: "자동 로그인",
        description: "이미 로그인되어 있습니다.",
      });
      
      setTimeout(() => {
        window.location.replace('/main');
      }, 100);
    } catch (error) {
      console.log('로그인되지 않은 상태:', error);
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

    try {
      console.log('로그인 시도:', email);
      
      // 기존 로그인 세션이 있는지 확인 및 처리
      try {
        const currentUser = await getCurrentUser();
        console.log('기존 로그인 세션 발견:', currentUser);
        
        if (currentUser.username !== email) {
          console.log('다른 계정으로 로그인 시도. 기존 세션 로그아웃 중...');
          await signOut({ global: true });
          console.log('기존 세션 로그아웃 완료');
        } else {
          console.log('이미 같은 계정으로 로그인되어 있음');
          toast({
            title: "이미 로그인됨",
            description: "이미 로그인되어 있습니다. 메인 페이지로 이동합니다.",
          });
          
          window.location.replace('/main');
          setIsLoading(false);
          return;
        }
      } catch (error) {
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
        
        // 아이디 저장 기능
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        
        console.log('메인 페이지로 이동 중...');
        window.location.replace('/main');
      } else {
        console.log('추가 인증 필요:', nextStep);
        toast({
          title: "추가 인증 필요",
          description: `다음 단계: ${nextStep.signInStep}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/login/auth');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleFieldFocus = (field: string) => {
    setActiveField(field);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };
  
  const handleFindAccount = () => {
    navigate('/login/find-account');
  };

  useEffect(() => {
    // Check for saved email
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col">
      <div className="flex w-full h-14 items-center px-5 pt-[14px] pb-[14px]">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white font-pretendard text-[20px] font-medium mx-auto">로그인</h1>
      </div>
      
      <div className="flex flex-col items-center px-5 mt-[60px]">
        <img 
          src="/lovable-uploads/179dbac4-c437-4110-9097-4e8a34878e2b.png" 
          alt="Praying Hands"
          className="w-[150px] h-[150px] mb-[40px]"
        />
        
        <div className="w-full mt-5">
          <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2 block">
            이메일
          </label>
          <div 
            className={`flex items-center p-[18px_20px] rounded-[16px] ${activeField === 'email' ? 'bg-[#FF843333]' : 'bg-[#252932]'} w-full h-[60px] mb-6`}
            onClick={() => handleFieldFocus('email')}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFieldFocus('email')}
              onBlur={handleFieldBlur}
              placeholder="예) bodhi@bodhi.com"
              className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
            />
          </div>
          
          <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px] mb-2 block">
            비밀번호
          </label>
          <div 
            className={`flex items-center p-[18px_20px] rounded-[16px] ${activeField === 'password' ? 'bg-[#FF843333]' : 'bg-[#252932]'} w-full h-[60px] relative`}
            onClick={() => handleFieldFocus('password')}
          >
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFieldFocus('password')}
              onBlur={handleFieldBlur}
              placeholder="비밀번호를 입력해 주세요"
              className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none pr-10"
            />
            <button 
              onClick={togglePasswordVisibility} 
              type="button"
              className="absolute right-5 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className={`${showPassword ? 'text-bodhi-orange' : 'text-gray-400'}`} size={20} />
              ) : (
                <Eye className={`${showPassword ? 'text-bodhi-orange' : 'text-gray-400'}`} size={20} />
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-5">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleRememberMe}
                className={`w-6 h-6 rounded-md flex items-center justify-center ${rememberMe ? 'bg-bodhi-orange' : 'bg-[#252932]'}`}
              >
                {rememberMe && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z" fill="white"/>
                  </svg>
                )}
              </button>
              <span className="text-[#9EA3BE] font-pretendard text-[14px]">아이디 저장</span>
            </div>
            <button 
              onClick={handleFindAccount}
              className="text-[#9EA3BE] font-pretendard text-[14px]"
            >
              아이디/비밀번호 찾기
            </button>
          </div>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium tracking-[-0.45px] mt-[60px] disabled:opacity-50"
        >
          로그인
        </button>
        
        <div className="flex gap-3 mt-12 mb-4">
          <div className="w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12C0 5.3726 5.3726 0 12 0C18.6274 0 24 5.3726 24 12C24 18.6274 18.6274 24 12 24C5.3726 24 0 18.6274 0 12Z" fill="#FFE812"/>
              <path d="M12 5.5C7.5817 5.5 4 8.3241 4 11.8077C4 14.0599 5.4974 16.0361 7.74985 17.1521C7.6273 17.5747 6.9624 19.8709 6.9359 20.0513C6.9359 20.0513 6.92 20.1868 7.00775 20.2385C7.09555 20.2901 7.19875 20.25 7.19875 20.25C7.45045 20.2149 10.1175 18.3415 10.5791 18.0162C11.0403 18.0815 11.5151 18.1154 12 18.1154C16.4183 18.1154 20 15.2914 20 11.8077C20 8.3241 16.4183 5.5 12 5.5Z" fill="#381F1F"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M7.57686 14.0096C7.32231 14.0096 7.11531 13.8119 7.11531 13.5688V10.8269H6.39516C6.14541 10.8269 5.94226 10.6241 5.94226 10.375C5.94226 10.1258 6.14546 9.9231 6.39516 9.9231H8.75856C9.00831 9.9231 9.21146 10.1258 9.21146 10.375C9.21146 10.6241 9.00826 10.8269 8.75856 10.8269H8.03841V13.5688C8.03841 13.8119 7.83141 14.0096 7.57686 14.0096ZM11.6239 14.0036C11.4315 14.0036 11.2843 13.9255 11.2399 13.7998L11.0113 13.2015L9.60391 13.2014L9.37526 13.8001C9.33101 13.9255 9.18386 14.0036 8.99141 14.0036C8.89016 14.0037 8.79006 13.982 8.69801 13.9399C8.57076 13.8812 8.44846 13.7198 8.58861 13.2845L9.69261 10.3787C9.77041 10.1577 10.0066 9.93 10.3073 9.92315C10.6087 9.92995 10.8449 10.1577 10.9229 10.3791L12.0264 13.2837C12.1669 13.72 12.0446 13.8815 11.9173 13.94C11.8252 13.982 11.7252 14.0037 11.6239 14.0036ZM10.3076 11.0743L10.7686 12.3839H9.84661L10.3076 11.0743ZM12.7692 13.9423C12.5252 13.9423 12.3269 13.7525 12.3269 13.5192V10.3846C12.3269 10.1301 12.5382 9.9231 12.798 9.9231C13.0578 9.9231 13.2692 10.1301 13.2692 10.3846V13.0961H14.2499C14.4939 13.0961 14.6923 13.286 14.6923 13.5192C14.6923 13.7525 14.4939 13.9423 14.2499 13.9423H12.7692ZM14.8718 13.5421C14.8718 13.7966 15.0788 14.0036 15.3333 14.0036C15.4557 14.0034 15.5731 13.9547 15.6596 13.8682C15.7462 13.7816 15.7949 13.6643 15.795 13.5418V12.5348L15.9552 12.3747L17.0376 13.8088C17.0804 13.8661 17.1361 13.9125 17.2001 13.9444C17.2641 13.9762 17.3347 13.9926 17.4062 13.9923C17.5065 13.9925 17.6041 13.9598 17.6839 13.8991C17.7324 13.8628 17.7732 13.8172 17.8039 13.7649C17.8346 13.7127 17.8547 13.6548 17.8629 13.5948C17.8716 13.5347 17.8682 13.4736 17.8529 13.4149C17.8377 13.3562 17.811 13.3011 17.7743 13.2528L16.6382 11.7478L17.69 10.6961C17.7623 10.6238 17.7986 10.524 17.7919 10.4151C17.7852 10.3072 17.737 10.2033 17.6562 10.1225C17.5695 10.0359 17.4538 9.98625 17.3386 9.98625C17.2398 9.98625 17.1488 10.0227 17.0826 10.0889L15.7949 11.3766V10.3846C15.7949 10.1301 15.5879 9.9231 15.3333 9.9231C15.0788 9.9231 14.8718 10.1301 14.8718 10.3846V13.5421Z" fill="#FFE812"/>
            </svg>
          </div>
          <div className="w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#676E81"/>
              <path d="M14.1365 12.4225L9.68799 6H6V18H9.86299V11.578L14.312 18H18V6H14.1365V12.4225Z" fill="#381F1F"/>
            </svg>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-1.5 mt-auto mb-[40px]">
          <span className="text-[#9EA3B2] font-pretendard text-[14px] font-normal tracking-[-0.35px]">
            아직 회원이 아니신가요?
          </span>
          <button 
            onClick={() => navigate('/signup')}
            className="text-bodhi-orange font-pretendard text-[14px] font-semibold tracking-[-0.35px] underline cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
