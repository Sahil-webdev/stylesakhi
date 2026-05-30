import { useQuery } from "@tanstack/react-query";
import { getAdminToken } from "@/lib/adminAuth";

export type AppRole = "super_admin" | "admin" | "manager" | "staff";

export interface TeamMember {
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  last_login: string | null;
  role: AppRole;
  created_at: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface ActivityEntry {
  id: string;
  action: string;
  created_at: string;
  module?: string;
  actor_name?: string;
  actor_email?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const MODULES = ["dashboard", "orders", "products", "customers", "analytics", "payments", "reviews", "team", "settings"];

const DEFAULT_PERMISSIONS: Record<AppRole, Permission[]> = {
  super_admin: MODULES.map((m) => ({ module: m, can_view: true, can_create: true, can_edit: true, can_delete: true })),
  admin: MODULES.map((m) => ({ module: m, can_view: true, can_create: true, can_edit: true, can_delete: true })),
  manager: MODULES.map((m) => ({
    module: m,
    can_view: ["dashboard", "orders", "products", "customers", "analytics", "reviews"].includes(m),
    can_create: ["orders", "products", "customers", "reviews"].includes(m),
    can_edit: ["orders", "products", "customers", "reviews"].includes(m),
    can_delete: ["products", "reviews"].includes(m),
  })),
  staff: MODULES.map((m) => ({ module: m, can_view: ["dashboard", "orders", "products", "customers"].includes(m), can_create: false, can_edit: false, can_delete: false })),
};

export const getDefaultPermissions = (role: AppRole) => DEFAULT_PERMISSIONS[role];
export const ALL_MODULES = MODULES;

const authHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useCurrentUserRole = () => {
  return useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => "super_admin" as AppRole,
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/team`, {
        headers: {
          ...authHeaders(),
        },
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to fetch team members");
      }
      return (payload?.data?.items || []) as TeamMember[];
    },
  });
};

export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/team`, {
        headers: {
          ...authHeaders(),
        },
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to fetch permissions");
      }
      const users = (payload?.data?.items || []) as TeamMember[];
      const found = users.find((u) => u.user_id === userId);
      return found?.permissions || [];
    },
    enabled: !!userId,
  });
};

export const useActivityLog = () => {
  return useQuery({
    queryKey: ["activityLog"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/activity-log?limit=40`, {
        headers: {
          ...authHeaders(),
        },
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to fetch activity log");
      }
      return (payload?.data || []) as ActivityEntry[];
    },
  });
};

export const removeTeamMember = async (userId: string) => {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE_URL}/admin/team/${userId}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const payload = await res.json();
  if (!res.ok || !payload?.success) {
    throw new Error(payload?.error || "Failed to remove team member");
  }
  return payload?.data;
};
