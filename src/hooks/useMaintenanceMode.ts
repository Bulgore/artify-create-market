
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useMaintenanceMode = () => {
  const { isSuperAdmin } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = () => {
      try {
        const savedState = localStorage.getItem('maintenance_mode');
        const maintenanceActive = savedState === 'true';
        
        // Si c'est un super admin, on ne bloque jamais l'accès
        if (isSuperAdmin()) {
          setIsMaintenanceMode(false);
        } else {
          setIsMaintenanceMode(maintenanceActive);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du mode maintenance:', error);
        setIsMaintenanceMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, [isSuperAdmin]);

  return {
    isMaintenanceMode,
    isLoading
  };
};
