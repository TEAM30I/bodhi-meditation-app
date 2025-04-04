import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from 'aws-amplify/auth';

// AWS Amplify getCurrentUser 반환 타입 정의
interface AmplifyUser {
  username: string;
  userId?: string;
  signInDetails?: {
    loginId?: string;
  };
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, refreshUser } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 최대 2초 후에는 강제로 로딩 완료 처리
    const timeout = setTimeout(() => {
      console.log('ProtectedRoute: 타임아웃으로 로딩 강제 종료');
      setLocalLoading(false);
      setAuthChecked(true);
    }, 2000);

    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: 인증 상태 확인 중');
        // 직접 인증 상태 확인
        const userData = await getCurrentUser() as AmplifyUser;
        console.log('ProtectedRoute: 인증된 사용자 확인됨', userData);
        setIsAuth(true);
        
        // AuthContext 상태 업데이트
        await refreshUser();
      } catch (error) {
        console.log('ProtectedRoute: 인증되지 않은 사용자', error);
        setIsAuth(false);
      } finally {
        setAuthChecked(true);
        setLocalLoading(false);
        clearTimeout(timeout); // 정상 완료시 타임아웃 제거
      }
    };

    checkAuth();

    return () => clearTimeout(timeout); // 컴포넌트 언마운트시 타임아웃 제거
  }, [refreshUser]);

  // 컴포넌트 내부 로딩 상태와 Context의 로딩 상태 모두 고려
  const finalLoading = localLoading || (isLoading && !authChecked);

  // 로딩 중이면서 로딩 시간이 짧을 경우 스피너 표시
  if (finalLoading && authChecked === false) {
    console.log('ProtectedRoute: 로딩 중 스피너 표시');
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bodhi-orange"></div>
      </div>
    );
  }

  // 인증 여부 결정 (직접 체크 결과와 Context 결과 모두 고려)
  const finalIsAuthenticated = isAuth || isAuthenticated;

  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
  if (!finalIsAuthenticated) {
    console.log('ProtectedRoute: 인증되지 않음, 로그인 페이지로 리디렉션');
    return <Navigate to="/login" replace />;
  }

  // 인증된 사용자는 요청한 페이지로 접근 허용
  console.log('ProtectedRoute: 인증됨, 페이지 접근 허용');
  return <>{children}</>;
};

export default ProtectedRoute;