import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { verifyCode } from '@/services/smsService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, phoneNumber: string, email?: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyPhoneNumber: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // 세션 초기화 및 복원
  useEffect(() => {
    // 컴포넌트 마운트 시 세션 복원
    const initSession = async () => {
      try {
        setLoading(true);
        
        // supabase에서 현재 세션 가져오기
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          return;
        }
        
        if (data && data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Unexpected error during session init:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        console.log('Auth state changed:', _event, !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      // username을 이메일 형식으로 변환
      const email = username.includes('@') ? username : `${username}@example.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "로그인 실패",
        description: error.message || "아이디와 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneNumber = async (code: string): Promise<boolean> => {
    try {
      return await verifyCode(code);
    } catch (error) {
      console.error('Phone verification error:', error);
      return false;
    }
  };

  const signUp = async (username: string, password: string, phoneNumber: string, email?: string) => {
    try {
      setLoading(true);
      // 실제 이메일이 제공되지 않은 경우 기본 이메일 생성
      const userEmail = email || `${username}@example.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            username,
            phone_number: phoneNumber,
            original_password: password
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "회원가입 성공",
        description: "환영합니다!",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "회원가입 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "로그아웃 성공",
        description: "안녕히 가세요!",
      });
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        title: "로그아웃 실패",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      verifyPhoneNumber 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};