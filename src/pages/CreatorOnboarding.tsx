
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import CreatorOnboarding from '@/components/creator/onboarding/CreatorOnboarding';

const CreatorOnboardingPage = () => {
  const { user, loading } = useAuth();
  const { isCreator } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isCreator)) {
      navigate('/auth');
    }
  }, [user, loading, isCreator, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !isCreator) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <CreatorOnboarding />
      </div>
    </div>
  );
};

export default CreatorOnboardingPage;
