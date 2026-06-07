export const ADMIN_API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

export type AdminSetupStatus = {
  setupRequired: boolean;
  hasSuperAdmin: boolean;
};

export async function fetchAdminSetupStatus(): Promise<AdminSetupStatus> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/auth/admin/setup-status`, {
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || "Failed to fetch admin setup status");
  }

  return {
    setupRequired: Boolean(payload.data?.setupRequired),
    hasSuperAdmin: Boolean(payload.data?.hasSuperAdmin),
  };
}

async function parseApiPayload(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || "Request failed");
  }
  return payload;
}

export async function requestAdminPasswordResetOtp(email: string) {
  const response = await fetch(`${ADMIN_API_BASE_URL}/auth/admin/forgot-password/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return parseApiPayload(response);
}

export async function verifyAdminPasswordResetOtp(email: string, otp: string) {
  const response = await fetch(`${ADMIN_API_BASE_URL}/auth/admin/forgot-password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  return parseApiPayload(response);
}

export async function resetAdminPassword(params: {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${ADMIN_API_BASE_URL}/auth/admin/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  return parseApiPayload(response);
}
