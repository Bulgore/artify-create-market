import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Existing imports - correcting module names
import Home from '@/pages/Index';
import Studio from '@/pages/Studio';
import Admin from '@/pages/Admin';
import PrinterStudio from '@/pages/Studio'; // Using Studio as fallback

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
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/printer" element={<PrinterStudio />} />
              
              {/* New routes for creator profiles */}
              <Route path="/creators" element={<CreatorsPage />} />
              <Route path="/creator/:creatorId" element={<CreatorProfile />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
