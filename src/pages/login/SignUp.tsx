import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import CheckboxField from '@/components/login/CheckboxField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { sendVerificationCode, getVerificationTimeRemaining } from '@/services/smsService';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, verifyPhoneNumber } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [verification, setVerification] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
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
  
  const handleSendVerificationCode = async () => {
    if (!phone) {
      toast({
        title: "인증 실패",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 전화번호에서 하이픈을 제거
      const cleanedPhoneNumber = phone.replace(/-/g, '');
      console.log('Sending verification code to:', cleanedPhoneNumber); // 디버깅용 로그 추가
      
      await sendVerificationCode(cleanedPhoneNumber);
      
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
  
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "인증 실패",
        description: "인증번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const isValid = await verifyPhoneNumber(verificationCode);
      
      if (isValid) {
        setIsVerified(true);
        toast({
          title: "인증 성공",
          description: "전화번호가 인증되었습니다.",
        });
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
  
  const handleSignUp = async () => {
    if (!username || !password) {
      toast({
        title: "회원가입 실패",
        description: "아이디와 비밀번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    if (!isVerified) {
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
      // 전화번호에서 하이픈을 제거
      const cleanedPhoneNumber = phone.replace(/-/g, '');
      
      // signUp 함수 호출
      const result = await signUp(username, password, cleanedPhoneNumber);
      
      // 성공적으로 가입된 경우 /main 페이지로 리디렉션
      if (result && result.success) {
        navigate('/main');
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      // Error toast is already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };
  
  // 전화번호 입력 필드 값 변경 핸들러 - 디버깅용
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    console.log('Phone input changed:', e.target.value); // 디버깅용 로그 추가
  };
  
  // Send code button component for phone verification
  const SendCodeButton = () => (
    <button
      onClick={handleSendVerificationCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || timeLeft > 0}
      type="button"
    >
      {timeLeft > 0 ? "재발송" : "인증코드 발송"}
    </button>
  );
  
  // Verify button component
  const VerifyButton = () => (
    <button
      onClick={handleVerifyCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isLoading || isVerified}
      type="button"
    >
      {isVerified ? "인증완료" : "인증하기"}
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
          onChange={(e) => setUsername(e.target.value)}
          icon="user"
          state={isVerified ? 'success' : 'default'}
        />
        
        <InputField
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
          highlightFocus={true}
        />
        
        <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={handlePhoneChange} // 디버깅용 핸들러 사용
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
            
            {timeLeft > 0 && !isVerified && (
              <div className="text-right text-app-orange text-sm mb-4">
                남은 시간: {formatTime(timeLeft)}
              </div>
            )}
          </div>
        )}
        
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
          disabled={isLoading || !isVerified}
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
