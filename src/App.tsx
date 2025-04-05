
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Nearby from "./pages/Nearby";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import TempleStay from "./pages/TempleStay";
import Fortune from "./pages/Fortune";
import Scripture from "./pages/Scripture";
import ScriptureReading from "./pages/ScriptureReading";
import FindTemple from "./pages/FindTemple";
import SearchResults from "./pages/SearchResults";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/temple-stay" element={<TempleStay />} />
          <Route path="/fortune" element={<Fortune />} />
          <Route path="/scripture" element={<Scripture />} />
          <Route path="/scripture/:id" element={<ScriptureReading />} />
          <Route path="/find-temple" element={<FindTemple />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Default route redirects to welcome page */}
          <Route path="/index" element={<Navigate to="/" replace />} />
          
          {/* Catch-all route for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
