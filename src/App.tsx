import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "@/pages/Index";
import Main from "@/pages/Main";
import Scripture from "@/pages/Scripture";
import ScriptureReading from "@/pages/ScriptureReading";
import Fortune from "@/pages/Fortune";
import Nearby from "@/pages/Nearby";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Welcome from "@/pages/Welcome";
import NotFound from "@/pages/NotFound";

// Search Module
import SearchHome from "@/pages/search/SearchHome";
import SearchResults from "@/pages/search/SearchResults";
import TempleDetail from "@/pages/temple/TempleDetail";
import FindTemple from "@/pages/FindTemple";
import TempleStay from "@/pages/TempleStay";

// Login Module
import Onboarding1 from "@/pages/login/Onboarding1";
import Onboarding2 from "@/pages/login/Onboarding2";
import AuthSelection from "@/pages/login/AuthSelection";
import Signup from "@/pages/login/Signup";
import Login from "@/pages/login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login/onboarding1" />} />
        <Route path="/index" element={<Index />} />
        <Route path="/main" element={<Main />} />
        <Route path="/scripture" element={<Scripture />} />
        <Route path="/scripture/:id" element={<ScriptureReading />} />
        <Route path="/fortune" element={<Fortune />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Search Module Routes */}
        <Route path="/search" element={<SearchHome />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/temple/:id" element={<TempleDetail />} />
        <Route path="/find-temple" element={<FindTemple />} />
        <Route path="/temple-stay" element={<TempleStay />} />

        {/* Signup and Login */}
        <Route path="/login/onboarding1" element={<Onboarding1 />} />
        <Route path="/login/onboarding2" element={<Onboarding2 />} />
        <Route path="/login/auth" element={<AuthSelection />} />
        <Route path="/login/signup" element={<Signup />} />
        <Route path="/login/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
