export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'staff';

export type PermissionModule =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'analytics'
  | 'payments'
  | 'reviews'
  | 'team'
  | 'settings';

export interface AdminPermission {
  module: PermissionModule;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export const ADMIN_MODULES: PermissionModule[] = [
  'dashboard',
  'orders',
  'products',
  'customers',
  'analytics',
  'payments',
  'reviews',
  'team',
  'settings',
];

const makeAll = (enabled = true): AdminPermission[] =>
  ADMIN_MODULES.map((module) => ({
    module,
    can_view: enabled,
    can_create: enabled,
    can_edit: enabled,
    can_delete: enabled,
  }));

const makeNone = (): AdminPermission[] =>
  ADMIN_MODULES.map((module) => ({
    module,
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false,
  }));

export const getDefaultPermissionsByRole = (role: AdminRole): AdminPermission[] => {
  if (role === 'super_admin' || role === 'admin') return makeAll(true);

  if (role === 'manager') {
    return ADMIN_MODULES.map((module) => ({
      module,
      can_view: ['dashboard', 'orders', 'products', 'customers', 'analytics', 'reviews'].includes(module),
      can_create: ['orders', 'products', 'customers', 'reviews'].includes(module),
      can_edit: ['orders', 'products', 'customers', 'reviews'].includes(module),
      can_delete: ['products', 'reviews'].includes(module),
    }));
  }

  // staff
  return ADMIN_MODULES.map((module) => ({
    module,
    can_view: ['dashboard', 'orders', 'products', 'customers'].includes(module),
    can_create: false,
    can_edit: false,
    can_delete: false,
  }));
};

export const normalizePermissions = (
  _role: AdminRole,
  permissions?: Array<Partial<AdminPermission>>,
): AdminPermission[] => {
  if (!Array.isArray(permissions) || permissions.length === 0) return [];

  const fallback = makeNone();

  return ADMIN_MODULES.map((module) => {
    const source = permissions.find((p) => p.module === module);
    const defaultPerm = fallback.find((p) => p.module === module)!;

    return {
      module,
      can_view: typeof source?.can_view === 'boolean' ? source.can_view : defaultPerm.can_view,
      can_create: typeof source?.can_create === 'boolean' ? source.can_create : defaultPerm.can_create,
      can_edit: typeof source?.can_edit === 'boolean' ? source.can_edit : defaultPerm.can_edit,
      can_delete: typeof source?.can_delete === 'boolean' ? source.can_delete : defaultPerm.can_delete,
    };
  });
};

export const resolvePermissions = (
  role: AdminRole,
  permissions?: Array<Partial<AdminPermission>>,
): AdminPermission[] => {
  if (role === 'super_admin' || role === 'admin') {
    return makeAll(true);
  }

  const normalized = normalizePermissions(role, permissions);
  if (normalized.length > 0) {
    return normalized;
  }

  return getDefaultPermissionsByRole(role);
};
