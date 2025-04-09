
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/BackButton';
import InputField from '@/components/InputField';
import CheckboxField from '@/components/CheckboxField';
import AuthButton from '@/components/AuthButton';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "로그인 실패",
        description: "이메일과 비밀번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically handle API authentication
    toast({
      title: "로그인 성공",
      description: "환영합니다!",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="로그인" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="email"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="user"
        />
        
        <InputField
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon="lock"
        />
        
        <div className="flex justify-between mb-10 mt-2">
          <CheckboxField
            label="아이디 저장"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          <button 
            className="text-app-gray-text text-sm"
            onClick={() => navigate('/find-credentials')}
          >
            아이디/비밀번호 찾기
          </button>
        </div>
        
        <AuthButton 
          label="회원가입" 
          onClick={handleLogin}
          className="mb-10"
        />
        
        <div className="mt-auto text-center">
          <p className="text-app-gray-text text-sm">
            이미 계정이 있으신가요? <button className="text-app-orange" onClick={() => navigate('/signup')}>로그인</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
