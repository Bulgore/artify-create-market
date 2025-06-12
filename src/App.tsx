
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MaintenanceWrapper from "@/components/layout/MaintenanceWrapper";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Artists from "./pages/Artists";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Studio from "./pages/Studio";
import Printers from "./pages/Printers";
import ProductDetail from "./pages/ProductDetail";
import CreatorOnboardingPage from "./pages/CreatorOnboarding";
import BuilderPage from "./pages/BuilderPage";
import CustomPage from "./pages/CustomPage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MaintenanceWrapper>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/studio" element={<Studio />} />
                  <Route path="/printers" element={<Printers />} />
                  <Route path="/onboarding" element={<CreatorOnboardingPage />} />
                  <Route path="/builder" element={<BuilderPage />} />
                  <Route path="/page/:slug" element={<CustomPage />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MaintenanceWrapper>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
