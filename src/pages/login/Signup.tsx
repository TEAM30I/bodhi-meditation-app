
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { validateEmail, validatePassword, validatePhone } from '@/utils/validations';
import { initiateEmailVerification, verifyEmailCode, initiatePhoneVerification, verifyPhoneCode } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

// Import the correct components
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setEmailValid(validateEmail(email));
  }, [email]);

  useEffect(() => {
    setPhoneValid(validatePhone(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setPasswordValid(validatePassword(password));
    setPasswordMatch(password === passwordConfirm && password.length > 0);
  }, [password, passwordConfirm]);

  useEffect(() => {
    setNameValid(name.length >= 2);
  }, [name]);

  const handleGoBack = () => {
    if (stage === 'agreement') {
      navigate('/login/auth');
    } else if (stage === 'email') {
      setStage('agreement');
    } else if (stage === 'phone') {
      setStage('email');
    } else if (stage === 'password') {
      setStage('phone');
    } else if (stage === 'name') {
      setStage('password');
    }
  };

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
    setIsLoading(true);
    try {
      const result = await initiateEmailVerification(email, name);
      if (result.success) {
        toast({
          title: "회원가입이 완료되었습니다",
          description: "로그인 페이지로 이동합니다",
        });

        // 회원가입 성공 시 로그인 페이지로 이동하면서 이메일 값을 전달
        navigate(`/login/login?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "회원가입 중 오류가 발생했습니다",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "회원가입 중 오류가 발생했습니다",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = () => {
    setEmailVerified(true);
    toast({
      title: "이메일 인증 완료",
      description: "인증이 완료되었습니다.",
    });
  };

  const handlePhoneVerification = () => {
    setPhoneVerified(true);
    toast({
      title: "전화번호 인증 완료",
      description: "인증이 완료되었습니다.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-12">
      <SignupHeader handleGoBack={handleGoBack} />

      <div className="flex-1 mt-12">
        {stage === 'agreement' && (
          <AgreementSection 
            agreed={agreed} 
            setAgreed={setAgreed}
          />
        )}

        {stage === 'email' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">이메일</label>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해 주세요"
                  className="flex-1 p-3 border rounded-l"
                />
                <button
                  onClick={handleEmailVerification}
                  disabled={!emailValid || emailVerified}
                  className={`px-4 py-2 ${
                    emailVerified
                      ? "bg-green-500 text-white"
                      : emailValid
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  } rounded-r`}
                >
                  {emailVerified ? "인증 완료" : "인증"}
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'phone' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">휴대폰 번호</label>
              <div className="flex">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="휴대폰 번호를 입력해 주세요"
                  className="flex-1 p-3 border rounded-l"
                />
                <button
                  onClick={handlePhoneVerification}
                  disabled={!phoneValid || phoneVerified}
                  className={`px-4 py-2 ${
                    phoneVerified
                      ? "bg-green-500 text-white"
                      : phoneValid
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  } rounded-r`}
                >
                  {phoneVerified ? "인증 완료" : "인증"}
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'password' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                className="w-full p-3 border rounded"
              />
              {password && !passwordValid && (
                <p className="text-red-500 text-xs mt-1">
                  비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력해 주세요"
                className="w-full p-3 border rounded"
              />
              {passwordConfirm && (
                <p
                  className={`text-xs mt-1 ${
                    passwordMatch ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </div>
          </div>
        )}

        {stage === 'name' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요"
                className="w-full p-3 border rounded"
              />
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={handleNextStage} 
        disabled={
          (stage === 'agreement' && !requiredAgreed) ||
          (stage === 'email' && (!emailValid || !emailVerified)) ||
          (stage === 'phone' && (!phoneValid || !phoneVerified)) ||
          (stage === 'password' && (!passwordValid || !passwordMatch)) ||
          (stage === 'name' && !nameValid) ||
          isLoading
        }
        className="w-full h-[60px] bg-[#DE7834] hover:bg-[#C26929] text-white rounded-[16px] text-[18px] font-semibold mt-6"
      >
        {isLoading ? '처리 중...' : stage === 'name' ? '가입하기' : '다음'}
      </Button>
    </div>
  );
};

export default Signup;
