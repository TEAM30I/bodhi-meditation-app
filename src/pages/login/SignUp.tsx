
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import CheckboxField from '@/components/login/CheckboxField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { ListUsersCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { awsconfig } from '@/config/aws-config';

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
  const [isChecking, setIsChecking] = useState(false);
  const [verification, setVerification] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
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
      // Use ListUsers API to check if the username already exists
      const client = new CognitoIdentityProviderClient({
        region: awsconfig.aws_project_region
      });
      
      const command = new ListUsersCommand({
        UserPoolId: awsconfig.aws_user_pools_id,
        Filter: `username = "${username}"`,
        Limit: 1
      });
      
      const { Users } = await client.send(command);
      
      if (Users && Users.length > 0) {
        setUsernameStatus('error');
        setUsernameMessage('사용 불가능한 아이디입니다');
      } else if (username.length > 3) {
        setUsernameStatus('success');
        setUsernameMessage('사용 가능한 아이디입니다');
      } else {
        setUsernameStatus('error');
        setUsernameMessage('아이디는 3글자 이상이어야 합니다');
      }
    } catch (error) {
      console.error('Username check error:', error);
      toast({
        title: "오류",
        description: "아이디 확인 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const sendVerificationCode = async () => {
    if (!phone) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Initiate sign up but only to send the verification code
      // Use AWS Cognito directly
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: `temp_${Date.now()}`, // Temporary username
        password: `TempPw${Date.now()}!`, // Temporary password
        options: {
          userAttributes: {
            phone_number: phone
          },
          autoSignIn: false
        }
      });
      
      // Start countdown timer for 3 minutes (180 seconds)
      setTimeLeft(180);
      toast({
        title: "인증번호 발송",
        description: "인증번호가 발송되었습니다. 3분 안에 입력해주세요.",
      });
      setShowVerification(true);
      
      console.log('Phone verification initiated:', { isSignUpComplete, userId, nextStep });
    } catch (error: any) {
      console.error('Phone verification error:', error);
      
      // Provide a better error message
      let errorMessage = "인증번호 발송에 실패했습니다.";
      
      if (error.name === 'InvalidParameterException') {
        errorMessage = "올바른 전화번호 형식이 아닙니다. 국가 코드를 포함해주세요 (예: +8210...)";
      } else if (error.name === 'LimitExceededException') {
        errorMessage = "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
      }
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  const handleSignUp = async () => {
    if (!username || !phone || !password) {
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
    
    if (showVerification && !verificationCode) {
      toast({
        title: "회원가입 실패",
        description: "인증번호를 입력해주세요.",
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
      // Register the user with Cognito
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            phone_number: phone,
          },
          autoSignIn: true
        }
      });
      
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        toast({
          title: "회원가입 진행 중",
          description: "인증이 필요합니다.",
        });
        
        // Verify the code
        const confirmResult = await confirmSignUp({
          username,
          confirmationCode: verificationCode
        });
        
        if (confirmResult.isSignUpComplete) {
          toast({
            title: "회원가입 성공",
            description: "프로필 설정 단계로 이동합니다.",
          });
          
          // Navigate to profile setup
          navigate('/profile-setup');
        } else {
          toast({
            title: "인증 실패",
            description: "인증 코드가 올바르지 않습니다.",
            variant: "destructive"
          });
        }
      } else if (isSignUpComplete) {
        toast({
          title: "회원가입 성공",
          description: "프로필 설정 단계로 이동합니다.",
        });
        
        // Navigate to profile setup
        navigate('/profile-setup');
      }
    } catch (error: any) {
      console.error('SignUp error:', error);
      
      let errorMessage = "회원가입 중 오류가 발생했습니다.";
      if (error.name === 'UsernameExistsException') {
        errorMessage = "이미 존재하는 사용자 아이디입니다.";
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = "비밀번호는 8자 이상이어야 합니다.";
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = "입력된 정보가 올바르지 않습니다.";
      } else if (error.name === 'CodeMismatchException') {
        errorMessage = "인증 코드가 올바르지 않습니다.";
      }
      
      toast({
        title: "회원가입 실패",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check button component for username verification
  const CheckButton = () => (
    <button
      onClick={checkUsername}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={isChecking}
    >
      {isChecking ? "확인 중..." : "중복확인"}
    </button>
  );
  
  // Send code button component for phone verification
  const SendCodeButton = () => (
    <button
      onClick={sendVerificationCode}
      className="text-white text-sm bg-app-orange px-4 py-1 rounded-md"
      disabled={timeLeft > 0}
    >
      {timeLeft > 0 ? "재발송" : "인증코드 발송"}
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
          placeholder="전화번호를 입력해 주세요 (+8210...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          rightElement={<SendCodeButton />}
        />
        
        {showVerification && (
          <div>
            <InputField
              type="text"
              label="인증코드"
              placeholder="인증코드를 입력해 주세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mb-1"
            />
            {timeLeft > 0 && (
              <div className="text-right text-app-orange text-sm mb-4">
                남은 시간: {formatTime(timeLeft)}
              </div>
            )}
            {timeLeft === 0 && showVerification && (
              <div className="text-right text-red-500 text-sm mb-4">
                인증 시간이 만료되었습니다. 재발송해주세요.
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
