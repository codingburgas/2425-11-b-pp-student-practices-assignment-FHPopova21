
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import Measurements from "./pages/Measurements";
import Recommendation from "./pages/Recommendation";
import ClothingListing from "./pages/ClothingListing";
import MerchantListings from "./pages/MerchantListings";
import NotFound from "./pages/NotFound";

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
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/clothing" element={<ClothingListing />} />
            <Route path="/merchant" element={<div className="p-6 text-center">Merchant Dashboard - Coming Soon</div>} />
            <Route path="/merchant/listings" element={<MerchantListings />} />
            <Route path="/admin" element={<div className="p-6 text-center">Admin Dashboard - Coming Soon</div>} />
            <Route path="/profile" element={<div className="p-6 text-center">Profile Page - Coming Soon</div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
