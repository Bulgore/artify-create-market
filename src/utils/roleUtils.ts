
export const createRoleCheckers = (userRole: string | null) => ({
  isAdmin: () => userRole === 'admin' || userRole === 'superAdmin',
  isSuperAdmin: () => userRole === 'superAdmin',
  isCreateur: () => userRole === 'créateur'
});
