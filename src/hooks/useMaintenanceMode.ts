
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useMaintenanceMode = () => {
  const { isSuperAdmin, userRole, loading } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = () => {
      try {
        // Attendre que l'authentification soit complètement chargée
        if (loading) {
          console.log('🔄 Auth still loading, waiting...');
          return;
        }

        const savedState = localStorage.getItem('maintenance_mode');
        const maintenanceActive = savedState === 'true';
        
        console.log('🔍 Checking maintenance mode:', { 
          maintenanceActive, 
          userRole, 
          isSuperAdminResult: isSuperAdmin() 
        });
        
        // Si c'est un super admin, on ne bloque jamais l'accès
        if (isSuperAdmin()) {
          console.log('✅ Super admin detected, bypassing maintenance mode');
          setIsMaintenanceMode(false);
        } else {
          console.log('👤 Regular user, applying maintenance mode:', maintenanceActive);
          setIsMaintenanceMode(maintenanceActive);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du mode maintenance:', error);
        setIsMaintenanceMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, [isSuperAdmin, userRole, loading]);

  return {
    isMaintenanceMode,
    isLoading
  };
};
