"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound,
  ArrowRight,
} from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // Get user ID from URL query parameter (from email link)
    const id = searchParams.get("id");
    if (id) {
      setUserId(id);
    } else {
      setError("User ID not found. Please use the link from your email.");
    }
  }, [searchParams]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    if (value.length <= 6) {
      setOtp(value);
    }
    setError("");
    setSuccess("");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID is required. Please use the link from your email.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/user/verifyEmail/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      setSuccess(data.message || "Email verified successfully!");
      setLoading(false);

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId) {
      setError("User ID is required. Please use the link from your email.");
      return;
    }

    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const response = await fetch("/api/user/verifyEmail/resendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        setResendLoading(false);
        return;
      }

      setSuccess(
        data.message || "OTP resent successfully. Please check your email.",
      );
      setResendLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <KeyRound
                size={28}
                className="text-blue-400 group-hover:scale-110 transition-transform"
              />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Verify Email
            </h1>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              We&apos;ve sent a verification code to your email. Enter it below
              to activate your account.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="text-sm font-medium text-gray-300 ml-1"
              >
                Security Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  required
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-center text-3xl tracking-[1em] font-mono group-focus-within:bg-white/10"
                  placeholder="------"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle
                  className="text-red-400 shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2
                  className="text-green-400 shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !userId || otp.length !== 6}
              className="w-full py-3.5 px-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Account
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Didn&apos;t receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || !userId}
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resendLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                  <span className="text-gray-300">Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} className="text-gray-400" />
                  <span className="text-gray-300">Resend Code</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/Login"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-block"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <Loader2 size={40} className="animate-spin text-blue-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
