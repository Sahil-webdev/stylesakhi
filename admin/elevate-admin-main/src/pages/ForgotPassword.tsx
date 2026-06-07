import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import {
  requestAdminPasswordResetOtp,
  resetAdminPassword,
  verifyAdminPasswordResetOtp,
} from "@/lib/adminApi";

type ResetStep = 1 | 2 | 3;

const stepContent: Record<ResetStep, { title: string; description: string }> = {
  1: {
    title: "Reset Password",
    description: "Enter your admin email address to receive a one-time password.",
  },
  2: {
    title: "Verify OTP",
    description: "Enter the 6-digit OTP sent to your email address.",
  },
  3: {
    title: "Create New Password",
    description: "Set a new password for your admin account.",
  },
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<ResetStep>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const progressWidth = useMemo(() => {
    if (step === 1) return "w-1/3";
    if (step === 2) return "w-2/3";
    return "w-full";
  }, [step]);

  const currentCopy = stepContent[step];

  const handleSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await requestAdminPasswordResetOtp(email.trim());
      setStep(2);
      setSuccess("OTP sent successfully. Please check your email inbox.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const payload = await verifyAdminPasswordResetOtp(email.trim(), otp.trim());
      setResetToken(payload.data?.resetToken || "");
      setOtp("");
      setStep(3);
      setSuccess("OTP verified successfully. You can now create a new password.");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please complete both password fields.");
      return;
    }

    setLoading(true);
    try {
      await resetAdminPassword({
        email: email.trim(),
        resetToken,
        newPassword,
        confirmPassword,
      });
      navigate("/login?reset=success", { replace: true });
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#6d78e7_0%,#6b71e5_25%,#7d5fe0_100%)] text-[#202636] antialiased">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-lg rounded-[28px] bg-white px-6 py-8 shadow-[0_28px_80px_rgba(17,24,39,0.2)] sm:px-10 sm:py-10">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#efeaff] text-[#5a5fe8] shadow-[0_14px_34px_rgba(90,95,232,0.22)]">
              <LockKeyhole className="h-8 w-8" strokeWidth={2.1} />
            </div>
            <h1 className="text-[2.2rem] font-extrabold tracking-tight text-[#14213d]">{currentCopy.title}</h1>
            <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-[#62708a]">{currentCopy.description}</p>

            <div className="mt-7 w-full max-w-[220px]">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((lineStep) => (
                  <div
                    key={lineStep}
                    className={`h-1.5 rounded-full transition-all ${
                      lineStep <= step ? "bg-[#6678eb]" : "bg-[#d9dded]"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a84a0]">
                <span>Email</span>
                <span>OTP</span>
                <span>Password</span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            {success ? (
              <div className="mb-5 rounded-2xl border border-[#b8efc6] bg-[#e8fff0] px-4 py-3 text-sm font-medium text-[#1f7a38]">
                {success}
              </div>
            ) : null}
            {error ? (
              <div className="mb-5 rounded-2xl border border-[#ffd1d1] bg-[#fff4f4] px-4 py-3 text-sm font-medium text-[#c62828]">
                {error}
              </div>
            ) : null}

            {step === 1 ? (
              <form className="space-y-5" onSubmit={handleSendOtp}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#26324a]" htmlFor="forgot-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a92a8]" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your admin email"
                      className="h-14 w-full rounded-2xl border border-[#d7dced] bg-white pl-12 pr-4 text-base font-medium text-[#202636] outline-none transition-all focus:border-[#6678eb] focus:ring-4 focus:ring-[#6678eb]/15"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#6678eb] px-5 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(102,120,235,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#5668df] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending OTP..." : "Send OTP to Email"}
                </button>
              </form>
            ) : null}

            {step === 2 ? (
              <form className="space-y-5" onSubmit={handleVerifyOtp}>
                <div className="rounded-2xl border border-[#dbe1ff] bg-[#f7f8ff] px-4 py-3 text-sm font-medium text-[#4a5ba7]">
                  OTP sent to <span className="font-semibold text-[#202636]">{email}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#26324a]" htmlFor="forgot-otp">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a92a8]" />
                    <input
                      id="forgot-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="h-14 w-full rounded-2xl border border-[#d7dced] bg-white pl-12 pr-4 text-base font-medium tracking-[0.3em] text-[#202636] outline-none transition-all focus:border-[#6678eb] focus:ring-4 focus:ring-[#6678eb]/15"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full rounded-2xl border border-[#cdd4ea] px-5 py-4 text-base font-semibold text-[#556070] transition-colors hover:bg-[#f5f7fb]"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#6678eb] px-5 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(102,120,235,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#5668df] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            ) : null}

            {step === 3 ? (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#26324a]" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a92a8]" />
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Minimum 8 characters"
                      className="h-14 w-full rounded-2xl border border-[#d7dced] bg-white pl-12 pr-12 text-base font-medium text-[#202636] outline-none transition-all focus:border-[#6678eb] focus:ring-4 focus:ring-[#6678eb]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f7890] transition-colors hover:text-[#6678eb]"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#26324a]" htmlFor="confirm-new-password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a92a8]" />
                    <input
                      id="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter new password"
                      className="h-14 w-full rounded-2xl border border-[#d7dced] bg-white pl-12 pr-12 text-base font-medium text-[#202636] outline-none transition-all focus:border-[#6678eb] focus:ring-4 focus:ring-[#6678eb]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f7890] transition-colors hover:text-[#6678eb]"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#6678eb] px-5 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(102,120,235,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#5668df] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            ) : null}

            <Link
              to="/login"
              className="mt-6 block w-full rounded-2xl border border-[#cad2ea] px-5 py-4 text-center text-base font-semibold text-[#6678eb] transition-colors hover:bg-[#f6f8ff]"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
