
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "@/pages/Index";
import Main from "@/pages/Main";
import Fortune from "@/pages/Fortune";
import Nearby from "@/pages/Nearby";
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
import FindTemple from "@/pages/search/temple/FindTemple";
import TempleSearchResults from "@/pages/search/temple/SearchResults";
import TempleDetail from "@/pages/search/temple/TempleDetail";

// Temple Stay Module
import FindTempleStay from "@/pages/search/temple-stay/FindTempleStay";
import TempleStaySearchResults from "@/pages/search/temple-stay/SearchResults";
import TempleStayDetail from "@/pages/search/temple-stay/TempleDetail";

// Login Module
import Onboarding1 from "@/pages/login/Onboarding1";
import Onboarding2 from "@/pages/login/Onboarding2";
import AuthSelection from "@/pages/login/AuthSelection";
import Signup from "@/pages/login/Signup";
import Login from "@/pages/login/Login";
import FindAccount from "@/pages/login/FindAccount";
import ResetPassword from "@/pages/login/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login/onboarding1" />} />
        <Route path="/index" element={<Index />} />
        <Route path="/main" element={<Main />} />
        
        {/* Scripture routes */}
        <Route path="/scripture" element={<Scripture />} />
        <Route path="/scripture/:id" element={<ScriptureReader />} />
        
        {/* Wishlist routes */}
        <Route path="/wishlist" element={<Wishlist />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/fortune" element={<Fortune />} />
        <Route path="/nearby" element={<Nearby />} />
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
        <Route path="/login/onboarding1" element={<Onboarding1 />} />
        <Route path="/login/onboarding2" element={<Onboarding2 />} />
        <Route path="/login/auth" element={<AuthSelection />} />
        <Route path="/login/signup" element={<Signup />} />
        <Route path="/login/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login/signup" />} />
        
        {/* Account Recovery */}
        <Route path="/login/find-account" element={<FindAccount />} />
        <Route path="/login/reset-password" element={<ResetPassword />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
