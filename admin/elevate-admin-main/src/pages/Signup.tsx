import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Phone, ShieldCheck, UserRound } from "lucide-react";
import { fetchAdminSetupStatus, ADMIN_API_BASE_URL } from "@/lib/adminApi";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSetupStatus = async () => {
      try {
        const status = await fetchAdminSetupStatus();
        if (!active) return;
        setSetupRequired(status.setupRequired);
      } catch {
        if (!active) return;
        setError("Unable to fetch admin setup status. Please check the backend and try again.");
      } finally {
        if (active) setCheckingSetup(false);
      }
    };

    void loadSetupStatus();
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/auth/admin/setup-super-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        setError(payload?.error || payload?.errors?.confirmPassword || "Unable to create the super admin account.");
        return;
      }

      navigate("/login?setup=success", { replace: true });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (!checkingSetup && !setupRequired) {
    return <Navigate to="/login" replace />;
  }

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
          <div className="rounded-lg border border-[#d9dde2] bg-white p-5 shadow-[0_22px_60px_rgba(43,52,55,0.14)] sm:p-7">
            <div className="mb-7 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e2dfff] text-[#4d44e3] shadow-[0_10px_30px_rgba(77,68,227,0.18)]">
                <ShieldCheck className="h-7 w-7" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4d44e3]">One-Time Super Admin Setup</span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#2b3437]">Create Super Admin</h1>
              <p className="mt-2 text-sm font-medium text-[#586064]">
                Complete the one-time setup to create the first super admin account.
              </p>
            </div>

            {checkingSetup ? (
              <div className="rounded-2xl border border-[#d9dde2] bg-[#f7f8fd] px-4 py-10 text-center text-sm font-medium text-[#586064]">
                Checking setup status...
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="floating-label-input relative">
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder=" "
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pt-5 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                    />
                    <label className="pointer-events-none absolute left-4 top-4 flex origin-left items-center gap-2 text-[#586064] transition-all" htmlFor="name">
                      <UserRound className="h-4 w-4" />
                      Full Name
                    </label>
                  </div>

                  <div className="floating-label-input relative">
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder=" "
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pt-5 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                    />
                    <label className="pointer-events-none absolute left-4 top-4 origin-left text-[#586064] transition-all" htmlFor="email">
                      Email Address
                    </label>
                  </div>

                  <div className="floating-label-input relative">
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder=" "
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pt-5 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                    />
                    <label className="pointer-events-none absolute left-4 top-4 flex origin-left items-center gap-2 text-[#586064] transition-all" htmlFor="phone">
                      <Phone className="h-4 w-4" />
                      Mobile Number
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
                        className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pr-12 pt-5 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
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

                  <div className="floating-label-input relative">
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder=" "
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full rounded-lg border border-[#ccd2d8] bg-[#f7f8fa] px-4 pb-2 pr-12 pt-5 text-sm font-medium text-[#2b3437] outline-none transition-all focus:border-[#4d44e3] focus:bg-white focus:ring-4 focus:ring-[#4d44e3]/15"
                      />
                      <label className="pointer-events-none absolute left-4 top-4 origin-left text-[#586064] transition-all" htmlFor="confirm-password">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#586064] transition-colors hover:text-[#4d44e3]"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dbe2ff] bg-[#f6f7ff] px-4 py-3 text-sm text-[#586064]">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#4d44e3]" />
                    <p>This account will be stored as the only <span className="font-semibold text-[#2b3437]">super admin</span> and these credentials will be used for future logins.</p>
                  </div>
                </div>

                {error ? <p className="rounded-md bg-[#fff1f1] px-3 py-2 text-sm font-medium text-[#c62828]">{error}</p> : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-to-br from-[#4d44e3] to-[#4034d7] py-3 text-sm font-bold uppercase tracking-wide text-[#faf6ff] shadow-[0_12px_28px_rgba(77,68,227,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(77,68,227,0.36)] active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating Super Admin..." : "Create Super Admin"}
                </button>

                <div className="text-center text-sm font-medium text-[#586064]">
                  Setup already done?{" "}
                  <Link to="/login" className="font-semibold text-[#4d44e3] hover:underline">
                    Go to Login
                  </Link>
                </div>
              </form>
            )}
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

export default SignupPage;
