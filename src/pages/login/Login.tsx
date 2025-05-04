import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import CheckboxField from '@/components/login/CheckboxField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "로그인 실패",
        description: "아이디와 비밀번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // signIn 함수에 username과 password를 전달합니다
      await signIn(username, password);
      
      // 로그인 성공 토스트는 signIn 함수 내부에서 처리됩니다
      
      // 로그인 성공 시 리다이렉트가 필요하다면 여기서 처리할 수 있습니다
      navigate('/main');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "로그인 중 오류가 발생했습니다.";
      
      if (error.name === 'UserNotFoundException') {
        errorMessage = "존재하지 않는 사용자입니다.";
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다.";
      }
      
      toast({
        title: "로그인 실패",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      <BackButton label="로그인" />
      <div className="mt-8 animate-slide-up">
        <InputField
          type="text"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon="user"
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
        <div className="flex justify-between mb-10 mt-2">
          <CheckboxField
            label="아이디 저장"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          <button
            className="text-app-gray-text text-sm"
            onClick={() => navigate('/find-credentials-choice')}
          >
            아이디/비밀번호 찾기
          </button>
        </div>
        <AuthButton
          label={isLoading ? "로그인 중..." : "로그인"}
          onClick={handleLogin}
          disabled={isLoading}
          className="mb-10"
        />
        <div className="mt-auto text-center">
          <p className="text-app-gray-text text-sm">
            아직 계정이 없으신가요? <button className="text-app-orange" onClick={() => navigate('/signup')}>회원가입</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;