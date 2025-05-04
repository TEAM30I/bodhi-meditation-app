import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { verifyCode } from '@/services/smsService'; // smsService에서 verifyCode 함수 가져오기

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, phoneNumber: string, email?: string) => Promise<void>; // 매개변수 수정
  signOut: () => Promise<void>;
  verifyPhoneNumber: (code: string) => Promise<boolean>; // 함수 추가
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // 초기 세션 설정
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // AuthContext.tsx의 signIn 함수 수정
  const signIn = async (username: string, password: string) => {
    try {
      // username을 이메일 형식으로 변환 (회원가입 시와 동일한 방식)
      const email = username.includes('@') ? username : `${username}@example.com`;
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "아이디와 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 이 함수를 추가: verifyPhoneNumber
  const verifyPhoneNumber = async (code: string): Promise<boolean> => {
    try {
      // smsService의 verifyCode 함수 호출
      return await verifyCode(code);
    } catch (error) {
      console.error('Phone verification error:', error);
      return false;
    }
  };

  // signUp 함수 수정: username, password, phoneNumber와 선택적 email을 받도록 변경
  // signUp 함수 수정
  const signUp = async (username: string, password: string, phoneNumber: string, email?: string) => {
    try {
      // 실제 이메일이 제공되지 않은 경우 기본 이메일 생성
      const userEmail = email || `${username}@example.com`;
      
      // Supabase signUp에 data 옵션 추가하여 추가 정보 저장
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
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "로그아웃 성공",
        description: "안녕히 가세요!",
      });
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, verifyPhoneNumber }}>
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