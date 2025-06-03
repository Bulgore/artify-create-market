
export const createRoleCheckers = (userRole: string | null) => ({
  isAdmin: () => userRole === 'admin' || userRole === 'superAdmin',
  isSuperAdmin: () => userRole === 'superAdmin',
  isImprimeur: () => userRole === 'imprimeur',
  isCreateur: () => userRole === 'créateur'
});
