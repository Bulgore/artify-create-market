
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { userRole, isAdmin } = useAuth();

  const isCreator = userRole === 'créateur';
  const isSuperAdmin = isAdmin();

  const canAccessCreatorFeatures = isCreator || isSuperAdmin;
  const canAccessAdminFeatures = isSuperAdmin;

  return {
    userRole,
    isCreator,
    isSuperAdmin,
    canAccessCreatorFeatures,
    canAccessAdminFeatures
  };
};
