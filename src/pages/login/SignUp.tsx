
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/BackButton';
import InputField from '@/components/InputField';
import CheckboxField from '@/components/CheckboxField';
import AuthButton from '@/components/AuthButton';
import { useToast } from '@/hooks/use-toast';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'default' | 'error' | 'success'>('default');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [verification, setVerification] = useState(false);
  
  const checkUsername = () => {
    if (!username) {
      toast({
        title: "오류",
        description: "아이디를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (username === 'bodhi4') {
      setUsernameStatus('error');
      setUsernameMessage('사용 불가능한 아이디입니다');
    } else if (username.length > 3) {
      setUsernameStatus('success');
      setUsernameMessage('사용 가능한 아이디입니다');
    } else {
      setUsernameStatus('error');
      setUsernameMessage('아이디는 3글자 이상이어야 합니다');
    }
  };
  
  const sendVerificationCode = () => {
    if (!phone) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "인증번호 발송",
      description: "인증번호가 발송되었습니다. 2분 안에 입력해주세요.",
    });
    
    setShowVerification(true);
  };
  
  const handleSignUp = () => {
    if (!username || !phone || !password) {
      toast({
        title: "회원가입 실패",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (usernameStatus === 'error') {
      toast({
        title: "회원가입 실패",
        description: "사용할 수 없는 아이디입니다.",
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
    
    if (showVerification && !verificationCode) {
      toast({
        title: "회원가입 실패",
        description: "인증번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically handle API registration
    toast({
      title: "회원가입 성공",
      description: "환영합니다!",
    });
    navigate('/');
  };
  
  // Check button component for username verification
  const CheckButton = () => (
    <button
      onClick={checkUsername}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
    >
      중복확인
    </button>
  );
  
  // Send code button component for phone verification
  const SendCodeButton = () => (
    <button
      onClick={sendVerificationCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
    >
      인증코드 발송
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
            <span className="ml-2">사용 가능한 아이디입니다</span>
          </div>
        )}
        
        <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          rightElement={<SendCodeButton />}
        />
        
        {showVerification && (
          <InputField
            type="text"
            label="인증코드"
            placeholder="인증코드를 입력해 주세요"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="mb-8"
          />
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
          label="회원가입" 
          onClick={handleSignUp}
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
