
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import MaintenancePage from '@/components/MaintenancePage';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

const MaintenanceWrapper = ({ children }: MaintenanceWrapperProps) => {
  const { isMaintenanceMode, isLoading } = useMaintenanceMode();
  const location = useLocation();

  // Pages toujours accessibles même en mode maintenance
  const alwaysAccessiblePages = ['/auth'];
  const isAccessiblePage = alwaysAccessiblePages.includes(location.pathname);

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
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

export default MaintenanceWrapper;
