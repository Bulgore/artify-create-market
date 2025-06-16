
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import CreatorWorkspace from '@/components/creator/CreatorWorkspace';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Studio = () => {
  const { userRole, isCreator, isSuperAdmin, canAccessCreatorFeatures } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers l'accueil si l'utilisateur n'a pas accès aux fonctionnalités créateur
    if (!canAccessCreatorFeatures) {
      navigate('/');
    }
  }, [canAccessCreatorFeatures, navigate]);

  // Afficher un message de chargement ou rien si l'utilisateur n'a pas accès
  if (!canAccessCreatorFeatures) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder au studio créateur.</p>
        </div>
      </div>
    );
  }

  return <CreatorWorkspace />;
};

export default Studio;
