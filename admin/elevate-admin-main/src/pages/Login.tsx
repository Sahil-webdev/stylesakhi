import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { fetchAdminSetupStatus } from "@/lib/adminApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  const setupSuccessMessage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("setup") === "success";
  }, [location.search]);

  const passwordResetSuccessMessage = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("reset") === "success";
  }, [location.search]);

  useEffect(() => {
    let active = true;

    const loadSetupStatus = async () => {
      try {
        const status = await fetchAdminSetupStatus();
        if (!active) return;
        setSetupRequired(status.setupRequired);
      } catch {
        if (!active) return;
        setSetupRequired(false);
      } finally {
        if (active) setSetupLoading(false);
      }
    };

    void loadSetupStatus();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (setupSuccessMessage) {
      setInfoMessage("Super admin created successfully. You can now sign in with these credentials.");
      return;
    }
    if (passwordResetSuccessMessage) {
      setInfoMessage("Password reset successful. Please sign in with your new password.");
      return;
    }
    setInfoMessage("");
  }, [passwordResetSuccessMessage, setupSuccessMessage]);

  if (!setupLoading && setupRequired && !setupSuccessMessage) {
    return <Navigate to="/signup" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setInfoMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const result = await signIn({ email, password, rememberMe });
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid credentials");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="login-page flex min-h-screen flex-col bg-[#f8f9fa] text-[#2b3437] antialiased">
      <style>{`
        .login-page {
          background-image:
            linear-gradient(135deg, rgba(77, 68, 227, 0.1), transparent 38%),
            linear-gradient(180deg, #ffffff 0%, #f8f9fa 48%, #eef1f4 100%);
        }
        .floating-label-input:focus-within label,
        .floating-label-input input:not(:placeholder-shown) + label {
          transform: translateY(-1.5rem) scale(0.85);
          color: #4d44e3;
        }
      `}</style>

      <main className="flex flex-grow items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-[#d9dde2] bg-white p-6 shadow-[0_22px_60px_rgba(43,52,55,0.14)] sm:p-8">
            <div className="mb-7 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e2dfff] text-[#4d44e3] shadow-[0_10px_30px_rgba(77,68,227,0.18)]">
                <LockKeyhole className="h-7 w-7" strokeWidth={2.2} />
              </div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4d44e3]">Secure Admin Access</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#2b3437]">Admin Login</h1>
              <p className="mt-2 text-sm font-medium text-[#586064]">Sign in to access the dashboard</p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="floating-label-input relative">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pt-6 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                />
                <label className="pointer-events-none absolute left-4 top-4 origin-left text-[#586064] transition-all" htmlFor="email">
                  Email Address
                </label>
              </div>

              <div className="floating-label-input relative">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder=" "
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pr-12 pt-6 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                  />
                  <label className="pointer-events-none absolute left-4 top-4 origin-left text-[#586064] transition-all" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#586064] transition-colors hover:text-[#4d44e3]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border border-[#b8c0c8] accent-[#4d44e3] focus:ring-2 focus:ring-[#4d44e3]/20"
                  />
                  <span className="font-medium text-[#586064] transition-colors group-hover:text-[#2b3437]">Remember Me</span>
                </label>
                <Link to="/forgot-password" className="font-semibold text-[#4d44e3] transition-all hover:underline hover:underline-offset-4">
                  Forgot Password?
                </Link>
              </div>

              {infoMessage ? <p className="rounded-md bg-[#edf8ef] px-3 py-2 text-sm font-medium text-[#237b35]">{infoMessage}</p> : null}
              {error ? <p className="rounded-md bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#c62828]">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-br from-[#4d44e3] to-[#4034d7] py-3.5 text-sm font-bold uppercase tracking-wide text-[#faf6ff] shadow-[0_12px_28px_rgba(77,68,227,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(77,68,227,0.36)] active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8389]">
            Copyright 2024 Ethereal Boutique Admin. All rights reserved.
          </p>
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-[#e1e5e9] bg-white/80 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-10 text-sm font-['Inter'] md:flex-row">
          <div className="text-[#586064]">Copyright 2024 Ethereal Boutique Admin. All rights reserved.</div>
          <div className="flex gap-8">
            <button type="button" className="text-[#586064] transition-colors hover:text-[#2b3437]">
              Privacy Policy
            </button>
            <button type="button" className="text-[#586064] transition-colors hover:text-[#2b3437]">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
