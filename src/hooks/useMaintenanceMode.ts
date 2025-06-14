
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateUserRole } from '@/utils/secureAuth';

export const useMaintenanceMode = () => {
  const { user, userRole, loading } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roleValidated, setRoleValidated] = useState(false);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        // Wait for auth to be fully loaded
        if (loading) {
          console.log('🔄 Auth still loading, waiting...');
          return;
        }

        setIsLoading(true);

        const savedState = localStorage.getItem('maintenance_mode');
        const maintenanceActive = savedState === 'true';
        
        console.log('🔍 Checking maintenance mode:', { 
          maintenanceActive, 
          userRole, 
          hasUser: !!user 
        });
        
        // If user is authenticated, validate their super admin status server-side
        if (user && userRole === 'superAdmin') {
          console.log('🔐 Validating super admin status server-side...');
          const isValidSuperAdmin = await validateUserRole('superAdmin');
          
          if (isValidSuperAdmin) {
            console.log('✅ Server-validated super admin, bypassing maintenance mode');
            setIsMaintenanceMode(false);
            setRoleValidated(true);
          } else {
            console.log('❌ Failed super admin validation, applying maintenance mode');
            setIsMaintenanceMode(maintenanceActive);
            setRoleValidated(false);
          }
        } else {
          console.log('👤 Regular user or not authenticated, applying maintenance mode:', maintenanceActive);
          setIsMaintenanceMode(maintenanceActive);
          setRoleValidated(false);
        }
      } catch (error) {
        console.error('❌ Error checking maintenance mode:', error);
        setIsMaintenanceMode(false);
        setRoleValidated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, [user, userRole, loading]);

  return {
    isMaintenanceMode,
    isLoading,
    roleValidated
  };
};
