
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { userRole, isAdmin } = useAuth();

  const isCreator = userRole === 'créateur';
  const isPrinter = userRole === 'imprimeur';
  const isSuperAdmin = isAdmin();

  const canAccessCreatorFeatures = isCreator || isSuperAdmin;
  const canAccessPrinterFeatures = isPrinter || isSuperAdmin;
  const canAccessAdminFeatures = isSuperAdmin;

  return {
    userRole,
    isCreator,
    isPrinter,
    isSuperAdmin,
    canAccessCreatorFeatures,
    canAccessPrinterFeatures,
    canAccessAdminFeatures
  };
};
