
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "@/context/AuthContext";

// Pages
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

// Create a new QueryClient instance inside the component
const App: React.FC = () => {
  // Initialize QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Onboarding1 />} />
            <Route path="/index" element={<Index />} />
            <Route path="/main" element={<Main />} />
            
            {/* Scripture routes */}
            <Route path="/scripture" element={<Scripture />} />
            <Route path="/scripture/:id" element={<ScriptureReader />} />
            <Route path="/scripture/calendar" element={<ScriptureCalendarPage />} />
            <Route path="/scripture/bookmarks" element={<ScriptureBookmarkPage />} />
            
            {/* Wishlist routes */}
            <Route path="/wishlist" element={<Wishlist />} />
            
            {/* Profile routes */}
            <Route path="/profile" element={<Profile />} />
            
            <Route path="/fortune" element={<Fortune />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Search Module Routes */}
            <Route path="/search" element={<SearchHome />} />
            
            {/* Temple Search Routes */}
            <Route path="/search/temple/results" element={<TempleSearchResults />} />
            <Route path="/search/temple/detail/:id" element={<TempleDetail />} />
            <Route path="/search/temple" element={<FindTemple />} />
            
            {/* Temple Stay Search Routes */}
            <Route path="/search/temple-stay/results" element={<TempleStaySearchResults />} />
            <Route path="/search/temple-stay/detail/:id" element={<TempleStayDetail />} />
            <Route path="/search/temple-stay" element={<FindTempleStay />} />
            
            {/* Legacy routes with redirects */}
            <Route path="/search-results" element={<Navigate to="/search/temple/results" />} />
            <Route path="/temple/:id" element={<Navigate to="/search/temple/detail/:id" replace />} />
            <Route path="/find-temple" element={<Navigate to="/search/temple" />} />
            <Route path="/temple-stay" element={<Navigate to="/search/temple-stay" />} />
            <Route path="/temple-stay/:id" element={<Navigate to="/search/temple-stay/detail/:id" replace />} />

            {/* Signup and Login */}
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
