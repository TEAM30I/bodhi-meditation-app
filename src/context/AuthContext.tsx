import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Assuming you have supabase configured
import { useToast } from '@/hooks/use-toast';
import { verifyCode, clearVerificationData } from '@/services/smsService';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyPhoneNumber: (code: string) => Promise<boolean>;
  resetPassword: (username: string) => Promise<void>;
  confirmResetPassword: (username: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
        } else if (data?.session) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Sign in function
  const signIn = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`, // Using username as email for simplicity
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      navigate('/dashboard'); // Navigate to dashboard after login
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign up function with phone verification
  const signUp = async (username: string, password: string, phone: string) => {
    try {
      // Supabase에 사용자 등록
      const { data, error } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password,
        options: {
          data: {
            username,
            phone,
          },
        },
      });
  
      if (error) {
        throw error;
      }
  
      // profiles 테이블에 추가 데이터 저장
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          username,
          phone,
        });
  
      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
  
      // 회원가입 후 자동 로그인
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`,
        password,
      });
  
      if (signInError) {
        throw signInError;
      }
  
      // 인증 데이터 초기화
      await clearVerificationData();
  
      // Main 화면으로 이동
      navigate('/main');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Verify phone number with code
  const verifyPhoneNumber = async (code: string): Promise<boolean> => {
    try {
      const isValid = await verifyCode(code);
      return isValid;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "로그아웃 실패",
        description: error.message || "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // Reset password function
  const resetPassword = async (username: string) => {
    try {
      // In a real app, you would use Supabase's password reset functionality
      // For demonstration purposes, we'll just simulate the process
      
      // const { error } = await supabase.auth.resetPasswordForEmail(`${username}@example.com`);
      // if (error) throw error;
      
      // For now, we'll just return success
      return;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Confirm password reset
  const confirmResetPassword = async (username: string, code: string, newPassword: string) => {
    try {
      // First verify the code
      const isValid = await verifyCode(code);
      
      if (!isValid) {
        throw new Error('Invalid verification code');
      }
      
      // In a real app, you would use Supabase's password reset functionality
      // For now, we'll simulate updating the password
      
      // Clear verification data after successful password reset
      await clearVerificationData();
      
      return;
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    verifyPhoneNumber,
    resetPassword,
    confirmResetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};