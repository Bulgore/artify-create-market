
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import CreatorOnboarding from '@/components/creator/onboarding/CreatorOnboarding';

const CreatorOnboardingPage = () => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const { isCreator } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Pas d'utilisateur connecté -> redirection vers auth
      if (!user) {
        navigate('/auth');
        return;
      }

      // ⚠️ CORRECTION DU BUG : Les admins/super admins ne doivent pas être sur cette page
      // Ils peuvent accéder directement à leur studio ou à l'admin
      const isAdminUser = isAdmin() || isSuperAdmin();
      if (isAdminUser) {
        // Rediriger les admins vers l'interface admin au lieu de l'onboarding
        navigate('/admin');
        return;
      }

      // Seuls les créateurs non-admins doivent pouvoir accéder à l'onboarding
      if (!isCreator) {
        navigate('/auth');
        return;
      }
    }
  }, [user, loading, isCreator, isAdmin, isSuperAdmin, navigate]);

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

  // Ne rien rendre si pas d'utilisateur ou si c'est un admin
  const isAdminUser = isAdmin() || isSuperAdmin();
  if (!user || !isCreator || isAdminUser) {
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
