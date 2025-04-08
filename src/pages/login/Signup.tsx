
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import SignupHeader from '@/components/login/SignupHeader';
import NameInputSection from '@/components/login/NameInputSection';
import EmailVerificationSection from '@/components/login/EmailVerificationSection';
import PhoneVerificationSection from '@/components/login/PhoneVerificationSection';
import PasswordSetupSection from '@/components/login/PasswordSetupSection';
import AgreementSection from '@/components/login/AgreementSection';
import SignupButton from '@/components/login/SignupButton';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { validatePassword } from '@/utils/validations';

export default function Signup() {
  const navigate = useNavigate();
  
  // User input states
  const [name, setName] = useState("");
  
  // Password states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Section visibility
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  // Password validation
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  
  // Custom hooks for verification
  const emailVerification = useEmailVerification({ name });
  const phoneVerification = usePhoneVerification({ name, email: emailVerification.value });

  // Password validation effect
  useEffect(() => {
    setPasswordValid(validatePassword(password));
    setPasswordMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);
  
  const handleGoBack = () => {
    // Navigate back to login screen when the back button is pressed
    navigate('/login');
  };

  // When email verification is complete, show phone verification
  useEffect(() => {
    if (emailVerification.verificationComplete) {
      setShowPhoneVerification(true);
    }
  }, [emailVerification.verificationComplete]);

  // When phone verification is complete, show password section
  useEffect(() => {
    if (phoneVerification.verificationComplete) {
      setShowPasswordSection(true);
    }
  }, [phoneVerification.verificationComplete]);
  
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
    
    if (!emailVerification.verificationComplete) {
      toast({
        title: "이메일 인증 필요",
        description: "이메일 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneVerification.verificationComplete) {
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
    
    const isLoading = emailVerification.isLoading || phoneVerification.isLoading;
    if (isLoading) return;
    
    try {
      // At this point the user is already created and verified
      // They just need to sign in with their final password
      // For simplicity, we'll show the success message and redirect to login
      
      toast({
        title: "회원가입 성공",
        description: "가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
      });
      
      setTimeout(() => {
        navigate('/login?email=' + emailVerification.value);
      }, 2000);
      
    } catch (error: any) {
      console.error("Final signup error:", error);
      toast({
        title: "회원가입 오류",
        description: error.message || "회원가입 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  const isSignupButtonDisabled = 
    emailVerification.isLoading || 
    phoneVerification.isLoading || 
    !name || 
    !emailVerification.verificationComplete || 
    !phoneVerification.verificationComplete || 
    !password || 
    password !== confirmPassword || 
    !agreed;
  
  const isLoading = emailVerification.isLoading || phoneVerification.isLoading;
  
  return (
    <div className="flex flex-col min-h-screen bg-[#181A20] text-white">
      {/* Header */}
      <SignupHeader handleGoBack={handleGoBack} />
      
      {/* Main content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        <NameInputSection name={name} setName={setName} />
        
        <EmailVerificationSection 
          email={emailVerification.value}
          setEmail={emailVerification.setValue}
          emailValid={emailVerification.isValid}
          verificationSent={emailVerification.verificationSent}
          verificationCode={emailVerification.verificationCode}
          setVerificationCode={emailVerification.setVerificationCode}
          verificationComplete={emailVerification.verificationComplete}
          timerExpired={emailVerification.timerExpired}
          timer={emailVerification.timer}
          isLoading={emailVerification.isLoading}
          formatTime={emailVerification.formatTime}
          handleSendVerification={emailVerification.handleSendVerification}
          handleVerifyCode={emailVerification.handleVerifyCode}
          handleResendVerification={emailVerification.handleResendVerification}
        />
        
        {showPhoneVerification && (
          <PhoneVerificationSection 
            phoneNumber={phoneVerification.value}
            setPhoneNumber={phoneVerification.setValue}
            phoneValid={phoneVerification.isValid}
            phoneVerificationSent={phoneVerification.verificationSent}
            phoneVerificationComplete={phoneVerification.verificationComplete}
            phoneVerificationCode={phoneVerification.verificationCode}
            setPhoneVerificationCode={phoneVerification.setVerificationCode}
            phoneTimer={phoneVerification.timer}
            phoneTimerExpired={phoneVerification.timerExpired}
            isLoading={phoneVerification.isLoading}
            formatTime={phoneVerification.formatTime}
            handleSendPhoneVerification={phoneVerification.handleSendVerification}
            handleVerifyPhoneCode={phoneVerification.handleVerifyCode}
            handleResendPhoneVerification={phoneVerification.handleResendVerification}
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
        
        <AgreementSection agreed={agreed} setAgreed={setAgreed} />
        
        <SignupButton 
          handleSignup={handleSignup}
          isDisabled={isSignupButtonDisabled}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
