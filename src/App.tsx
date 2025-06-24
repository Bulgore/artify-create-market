
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Page imports
import Home from '@/pages/Index';
import Studio from '@/pages/Studio';
import Admin from '@/pages/Admin';
import Auth from '@/pages/Auth';
import BuilderPage from '@/pages/BuilderPage';

// New imports for creator profiles
import CreatorProfile from '@/pages/CreatorProfile';
import CreatorsPage from '@/pages/CreatorsPage';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import CustomPage from '@/pages/CustomPage';
import Artists from '@/pages/Artists';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Legal from '@/pages/Legal';
import FAQ from '@/pages/FAQ';
import NotFound from '@/pages/NotFound';
import Layout from '@/components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/builder/:contentPath" element={<BuilderPage />} />
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auth" element={<Auth />} />
                <Route path="studio" element={<Studio />} />
                <Route path="printer" element={<Studio />} />
                <Route path="products" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="creators" element={<CreatorsPage />} />
                <Route path="creator/:creatorId" element={<CreatorProfile />} />
                <Route path="artists" element={<Artists />} />
                <Route path="page/:slug" element={<CustomPage />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="legal" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
