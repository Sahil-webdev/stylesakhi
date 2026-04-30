export const ADMIN_SESSION_KEY = "stylesakhi_admin_auth";

export const getAdminSession = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAdminToken = () => {
  const session = getAdminSession();
  return typeof session?.token === "string" ? session.token : "";
};

export const getAdminAuthHeaders = (base: HeadersInit = {}) => {
  const token = getAdminToken();
  if (!token) return base;
  return {
    ...base,
    Authorization: `Bearer ${token}`,
  };
};
