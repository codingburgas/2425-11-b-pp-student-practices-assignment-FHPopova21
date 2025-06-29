import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";
import Measurements from "./pages/Measurements";
import Recommendation from "./pages/Recommendation";
import ClothingListing from "./pages/ClothingListing";
import NotFound from "./pages/NotFound";
import SellerListings from "./pages/SellerListings";
import SellerDashboard from "./pages/SellerDashboard";
import MerchantProfile from "./pages/MerchantProfile";
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-white to-beige-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/clothing" element={<ClothingListing />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/listings" element={<SellerListings />} />
            <Route path="/seller/profile" element={<MerchantProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
