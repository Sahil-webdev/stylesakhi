import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { ADMIN_SESSION_KEY } from "@/lib/adminAuth";

export type PermissionModule =
  | "dashboard"
  | "orders"
  | "products"
  | "customers"
  | "analytics"
  | "payments"
  | "reviews"
  | "team"
  | "settings";

export type AdminPermission = {
  module: PermissionModule;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "manager" | "staff";
  permissions: AdminPermission[];
};

type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type LoginResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: AdminUser | null;
  token: string;
  session: { authenticatedAt: string; rememberMe: boolean } | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  hasModuleAccess: (module: PermissionModule, action?: "can_view" | "can_create" | "can_edit" | "can_delete") => boolean;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: "",
  session: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => ({ success: false, error: "Auth not initialized" }),
  signOut: async () => {},
  hasModuleAccess: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState("");
  const [session, setSession] = useState<{ authenticatedAt: string; rememberMe: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as {
          user?: AdminUser;
          token?: string;
          session?: { authenticatedAt: string; rememberMe: boolean };
        };

        if (!parsed?.user || !parsed?.session || !parsed?.token) return;

        setUser(parsed.user);
        setSession(parsed.session);
        setToken(parsed.token);

        const meResponse = await fetch(`${API_BASE_URL}/auth/admin/me`, {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
          },
        });

        const mePayload = await meResponse.json();
        if (!meResponse.ok || !mePayload?.success) {
          throw new Error(mePayload?.error || "Session expired");
        }

        const refreshedUser: AdminUser = {
          id: String(mePayload.data.id),
          email: String(mePayload.data.email),
          name: String(mePayload.data.name),
          role: mePayload.data.role,
          permissions: Array.isArray(mePayload.data.permissions) ? mePayload.data.permissions : [],
        };

        setUser(refreshedUser);
        localStorage.setItem(
          ADMIN_SESSION_KEY,
          JSON.stringify({
            user: refreshedUser,
            token: parsed.token,
            session: parsed.session,
          }),
        );
      } catch {
        setUser(null);
        setToken("");
        setSession(null);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const signIn = async ({ email, password, rememberMe = false }: LoginPayload): Promise<LoginResult> => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return { success: false, error: "Email and password are required" };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        return { success: false, error: payload?.error || "Invalid email or password" };
      }

      const nextUser: AdminUser = {
        id: String(payload.data.user.id),
        email: String(payload.data.user.email),
        name: String(payload.data.user.name),
        role: payload.data.user.role,
        permissions: Array.isArray(payload.data.user.permissions) ? payload.data.user.permissions : [],
      };

      const nextToken = String(payload.data.token || "");
      const nextSession = {
        authenticatedAt: new Date().toISOString(),
        rememberMe,
      };

      setUser(nextUser);
      setToken(nextToken);
      setSession(nextSession);

      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({
          user: nextUser,
          token: nextToken,
          session: nextSession,
        }),
      );

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Login failed" };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken("");
    setSession(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const hasModuleAccess = (
    module: PermissionModule,
    action: "can_view" | "can_create" | "can_edit" | "can_delete" = "can_view",
  ) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    const permission = user.permissions.find((perm) => perm.module === module);
    return Boolean(permission?.[action]);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      session,
      loading,
      isAuthenticated: !!user && !!token,
      signIn,
      signOut,
      hasModuleAccess,
    }),
    [user, token, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
