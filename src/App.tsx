import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import AuthProvider after Router setup
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

// Protected Route Component - 로딩 상태 처리 추가
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // 로딩 중일 때는 로딩 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // 로그인하지 않은 경우에도 로그인 페이지로 리디렉션하지 않고 메인 페이지로 이동
  if (!user) {
    console.log("User not authenticated, redirecting to main");
    return <Navigate to="/main" replace />;
  }
  
  // 인증된 사용자면 보호된 컨텐츠 표시
  return <>{children}</>;
};

// 루트 경로를 처리하는 컴포넌트 수정
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  // 로딩 중일 때는 로딩 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // 로그인 여부와 상관없이 항상 /main으로 리다이렉트
  return <Navigate to="/main" replace />;
};

// Pages (기존 import 유지)
import Index from "@/pages/Index";
import Main from "@/pages/Main";
import Fortune from "@/pages/Fortune";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/NotFound";

// Scripture Pages
import Scripture from "@/pages/scripture";
import ScriptureReader from "@/pages/scripture/ScriptureReader";

// Profile Pages
import Profile from "@/pages/profile";
import ProfileManage from "@/pages/profile/ProfileManage";

// Wishlist Pages
import Wishlist from "@/pages/wishlist";

// Search Module
// import SearchHome from "@/pages/search/SearchHome";

// Temple Module
import FindTemple from './pages/search/temple/FindTemple';
import FindTempleStay from './pages/search/temple-stay/FindTempleStay';

// Temple Stay Module
import TempleSearchResults from "@/pages/search/temple/SearchResults";
import TempleDetail from "@/pages/search/temple/TempleDetail";
import TempleStaySearchResults from "@/pages/search/temple-stay/SearchResults";
import TempleStayDetail from "@/pages/search/temple-stay/TempleStayDetail";

// Login Module
import Onboarding1 from "./pages/login/Onboarding1";
import Onboarding2 from "./pages/login/Onboarding2";
import AuthChoice from "./pages/login/AuthChoice";
import Login from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";
import FindCredentialsChoice from "./pages/login/FindCredentialsChoice";
import FindId from "./pages/login/FindId";
import FindPassword from "./pages/login/FindPassword";
import ProfileSetup from "./pages/login/ProfileSetup";
import TermsAgreement from "./pages/login/TermsAgreement";

// Scripture Subpages
import ScriptureCalendarPage from "@/pages/scripture/ScriptureCalendarPage";
import ScriptureBookmarkPage from "@/pages/scripture/ScriptureBookmarkPage";

// AuthStateDebugger 컴포넌트 (디버깅용, 프로덕션에서는 제거 가능)
const AuthStateDebugger: React.FC = () => {
  const { user, loading } = useAuth();
  
  React.useEffect(() => {
    console.log("Auth State:", { user, loading, isAuthenticated: !!user });
  }, [user, loading]);
  
  return null; // UI에 아무것도 렌더링하지 않음
};

// Create a new QueryClient instance inside the component
const App: React.FC = () => {
  // Initialize QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          {/* 디버깅용 컴포넌트 (필요 시 활성화) */}
          <AuthStateDebugger />
          
          <Routes>
            {/* 루트 경로를 RootRedirect 컴포넌트로 처리 */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/index" element={<Index />} />
            
      
      
            {/* Main route - 로그인 없이도 접근 가능하도록 변경 */}
            <Route path="/main" element={<Main />} />
            
            {/* Scripture routes */}
            <Route path="/scripture" element={
                <Scripture />
            } />
            <Route path="/scripture/:id" element={
                <ScriptureReader />
            } />
            <Route path="/scripture/calendar" element={
                <ScriptureCalendarPage />
            } />
            <Route path="/scripture/bookmarks" element={
                <ScriptureBookmarkPage />
            } />
            
            {/* Wishlist routes */}
            <Route path="/wishlist" element={
                <Wishlist />
            } />
            
            {/* Profile routes */}
            <Route path="/profile" element={
                <Profile />
            } />
            <Route path="/profile/manage" element={
                <ProfileManage />
            } />
            
            <Route path="/fortune" element={
                <Fortune />
            } />
            <Route path="/notifications" element={
                <Notifications />
            } />
            
            {/* Search Module Routes */}
            <Route path="/search" element={<Navigate to="/search/temple" replace />} />
            
            {/* Temple Search Routes */}
            <Route path="/search/temple/results" element={<TempleSearchResults />} />
            <Route path="/search/temple/detail/:id" element={<TempleDetail />} />
            <Route path="/search/temple" element={<FindTemple />} />
            
            {/* Temple Stay Search Routes */}
            <Route path="/search/temple-stay/results" element={<TempleStaySearchResults />} />
            <Route path="/search/temple-stay/detail/:id" element={<TempleStayDetail />} />
            <Route path="/search/temple-stay" element={<FindTempleStay />} />
            {/* 보호된 라우트 끝 */}
            
            {/* Legacy routes with redirects */}
            <Route path="/search-results" element={<Navigate to="/search/temple/results" />} />
            <Route path="/temple/:id" element={<Navigate to="/search/temple/detail/:id" replace />} />
            <Route path="/find-temple" element={<Navigate to="/search/temple" />} />
            <Route path="/temple-stay" element={<Navigate to="/search/temple-stay" />} />
            <Route path="/temple-stay/:id" element={<Navigate to="/search/temple-stay/detail/:id" replace />} />

            {/* 온보딩 및 로그인 관련 페이지 - 메인으로 리디렉션하지 않고 실제 페이지 표시 */}
            <Route path="/onboarding1" element={<Onboarding1 />} />
            <Route path="/onboarding2" element={<Onboarding2 />} />
            <Route path="/auth-choice" element={<AuthChoice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/find-credentials-choice" element={<FindCredentialsChoice />} />
            <Route path="/find-id" element={<FindId />} />
            <Route path="/find-password" element={<FindPassword />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/terms-agreement" element={<TermsAgreement />} />
            <Route path="/home" element={<Index />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;