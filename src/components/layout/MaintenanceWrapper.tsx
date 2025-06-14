
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import { useAuth } from '@/contexts/AuthContext';
import MaintenancePage from '@/components/MaintenancePage';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

const MaintenanceWrapper = ({ children }: MaintenanceWrapperProps) => {
  const { isMaintenanceMode, isLoading } = useMaintenanceMode();
  const { isSuperAdmin } = useAuth();
  const location = useLocation();

  // Pages toujours accessibles même en mode maintenance
  const alwaysAccessiblePages = ['/auth'];
  
  // Ajouter /admin pour les super admins
  const adminPages = ['/admin'];
  const isAccessiblePage = alwaysAccessiblePages.includes(location.pathname) ||
    (isSuperAdmin() && adminPages.some(page => location.pathname.startsWith(page)));

  console.log('🔍 MaintenanceWrapper check:', {
    isMaintenanceMode,
    currentPath: location.pathname,
    isAccessiblePage,
    isSuperAdmin: isSuperAdmin()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si le mode maintenance est activé ET que la page n'est pas dans la liste des pages accessibles
  if (isMaintenanceMode && !isAccessiblePage) {
    console.log('🚫 Blocking access due to maintenance mode');
    return <MaintenancePage />;
  }

  console.log('✅ Allowing access to page');
  return <>{children}</>;
};

export default MaintenanceWrapper;
