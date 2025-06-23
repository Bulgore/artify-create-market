
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

// New imports for creator profiles
import CreatorProfile from '@/pages/CreatorProfile';
import CreatorsPage from '@/pages/CreatorsPage';

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
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/printer" element={<Studio />} />
                
                {/* New routes for creator profiles */}
                <Route path="/creators" element={<CreatorsPage />} />
                <Route path="/creator/:creatorId" element={<CreatorProfile />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
