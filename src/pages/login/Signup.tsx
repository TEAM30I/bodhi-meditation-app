
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/utils/validations';
import { signUp, confirmSignUp } from '@/services/authService';
import { useAuthContext } from '@/context/AuthContext';
import SignupHeader from '@/components/login/SignupHeader';
import AgreementSection from '@/components/login/AgreementSection';
import EmailVerificationSection from '@/components/login/EmailVerificationSection';
import PhoneVerificationSection from '@/components/login/PhoneVerificationSection';
import PasswordSetupSection from '@/components/login/PasswordSetupSection';
import NameInputSection from '@/components/login/NameInputSection';
import SignupButton from '@/components/login/SignupButton';

type SignupStage = 'agreement' | 'email' | 'phone' | 'password' | 'name';

const Signup: React.FC = () => {
  const [stage, setStage] = useState<SignupStage>('agreement');
  const [agreed, setAgreed] = useState<boolean>(false);
  const [requiredAgreed, setRequiredAgreed] = useState<boolean>(false);
  const [marketingAgreed, setMarketingAgreed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneValid, setPhoneValid] = useState<boolean>(false);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [nameValid, setNameValid] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  useEffect(() => {
    setEmailValid(validateEmail(email));
  }, [email]);

  useEffect(() => {
    setPhoneValid(validatePhoneNumber(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setPasswordValid(validatePassword(password));
    setPasswordMatch(password === passwordConfirm && password.length > 0);
  }, [password, passwordConfirm]);

  useEffect(() => {
    setNameValid(name.length >= 2);
  }, [name]);

  const handleNextStage = () => {
    switch (stage) {
      case 'agreement':
        if (requiredAgreed) {
          setStage('email');
        } else {
          toast({
            title: "필수 약관에 동의해주세요",
            variant: "destructive",
          });
        }
        break;

      case 'email':
        if (emailVerified) {
          setStage('phone');
        } else {
          toast({
            title: "이메일 인증을 완료해주세요",
            variant: "destructive",
          });
        }
        break;

      case 'phone':
        if (phoneVerified) {
          setStage('password');
        } else {
          toast({
            title: "전화번호 인증을 완료해주세요",
            variant: "destructive",
          });
        }
        break;

      case 'password':
        if (passwordValid && passwordMatch) {
          setStage('name');
        } else {
          toast({
            title: "비밀번호를 다시 확인해주세요",
            variant: "destructive",
          });
        }
        break;

      case 'name':
        if (nameValid) {
          handleSignup();
        } else {
          toast({
            title: "이름을 입력해주세요",
            variant: "destructive",
          });
        }
        break;
    }
  };

  const handleSignup = async () => {
    try {
      await signUp({
        username: email,
        password: password,
        email: email,
        phone_number: phoneNumber,
        name: name
      });
      
      toast({
        title: "회원가입이 완료되었습니다",
        description: "로그인 페이지로 이동합니다",
      });

      // 회원가입 성공 시 로그인 페이지로 이동하면서 이메일 값을 전달
      navigate(`/login/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "회원가입 중 오류가 발생했습니다",
        variant: "destructive",
      });
    }
  };

  const handleEmailVerification = () => {
    // Set email as verified
    setEmailVerified(true);
    toast({
      title: "이메일 인증 완료",
      description: "인증이 완료되었습니다.",
    });
  };

  const handlePhoneVerification = () => {
    // Set phone as verified
    setPhoneVerified(true);
    toast({
      title: "전화번호 인증 완료",
      description: "인증이 완료되었습니다.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-12">
      <SignupHeader 
        stage={stage} 
        onBack={() => navigate(-1)} 
      />

      <div className="flex-1 mt-12">
        {stage === 'agreement' && (
          <AgreementSection 
            agreed={agreed}
            requiredAgreed={requiredAgreed}
            marketingAgreed={marketingAgreed}
            setAgreed={setAgreed}
            setRequiredAgreed={setRequiredAgreed}
            setMarketingAgreed={setMarketingAgreed}
          />
        )}

        {stage === 'email' && (
          <EmailVerificationSection
            email={email}
            setEmail={setEmail}
            emailValid={emailValid}
            onVerified={handleEmailVerification}
          />
        )}

        {stage === 'phone' && (
          <PhoneVerificationSection
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phoneValid={phoneValid}
            onVerified={handlePhoneVerification}
          />
        )}

        {stage === 'password' && (
          <PasswordSetupSection
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            passwordValid={passwordValid} 
            passwordMatch={passwordMatch}
          />
        )}

        {stage === 'name' && (
          <NameInputSection
            name={name}
            setName={setName}
            nameValid={nameValid}
          />
        )}
      </div>

      <SignupButton 
        onClick={handleNextStage} 
        disabled={
          (stage === 'agreement' && !requiredAgreed) ||
          (stage === 'email' && (!emailValid || !emailVerified)) ||
          (stage === 'phone' && (!phoneValid || !phoneVerified)) ||
          (stage === 'password' && (!passwordValid || !passwordMatch)) ||
          (stage === 'name' && !nameValid)
        }
        label={stage === 'name' ? '가입하기' : '다음'}
      />
    </div>
  );
};

export default Signup;
