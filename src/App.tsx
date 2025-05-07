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
  
  // 로딩이 완료되었는데 사용자가 없으면 로그인 페이지로 리디렉션
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // 인증된 사용자면 보호된 컨텐츠 표시
  return <>{children}</>;
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
import SearchHome from "@/pages/search/SearchHome";

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

// AuthStateDebugger 컴포넌트 추가 (디버깅용, 프로덕션에서는 제거 가능)
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
            <Route path="/" element={<Onboarding1 />} />
            <Route path="/index" element={<Index />} />
            
            {/* 보호된 라우트 시작 */}
            <Route path="/main" element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            } />
            
            {/* Scripture routes */}
            <Route path="/scripture" element={
              <ProtectedRoute>
                <Scripture />
              </ProtectedRoute>
            } />
            <Route path="/scripture/:id" element={
              <ProtectedRoute>
                <ScriptureReader />
              </ProtectedRoute>
            } />
            <Route path="/scripture/calendar" element={
              <ProtectedRoute>
                <ScriptureCalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/scripture/bookmarks" element={
              <ProtectedRoute>
                <ScriptureBookmarkPage />
              </ProtectedRoute>
            } />
            
            {/* Wishlist routes */}
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            
            {/* Profile routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/manage" element={
              <ProtectedRoute>
                <ProfileManage />
              </ProtectedRoute>
            } />
            
            <Route path="/fortune" element={
              <ProtectedRoute>
                <Fortune />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Search Module Routes */}
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchHome />
              </ProtectedRoute>
            } />
            
            {/* Temple Search Routes */}
            <Route path="/search/temple/results" element={
              <ProtectedRoute>
                <TempleSearchResults />
              </ProtectedRoute>
            } />
            <Route path="/search/temple/detail/:id" element={
              <ProtectedRoute>
                <TempleDetail />
              </ProtectedRoute>
            } />
            <Route path="/search/temple" element={
              <ProtectedRoute>
                <FindTemple />
              </ProtectedRoute>
            } />
            
            {/* Temple Stay Search Routes */}
            <Route path="/search/temple-stay/results" element={
              <ProtectedRoute>
                <TempleStaySearchResults />
              </ProtectedRoute>
            } />
            <Route path="/search/temple-stay/detail/:id" element={
              <ProtectedRoute>
                <TempleStayDetail />
              </ProtectedRoute>
            } />
            <Route path="/search/temple-stay" element={
              <ProtectedRoute>
                <FindTempleStay />
              </ProtectedRoute>
            } />
            {/* 보호된 라우트 끝 */}
            
            {/* Legacy routes with redirects */}
            <Route path="/search-results" element={<Navigate to="/search/temple/results" />} />
            <Route path="/temple/:id" element={<Navigate to="/search/temple/detail/:id" replace />} />
            <Route path="/find-temple" element={<Navigate to="/search/temple" />} />
            <Route path="/temple-stay" element={<Navigate to="/search/temple-stay" />} />
            <Route path="/temple-stay/:id" element={<Navigate to="/search/temple-stay/detail/:id" replace />} />

            {/* Signup and Login - 로그인 관련 페이지는 보호하지 않음 */}
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