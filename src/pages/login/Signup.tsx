
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SignupHeader from '@/components/login/SignupHeader';
import AgreementSection from '@/components/login/AgreementSection';
import EmailVerificationSection from '@/components/login/EmailVerificationSection';
import PhoneVerificationSection from '@/components/login/PhoneVerificationSection';
import PasswordSetupSection from '@/components/login/PasswordSetupSection';
import NameInputSection from '@/components/login/NameInputSection';
import SignupButton from '@/components/login/SignupButton';
import { signupUser } from '@/services/authService';

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Form states
  const [allAgreed, setAllAgreed] = useState(false);
  const [requiredAgreed, setRequiredAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(false);
  
  // Form validations
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [isPasswordStep, setIsPasswordStep] = useState(false);
  const [isNameStep, setIsNameStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = () => {
    const re = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return re.test(phoneNumber);
  };

  const goToNextStep = () => {
    if (!isVerificationStep && emailVerified) {
      setIsVerificationStep(true);
    } else if (isVerificationStep && !isPasswordStep && phoneVerified) {
      setIsPasswordStep(true);
    } else if (isPasswordStep && !isNameStep && passwordValid && passwordMatch) {
      setIsNameStep(true);
    }
  };

  // Handle email verification complete
  const handleEmailVerified = () => {
    setEmailVerified(true);
    setIsVerificationStep(true); // Move to phone verification step
  };

  // Handle phone verification complete
  const handlePhoneVerified = () => {
    setPhoneVerified(true);
    setIsPasswordStep(true); // Move to password setup step
  };

  // Handle password validation
  useEffect(() => {
    // Password must be at least 8 characters
    setPasswordValid(password.length >= 8);
    // Passwords must match
    setPasswordMatch(password === passwordConfirm);
  }, [password, passwordConfirm]);

  // Handle name validation
  useEffect(() => {
    setNameValid(name.trim().length >= 2);
  }, [name]);

  // Handle signup
  const handleSignup = async () => {
    if (!requiredAgreed || !emailVerified || !phoneVerified || !passwordValid || !passwordMatch || !nameValid) {
      toast({
        title: "필수 정보를 모두 입력해주세요",
        description: "모든 필수 항목을 완료해야 가입이 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call signup service
      const result = await signupUser({
        email,
        password,
        name,
        phoneNumber,
        marketingAgreed
      });

      if (result.success) {
        toast({
          title: "회원가입 성공!",
          description: "이메일 인증을 완료한 후 로그인해주세요.",
        });
        navigate(`/login/login?email=${email}`);
      } else {
        toast({
          title: "회원가입 실패",
          description: result.message || "오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "회원가입 오류",
        description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user, navigate]);

  // Handle back button
  const handleGoBack = () => {
    if (isNameStep) {
      setIsNameStep(false);
    } else if (isPasswordStep) {
      setIsPasswordStep(false);
    } else if (isVerificationStep) {
      setIsVerificationStep(false);
    } else {
      navigate('/login/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SignupHeader handleGoBack={handleGoBack} />

      <div className="flex-1 px-6">
        {/* Step 1: Agreements */}
        {!isVerificationStep && (
          <AgreementSection 
            allAgreed={allAgreed}
            requiredAgreed={requiredAgreed}
            marketingAgreed={marketingAgreed}
            setAllAgreed={setAllAgreed}
            setRequiredAgreed={setRequiredAgreed}
            setMarketingAgreed={setMarketingAgreed}
          />
        )}

        {/* Step 2: Email Verification */}
        {!isVerificationStep && (
          <EmailVerificationSection 
            email={email}
            setEmail={setEmail}
            isEmailValid={validateEmail()}
            onVerified={handleEmailVerified}
          />
        )}

        {/* Step 3: Phone Verification */}
        {isVerificationStep && !isPasswordStep && (
          <PhoneVerificationSection
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isPhoneValid={validatePhone()}
            onVerified={handlePhoneVerified}
          />
        )}

        {/* Step 4: Password Setup */}
        {isPasswordStep && !isNameStep && (
          <PasswordSetupSection
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            passwordValid={passwordValid}
            passwordMatch={passwordMatch}
          />
        )}

        {/* Step 5: Name Input */}
        {isNameStep && (
          <NameInputSection
            name={name}
            setName={setName}
            nameValid={nameValid}
          />
        )}

        {/* Next/Signup Button */}
        <div className="mt-auto pb-8">
          {!isNameStep ? (
            <Button
              onClick={goToNextStep}
              disabled={
                (!isVerificationStep && (!requiredAgreed || !emailVerified)) ||
                (isVerificationStep && !isPasswordStep && !phoneVerified) ||
                (isPasswordStep && !isNameStep && (!passwordValid || !passwordMatch))
              }
              className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
            >
              다음
            </Button>
          ) : (
            <SignupButton 
              handleSignup={handleSignup}
              isDisabled={!nameValid || isLoading}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
