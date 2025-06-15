
-- Promote user to super admin and set role to 'admin'
UPDATE public.users
SET
  is_super_admin = true,
  role = 'admin'
WHERE id = '360bcff2-fa75-4fac-87fa-0be5d7c3184c';
