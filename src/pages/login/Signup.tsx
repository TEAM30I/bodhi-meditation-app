
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import NameInputSection from '@/components/login/NameInputSection';
import EmailVerificationSection from '@/components/login/EmailVerificationSection';
import PhoneVerificationSection from '@/components/login/PhoneVerificationSection';
import PasswordSetupSection from '@/components/login/PasswordSetupSection';
import { useTimer } from '@/hooks/useTimer';
import { validateEmail, validatePhone, validatePassword } from '@/utils/validations';
import { 
  initiateEmailVerification, 
  verifyEmailCode,
  initiatePhoneVerification,
  verifyPhoneCode
} from '@/services/authService';

export default function Signup() {
  const navigate = useNavigate();
  // User input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Email verification states
  const [emailValid, setEmailValid] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [emailVerificationComplete, setEmailVerificationComplete] = useState(false);
  
  // Phone verification states
  const [phoneValid, setPhoneValid] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [phoneVerificationComplete, setPhoneVerificationComplete] = useState(false);
  
  // Password section visibility
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  
  // Timer hooks
  const { 
    timer: emailTimer,
    timerActive: emailTimerActive,
    timerExpired: emailTimerExpired,
    startTimer: startEmailTimer,
    setTimerExpired: setEmailTimerExpired,
    formatTime
  } = useTimer(3, 0);
  
  const { 
    timer: phoneTimer,
    timerActive: phoneTimerActive,
    timerExpired: phoneTimerExpired,
    startTimer: startPhoneTimer,
    setTimerExpired: setPhoneTimerExpired
  } = useTimer(3, 0);
  
  useEffect(() => {
    // Email validation
    setEmailValid(validateEmail(email));
    
    // Phone validation
    setPhoneValid(validatePhone(phone));
  }, [email, phone]);

  // Password validation effect
  useEffect(() => {
    setPasswordValid(validatePassword(password));
    
    // Check if passwords match
    setPasswordMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Handle email verification initiation
  const handleSendEmailVerification = async () => {
    if (!emailValid) {
      toast({
        title: "이메일 오류",
        description: "올바른 이메일 형식을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await initiateEmailVerification(email, name);
    
    if (result.success) {
      setEmailVerificationSent(true);
      startEmailTimer();
      
      toast({
        title: "인증 코드 발송",
        description: `${email}로 인증 코드가 발송되었습니다.`,
      });
    } else {
      if (result.message === "User already exists") {
        toast({
          title: "가입 오류",
          description: "이미 가입된 이메일입니다. 로그인 해주세요.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "이메일 인증 오류",
          description: result.message || "이메일 인증 과정에서 문제가 발생했습니다.",
          variant: "destructive",
        });
      }
    }
    
    setIsLoading(false);
  };
  
  // Handle email verification code confirmation
  const handleVerifyEmailCode = async () => {
    if (!emailVerificationCode || emailVerificationCode.length < 6) {
      toast({
        title: "인증 코드 오류",
        description: "올바른 인증 코드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await verifyEmailCode(email, emailVerificationCode);
    
    if (result.success) {
      setEmailVerificationComplete(true);
      setShowPhoneVerification(true);
      
      toast({
        title: "인증 완료",
        description: "이메일 인증이 완료되었습니다.",
      });
    } else {
      toast({
        title: "인증 코드 오류",
        description: result.message || "인증 코드 확인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };
  
  // Handle resending email verification code
  const handleResendEmailVerification = () => {
    // Reset timer and resend verification
    startEmailTimer();
    setEmailTimerExpired(false);
    handleSendEmailVerification();
  };
  
  // Handle phone verification initiation
  const handleSendPhoneVerification = async () => {
    if (!phoneValid) {
      toast({
        title: "전화번호 오류",
        description: "올바른 전화번호 형식을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await initiatePhoneVerification(email, name, phone);
    
    if (result.success) {
      // Start the phone verification timer
      setPhoneVerificationSent(true);
      startPhoneTimer();
      
      toast({
        title: "인증 코드 발송",
        description: `${phone}로 인증 코드가 발송되었습니다.`,
      });
    } else {
      toast({
        title: "전화번호 인증 오류",
        description: result.message || "전화번호 인증 과정에서 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };
  
  // Handle phone verification code confirmation
  const handleVerifyPhoneCode = async () => {
    if (!phoneVerificationCode || phoneVerificationCode.length < 6) {
      toast({
        title: "인증 코드 오류",
        description: "올바른 인증 코드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await verifyPhoneCode(email, phoneVerificationCode);
    
    if (result.success) {
      setPhoneVerificationComplete(true);
      setShowPasswordSection(true);
      
      toast({
        title: "인증 완료",
        description: "전화번호 인증이 완료되었습니다.",
      });
    } else {
      toast({
        title: "인증 코드 오류",
        description: result.message || "인증 코드 확인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };
  
  // Handle resending phone verification code
  const handleResendPhoneVerification = () => {
    // Reset timer and resend verification
    startPhoneTimer();
    setPhoneTimerExpired(false);
    handleSendPhoneVerification();
  };
  
  // Complete signup with final password
  const handleSignup = async () => {
    if (!name) {
      toast({
        title: "이름 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!emailVerificationComplete) {
      toast({
        title: "이메일 인증 필요",
        description: "이메일 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneVerificationComplete) {
      toast({
        title: "전화번호 인증 필요",
        description: "전화번호 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordValid) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 8자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordMatch) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreed) {
      toast({
        title: "약관 동의 필요",
        description: "서비스 이용약관에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // At this point the user is already created and verified
      // They just need to sign in with their final password
      // For simplicity, we'll show the success message and redirect to login
      
      toast({
        title: "회원가입 성공",
        description: "가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error("Final signup error:", error);
      toast({
        title: "회원가입 오류",
        description: error.message || "회원가입 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#181A20] text-white">
      {/* Header */}
      <div className="flex items-center h-16 px-6">
        <button onClick={handleGoBack}>
          <ArrowLeft className="mr-4" />
        </button>
        <h1 className="text-2xl font-medium">회원가입</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        <NameInputSection name={name} setName={setName} />
        
        <EmailVerificationSection 
          email={email}
          setEmail={setEmail}
          emailValid={emailValid}
          verificationSent={emailVerificationSent}
          setVerificationSent={setEmailVerificationSent}
          verificationCode={emailVerificationCode}
          setVerificationCode={setEmailVerificationCode}
          verificationComplete={emailVerificationComplete}
          setVerificationComplete={setEmailVerificationComplete}
          timerExpired={emailTimerExpired}
          setTimerExpired={setEmailTimerExpired}
          timer={emailTimer}
          setTimer={() => {}} // This prop is no longer needed
          timerActive={emailTimerActive}
          setTimerActive={() => {}} // This prop is no longer needed
          isLoading={isLoading}
          formatTime={formatTime}
          handleSendVerification={handleSendEmailVerification}
          handleVerifyCode={handleVerifyEmailCode}
          handleResendVerification={handleResendEmailVerification}
        />
        
        {showPhoneVerification && (
          <PhoneVerificationSection 
            phoneNumber={phone}
            setPhoneNumber={setPhone}
            phoneValid={phoneValid}
            phoneVerificationSent={phoneVerificationSent}
            phoneVerificationComplete={phoneVerificationComplete}
            phoneVerificationCode={phoneVerificationCode}
            setPhoneVerificationCode={setPhoneVerificationCode}
            phoneTimer={phoneTimer}
            phoneTimerExpired={phoneTimerExpired}
            isLoading={isLoading}
            formatTime={formatTime}
            handleSendPhoneVerification={handleSendPhoneVerification}
            handleVerifyPhoneCode={handleVerifyPhoneCode}
            handleResendPhoneVerification={handleResendPhoneVerification}
          />
        )}
        
        {showPasswordSection && (
          <PasswordSetupSection 
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordValid={passwordValid}
            passwordMatch={passwordMatch}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mr-2 rounded"
          />
          <label htmlFor="agreement" className="text-[#9EA3BE] font-pretendard text-[14px] font-medium">
            서비스 이용약관에 동의합니다.
          </label>
        </div>
        
        <Button
          onClick={handleSignup}
          disabled={isLoading || !name || !emailVerificationComplete || !phoneVerificationComplete || 
                   !password || password !== confirmPassword || !agreed}
          className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
        >
          {isLoading ? '처리 중...' : '가입하기'}
        </Button>
      </div>
    </div>
  );
}
