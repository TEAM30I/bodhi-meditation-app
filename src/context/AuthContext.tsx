import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { toast } from '@/components/ui/use-toast';

// AWS Amplify getCurrentUser 반환 타입 정의
interface AmplifyUser {
  username: string;
  userId?: string;
  signInDetails?: {
    loginId?: string;
  };
}

interface User {
  username: string;
  email: string;
  attributes?: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      console.log('사용자 정보 가져오기 시도');
      
      // 타임아웃 설정 - API 응답이 너무 오래 걸릴 경우를 대비
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('사용자 정보 가져오기 타임아웃')), 3000)
      );
      
      // 사용자 정보 가져오기 또는 타임아웃 중 먼저 발생하는 것 처리
      const userData = await Promise.race([
        getCurrentUser(),
        timeoutPromise
      ]) as AmplifyUser;  // 반환 타입을 명시적으로 지정
      
      console.log('사용자 정보 가져오기 성공:', userData);
      
      // Cognito에서 사용자 정보 가져오기
      setUser({
        username: userData.username,
        email: userData.username, // Cognito에서는 email을 username으로 사용하는 경우가 많음
        attributes: userData.signInDetails?.loginId 
          ? { email: userData.signInDetails.loginId }
          : undefined
      });
      
      console.log('사용자 상태 설정 완료');
    } catch (error) {
      // 로그인되지 않은 상태는 에러가 아님
      console.log('사용자 인증 안됨 또는 타임아웃:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      toast({
        title: "로그아웃 성공",
        description: "안전하게 로그아웃되었습니다.",
      });
    } catch (error) {
      console.error('로그아웃 에러:', error);
      toast({
        title: "로그아웃 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;