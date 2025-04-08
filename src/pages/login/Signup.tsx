
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { signUp } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import NameInputSection from '@/components/login/NameInputSection';

interface EmailVerificationSectionProps {
  email: string;
  setEmail: (email: string) => void;
  onVerifyEmail: () => void;
  isEmailVerified: boolean;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({ 
  email, 
  setEmail, 
  onVerifyEmail, 
  isEmailVerified 
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
        이메일
      </label>
      <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해 주세요"
          className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={onVerifyEmail}
          disabled={isEmailVerified || !email.includes('@')}
          className={`h-[40px] px-4 py-2 rounded-[12px] text-[#fff] text-[14px] font-medium ${
            isEmailVerified ? 'bg-green-500' : 'bg-[#DE7834]'
          }`}
        >
          {isEmailVerified ? '인증 완료' : '인증하기'}
        </Button>
      </div>
    </div>
  );
};

interface PhoneVerificationSectionProps {
  phone: string;
  setPhone: (phone: string) => void;
  onVerifyPhone: () => void;
  isPhoneVerified: boolean;
  showPhoneVerification: boolean;
}

const PhoneVerificationSection: React.FC<PhoneVerificationSectionProps> = ({ 
  phone, 
  setPhone, 
  onVerifyPhone, 
  isPhoneVerified,
  showPhoneVerification 
}) => {
  if (!showPhoneVerification) return null;
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
        전화번호
      </label>
      <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호를 입력해 주세요 (- 없이)"
          className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
        />
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={onVerifyPhone}
          disabled={isPhoneVerified || !phone || phone.length < 10}
          className={`h-[40px] px-4 py-2 rounded-[12px] text-[#fff] text-[14px] font-medium ${
            isPhoneVerified ? 'bg-green-500' : 'bg-[#DE7834]'
          }`}
        >
          {isPhoneVerified ? '인증 완료' : '인증하기'}
        </Button>
      </div>
    </div>
  );
};

interface PasswordSetupSectionProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showPasswordSection: boolean;
}

const PasswordSetupSection: React.FC<PasswordSetupSectionProps> = ({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword,
  showPasswordSection 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  if (!showPasswordSection) return null;
  
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
          비밀번호
        </label>
        <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#777C89]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
          비밀번호 확인
        </label>
        <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-[#777C89]"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  // Verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  // For the verification code modal
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email');
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleVerifyEmail = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "이메일 오류",
        description: "올바른 이메일 형식을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setVerificationType('email');
    setShowVerificationModal(true);
    
    // Simulate sending code via email
    toast({
      title: "인증 코드 발송",
      description: `${email}로 인증 코드가 발송되었습니다.`,
    });
  };
  
  const handleVerifyPhone = () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "전화번호 오류",
        description: "올바른 전화번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setVerificationType('phone');
    setShowVerificationModal(true);
    
    // Simulate sending code via SMS
    toast({
      title: "인증 코드 발송",
      description: `${phone}로 인증 코드가 발송되었습니다.`,
    });
  };
  
  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "인증 코드 오류",
        description: "6자리 인증 코드를 정확히 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate code verification success
    if (verificationType === 'email') {
      setIsEmailVerified(true);
      setShowPhoneVerification(true);
    } else {
      setIsPhoneVerified(true);
      setShowPasswordSection(true);
    }
    
    setShowVerificationModal(false);
    setVerificationCode("");
    
    toast({
      title: "인증 완료",
      description: `${verificationType === 'email' ? '이메일' : '전화번호'} 인증이 완료되었습니다.`,
    });
  };
  
  const handleSignup = async () => {
    if (!name) {
      toast({
        title: "이름 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isEmailVerified) {
      toast({
        title: "이메일 인증 필요",
        description: "이메일 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isPhoneVerified) {
      toast({
        title: "전화번호 인증 필요",
        description: "전화번호 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 8자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
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
    
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            name,
            email,
            phone_number: '+82' + phone,
          },
          autoSignIn: true,
        },
      });
      
      if (result.isSignUpComplete) {
        // Sign out after successful sign up to prevent auto sign-in issues
        await signOut();
        
        toast({
          title: "회원가입 성공",
          description: "가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "회원가입 오류",
        description: error.message || "회원가입 중 문제가 발생했습니다.",
        variant: "destructive",
      });
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
          onVerifyEmail={handleVerifyEmail}
          isEmailVerified={isEmailVerified}
        />
        
        <PhoneVerificationSection 
          phone={phone}
          setPhone={setPhone}
          onVerifyPhone={handleVerifyPhone}
          isPhoneVerified={isPhoneVerified}
          showPhoneVerification={showPhoneVerification}
        />
        
        <PasswordSetupSection 
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPasswordSection={showPasswordSection}
        />
        
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
          disabled={!name || !isEmailVerified || !isPhoneVerified || !password || password !== confirmPassword || !agreed}
          className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
        >
          가입하기
        </Button>
      </div>
      
      {/* Verification Code Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252932] p-6 rounded-[16px] w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">인증 코드 입력</h2>
            <p className="text-[#9EA3BE] mb-4">
              {verificationType === 'email' ? email : phone}로 발송된 6자리 인증코드를 입력하세요.
            </p>
            <div className="mb-4">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="6자리 인증 코드"
                className="bg-[#181A20] border-none text-white"
                maxLength={6}
              />
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowVerificationModal(false)}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
              <Button 
                onClick={handleVerifyCode}
                className="flex-1 bg-[#DE7834]"
                disabled={verificationCode.length !== 6}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
