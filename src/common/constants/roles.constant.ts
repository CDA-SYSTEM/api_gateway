export const Roles = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERARIO: 'operario',
  INSPECTOR: 'inspector',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
