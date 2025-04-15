import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import CheckboxField from '@/components/login/CheckboxField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber, validatePhone } from '@/utils/validations';
import { checkUsernameAvailability } from '@/services/authService';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 상태 관리
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'default' | 'error' | 'success'>('default');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [verification, setVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 전화번호 인증 hook 사용
  const phoneVerification = usePhoneVerification({ 
    name: name,
    email: username
  });
  
  // 입력된 전화번호의 형식 자동 변환 (xxx-xxxx-xxxx)
  const formatPhoneInput = (input: string) => {
    // 숫자만 추출
    const digits = input.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };
  
  // 아이디 중복 확인
  const checkUsername = async () => {
    if (!username) {
      toast({
        title: "오류",
        description: "아이디를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChecking(true);
    
    try {
      // 실제 아이디 중복 확인 API 호출
      const result = await checkUsernameAvailability(username);
      
      if (result.isAvailable) {
        setUsernameStatus('success');
      } else {
        setUsernameStatus('error');
      }
      setUsernameMessage(result.message);
      
    } catch (error: any) {
      console.error('Username check error:', error);
      toast({
        title: "오류",
        description: "아이디 확인 중 문제가 발생했습니다.",
        variant: "destructive"
      });
      
      setUsernameStatus('default');
      setUsernameMessage('');
    } finally {
      setIsChecking(false);
    }
  };
  
  // 회원가입 처리
  const handleSignUp = async () => {
    if (!username || !phoneVerification.value || !password || !name) {
      toast({
        title: "회원가입 실패",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (usernameStatus !== 'success') {
      toast({
        title: "회원가입 실패",
        description: "아이디 중복확인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (!phoneVerification.verificationComplete) {
      toast({
        title: "회원가입 실패",
        description: "전화번호 인증이 필요합니다.",
        variant: "destructive"
      });
      return;
    }
    
    if (!verification) {
      toast({
        title: "회원가입 실패",
        description: "약관에 동의해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 전화번호 포맷팅 (010-1234-5678 -> +821012345678)
      const formattedPhone = formatPhoneNumber(phoneVerification.value);
      
      console.log("회원가입 시도:", { 
        username, 
        name,
        password: "********", 
        phone: formattedPhone 
      });
      
      // 회원가입 API 호출 (현재는 mock 구현)
      // 실제 환경에서는 API 호출로 대체
      
      toast({
        title: "회원가입 성공",
        description: "프로필 설정 단계로 이동합니다.",
      });
      
      // 프로필 설정 페이지로 이동
      navigate('/profile-setup');
    } catch (error: any) {
      console.error('SignUp error:', error);
      
      let errorMessage = "회원가입 중 오류가 발생했습니다.";
      
      toast({
        title: "회원가입 실패",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 아이디 중복확인 버튼
  const CheckButton = () => (
    <button
      onClick={checkUsername}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isChecking}
    >
      {isChecking ? "확인 중..." : "중복확인"}
    </button>
  );
  
  // 인증코드 발송 버튼
  const SendCodeButton = () => (
    <button
      onClick={phoneVerification.handleSendVerification}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={phoneVerification.isLoading || !phoneVerification.isValid || (!phoneVerification.timerExpired && phoneVerification.verificationSent)}
    >
      {phoneVerification.isLoading ? "발송 중..." : 
        (phoneVerification.verificationSent && !phoneVerification.timerExpired) ? "재발송" : "인증코드 발송"}
    </button>
  );
  
  // 인증코드 확인 버튼
  const VerifyCodeButton = () => (
    <button
      onClick={phoneVerification.handleVerifyCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={phoneVerification.isLoading || phoneVerification.verificationComplete}
    >
      {phoneVerification.isLoading ? "확인 중..." : 
        phoneVerification.verificationComplete ? "인증 완료" : "확인"}
    </button>
  );
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="가입하기" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="text"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameStatus('default');
          }}
          icon="user"
          state={usernameStatus}
          errorMessage={usernameMessage}
          rightElement={<CheckButton />}
        />
        
        {usernameStatus === 'error' && (
          <div className="flex items-center mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span className="ml-2">{usernameMessage}</span>
          </div>
        )}
        
        {usernameStatus === 'success' && (
          <div className="flex items-center mb-4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className="ml-2">{usernameMessage}</span>
          </div>
        )}
        
        <InputField
          type="text"
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon="user"
        />
        
        <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요 (010-0000-0000)"
          value={phoneVerification.value}
          onChange={(e) => {
            const formatted = formatPhoneInput(e.target.value);
            phoneVerification.setValue(formatted);
          }}
          icon="phone"
          rightElement={<SendCodeButton />}
        />
        
        {phoneVerification.verificationSent && (
          <div>
            <InputField
              type="text"
              label="인증코드"
              placeholder="인증코드를 입력해 주세요"
              value={phoneVerification.verificationCode}
              onChange={(e) => phoneVerification.setVerificationCode(e.target.value)}
              rightElement={<VerifyCodeButton />}
              className="mb-1"
            />
            {phoneVerification.timer.minutes > 0 || phoneVerification.timer.seconds > 0 && (
              <div className="text-right text-app-orange text-sm mb-4">
                남은 시간: {phoneVerification.formatTime(phoneVerification.timer.minutes)}:{phoneVerification.formatTime(phoneVerification.timer.seconds)}
              </div>
            )}
            {phoneVerification.timerExpired && phoneVerification.verificationSent && !phoneVerification.verificationComplete && (
              <div className="text-right text-red-500 text-sm mb-4">
                인증 시간이 만료되었습니다. 재발송해주세요.
              </div>
            )}
            {phoneVerification.verificationComplete && (
              <div className="text-right text-green-500 text-sm mb-4">
                인증이 완료되었습니다.
              </div>
            )}
          </div>
        )}
        
        <InputField
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
          highlightFocus={true}
        />
        
        <div className="mb-10 mt-4">
          <CheckboxField
            label="약관 동의"
            checked={verification}
            onChange={setVerification}
          />
        </div>
        
        <AuthButton 
          label={isLoading ? "가입 중..." : "회원가입"}
          onClick={handleSignUp}
          disabled={isLoading}
        />
        
        <div className="mt-10 text-center">
          <p className="text-app-gray-text text-sm">
            이미 계정이 있으신가요? <button className="text-app-orange" onClick={() => navigate('/login')}>로그인</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
