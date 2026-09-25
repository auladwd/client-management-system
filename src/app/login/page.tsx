"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    loginWithGoogle,
    loginWithEmail,
    isConfigured,
    authError,
    clearAuthError,
  } = useAuth();

  const [email, setEmail] = useState("auladinfo@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect to dashboard inside useEffect
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  function translateFirebaseError(err: any): string {
    const msg = err?.message || String(err);
    const code = err?.code || "";

    if (code === "auth/invalid-email") return "ইমেইল অ্যাড্রেসটি সঠিক নয়।";
    if (code === "auth/user-not-found") return "এই ইমেইলে কোনো ইউজার পাওয়া যায়নি।";
    if (code === "auth/wrong-password" || code === "auth/invalid-credential")
      return "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
    if (code === "auth/popup-closed-by-user") return "Google সাইন-ইন উইন্ডোটি বন্ধ করে দেওয়া হয়েছে।";
    if (code === "auth/operation-not-allowed")
      return "Firebase কনসোলে Email/Password অথবা Google Sign-In চালু করা নেই।";
    if (code === "auth/api-key-not-valid" || msg.includes("api-key-not-valid"))
      return ".env.local ফাইলে ভ্যালিড Firebase API Key দেওয়া হয়নি। অনুগ্রহ করে আপনার Firebase Project থেকে সঠিক API Key দিন।";
    return msg || "অথেনটিকেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    clearAuthError();
    setSuccessMsg(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (err: any) {
      setError(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    clearAuthError();
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card Box */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 mb-4">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              Aulad IT Solution
              <span className="inline-flex items-center rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-400 ring-1 ring-inset ring-sky-500/20">
                Portal
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              সিকিউর ক্লায়েন্ট ও বিজনেস ম্যানেজমেন্ট সিস্টেম
            </p>
          </div>

          {/* Config Status Pill */}
          {!isConfigured ? (
            <div className="mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs text-amber-300">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">Firebase API Credentials পেন্ডিং</p>
                  <p className="text-amber-300/80 leading-relaxed text-[11px]">
                    <code className="text-white bg-slate-950/60 px-1 py-0.5 rounded">.env.local</code> ফাইলে আপনার আসল Firebase credentials কনফিগার করুন।
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Firebase Authentication Active</span>
            </div>
          )}

          {/* Error & Success Alerts */}
          {(error || authError) && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{error || authError}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:border-slate-600 transition disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google দিয়ে সাইন-ইন করুন</span>
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400">অথবা ইমেইল দিয়ে</span>
            </div>
          </div>

          {/* Email Password Login Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ইমেইল অ্যাড্রেস
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-purple-500 transition disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer Note */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
          <span>Protected by Firebase Auth & AES-256 GCM Security</span>
        </div>
      </div>
    </div>
  );
}
