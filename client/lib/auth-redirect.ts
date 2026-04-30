const AUTH_REDIRECT_KEY = "stylesakhi_auth_redirect";
const AUTH_NOTICE_KEY = "stylesakhi_auth_notice";

const isSafePath = (path: string) => path.startsWith("/") && !path.startsWith("//");

export const getCurrentAuthRedirectPath = () => {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const rememberAuthRedirect = (message?: string, redirectPath = getCurrentAuthRedirectPath()) => {
  if (typeof window === "undefined") return;

  if (isSafePath(redirectPath) && redirectPath !== "/auth") {
    sessionStorage.setItem(AUTH_REDIRECT_KEY, redirectPath);
  }

  if (message) {
    sessionStorage.setItem(AUTH_NOTICE_KEY, message);
  }
};

export const consumeAuthRedirect = (fallback = "/") => {
  if (typeof window === "undefined") return fallback;

  const savedPath = sessionStorage.getItem(AUTH_REDIRECT_KEY);
  sessionStorage.removeItem(AUTH_REDIRECT_KEY);

  return savedPath && isSafePath(savedPath) ? savedPath : fallback;
};

export const consumeAuthNotice = () => {
  if (typeof window === "undefined") return "";

  const notice = sessionStorage.getItem(AUTH_NOTICE_KEY) || "";
  sessionStorage.removeItem(AUTH_NOTICE_KEY);
  return notice;
};
