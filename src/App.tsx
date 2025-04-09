
// Import React components after ensuring polyfills are in place
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { initializeAmplify } from "./utils/amplify-helpers";

// Auth Routes
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

// Initialize Amplify before creating the React app
// Force polyfill re-initialization
if (typeof window !== 'undefined' && window.global === undefined) {
  // @ts-ignore - force global
  window.global = window;
  // @ts-ignore - force global
  global = window;
}

const amplifyInitialized = initializeAmplify();
console.log("Amplify initialization status:", amplifyInitialized ? "success" : "failed");

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding1 />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
