"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Lock,
  Cloud,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Globe2,
  Activity,
  RefreshCw,
  Sparkles,
  AlertCircle,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminPermissionsCard from "@/components/AdminPermissionsCard";

interface DbStatus {
  success: boolean;
  status: string;
  latencyMs?: number;
  database?: string;
  ping?: string;
  collections?: {
    clients: number;
    credentialVaults: number;
    payments: number;
    representatives: number;
    maintenanceLogs: number;
    broadcasts: number;
  };
  error?: string;
}

export default function SettingsPage() {
  const { user, isConfigured, logout } = useAuth();
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    checkDbStatus();
  }, []);

  async function checkDbStatus() {
    setTestingDb(true);
    try {
      const res = await fetch("/api/system");
      const json = await res.json();
      setDbStatus(json);
    } catch (e) {
      setDbStatus({
        success: false,
        status: "error",
        error: e instanceof Error ? e.message : "Failed to fetch status",
      });
    } finally {
      setTestingDb(false);
    }
  }

  async function handleSeed() {
    if (
      !confirm(
        "আপনি কি MongoDB Atlas এ প্রাথমিক ডেমো রেকর্ডগুলো (ক্লায়েন্ট, পেমেন্ট, প্রতিনিধি ও ভল্ট) লোড করতে চান?"
      )
    ) {
      return;
    }

    setSeedingDb(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const json = await res.json();
      if (json.success) {
        setSeedMessage("প্রাথমিক ডেটা সফলভাবে MongoDB Atlas এ যুক্ত হয়েছে!");
        await checkDbStatus();
      } else {
        setSeedMessage(json.error || "ডেটা লোড করতে সমস্যা হয়েছে");
      }
    } catch (e) {
      setSeedMessage("সার্ভারে সংযোগে সমস্যা হয়েছে");
    } finally {
      setSeedingDb(false);
    }
  }

  const envTemplate = `# ===============================================
# Aulad IT Solution - Business Management Portal
# System Environment Configuration (.env.local)
# ===============================================

# 1. MongoDB Atlas (Your Production Cluster)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/aulad_it_management?retryWrites=true&w=majority"

# 2. Vault Security (32+ Character Secret Key for AES-256-GCM)
ENCRYPTION_SECRET="aulad-it-solution-ultra-secure-vault-key-32-chars!!"

# 3. Firebase Authentication (Admin Google Login)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="aulad-it-solution.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="aulad-it-solution"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="aulad-it-solution.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef"

# 4. Cloudinary (NID & Media Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 5. WhatsApp API Gateway (Optional for Automated Webhook)
WHATSAPP_API_TOKEN="optional_token"
`;

  function handleCopy() {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-sky-400" />
          সিস্টেম সেটিংস ও সার্ভিস কনফিগারেশন
        </h1>
        <p className="text-xs text-slate-400">
          MongoDB Atlas, Firebase, Cloudinary এবং AES-256 সিকিউরিটি কনফিগারেশন ও লাইভ ডাটাবেজ ডায়াগনস্টিক
        </p>
      </div>

      {/* Live MongoDB Atlas Diagnostic Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>MongoDB Atlas লাইভ কানেকশন স্ট্যাটাস</span>
                {dbStatus?.status === "connected" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    সক্রিয় ও সংযুক্ত
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                    চেক করা হচ্ছে...
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                ক্লাউড ডাটাবেজ: <span className="font-mono text-slate-300">{dbStatus?.database || "aulad_it_management"}</span>
                {dbStatus?.latencyMs !== undefined && (
                  <span className="ml-2 font-mono text-emerald-400">| লেটেন্সি: {dbStatus.latencyMs}ms</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={checkDbStatus}
              disabled={testingDb}
              className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${testingDb ? "animate-spin" : ""}`} />
              <span>{testingDb ? "যাচাই হচ্ছে..." : "পুনরায় টেস্ট করুন"}</span>
            </button>

            <button
              onClick={handleSeed}
              disabled={seedingDb}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{seedingDb ? "সিড হচ্ছে..." : "প্রাথমিক ডেটা লোড করুন"}</span>
            </button>
          </div>
        </div>

        {seedMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{seedMessage}</span>
          </div>
        )}

        {/* Collections Overview */}
        {dbStatus?.collections && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">ক্লায়েন্ট রেকর্ড</p>
              <p className="text-base font-bold text-white mt-0.5">{dbStatus.collections.clients}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">পেমেন্ট ও ইনভয়েস</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{dbStatus.collections.payments}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">প্রতিনিধি</p>
              <p className="text-base font-bold text-purple-400 mt-0.5">{dbStatus.collections.representatives}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">ক্রেডেনশিয়াল ভল্ট</p>
              <p className="text-base font-bold text-sky-400 mt-0.5">{dbStatus.collections.credentialVaults}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">মেইনটেন্যান্স লগ</p>
              <p className="text-base font-bold text-amber-400 mt-0.5">{dbStatus.collections.maintenanceLogs}</p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5 text-center">
              <p className="text-[10px] text-slate-400">ব্রডকাস্ট নোটিশ</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">{dbStatus.collections.broadcasts}</p>
            </div>
          </div>
        )}
      </div>

      {/* Firebase Authentication Live Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Firebase Authentication স্ট্যাটাস</span>
                {isConfigured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SDK সক্রিয়
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                    ডেমো / কী সেটআপ আবশ্যক
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Google Sign-In এবং Email/Password ভিত্তিক সিকিউর অ্যাডমিন অথেনটিকেশন
              </p>
            </div>
          </div>

          {user && (
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition active:scale-95 shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>লগআউট করুন</span>
            </button>
          )}
        </div>

        {/* User details & Auth mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-400">বর্তমান লগইনকৃত ইউজার</p>
            <p className="text-xs font-semibold text-white mt-1 truncate">
              {user?.displayName || "লগইন নেই"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || "—"}</p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-400">অথেনটিকেশন মোড</p>
            <p className="text-xs font-semibold text-sky-400 mt-1">
              {user?.isDemo ? "টেস্ট / ডেমো অ্যাডমিন" : "Firebase লাইভ সেশন"}
            </p>
            <p className="text-[11px] text-slate-400">
              {user?.isDemo ? "লোকাল সেশন" : `UID: ${user?.uid.substring(0, 12)}...`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-400">প্রোটেকশন স্ট্যাটাস</p>
            <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>রুট গার্ড সক্রিয়</span>
            </p>
            <p className="text-[11px] text-slate-400">লগইন ছাড়া অন্য কোনো পেজ এক্সেসিবল নয়</p>
          </div>
        </div>
      </div>

      {/* Admin Permissions & Allowed Emails Management */}
      <AdminPermissionsCard />

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">ডাটাবেজ ইঞ্জিন</span>
            <Database className="h-4 w-4 text-sky-400" />
          </div>
          <p className="text-xs text-slate-400">
            MongoDB Atlas + Mongoose ODM
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            সক্রিয় ও প্রস্তুত
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">সিকিউরিটি ভল্ট</span>
            <Lock className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400">Node.js AES-256-GCM এনক্রিপশন</p>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            এনক্রিপশন সক্রিয়
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">হোস্টিং ও আর্কিটেকচার</span>
            <Globe2 className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-xs text-slate-400">Vercel Edge & Serverless</p>
          <div className="inline-flex items-center gap-1 text-[11px] text-purple-400">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
            Next.js App Router
          </div>
        </div>
      </div>

      {/* Step by Step Configuration Guide */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 backdrop-blur-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              প্রোডাকশন এনভায়রনমেন্ট ভ্যারিয়েবল (.env.local) রেফারেন্স
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রজেক্ট রুটে <code className="text-sky-300">.env.local</code> ফাইলে আপনার আসল কী-গুলো কনফিগার করা আছে
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 px-3.5 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition shrink-0"
          >
            {copiedEnv ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedEnv ? "কপি হয়েছে!" : "টেমপ্লেট কপি করুন"}</span>
          </button>
        </div>

        {/* Code View */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>{envTemplate}</pre>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sky-400">🍃 MongoDB Atlas কানেকশন:</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              MongoDB Atlas এ <code className="text-slate-300">aulad_it_management</code> ক্লাস্টারে প্রতিটি ক্লায়েন্ট, এনক্রিপ্টেড ক্রেডেনশিয়াল, ইনভয়েস এবং টিকিট সরাসরি সিঙ্ক হয়।
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400">🔐 ক্রেডেনশিয়াল ভল্ট নিরাপত্তা:</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ক্লায়েন্টদের জিমেইল ও ডাটাবেজ পাসওয়ার্ড সুরক্ষার জন্য <code className="text-slate-300">ENCRYPTION_SECRET</code> হিসেবে ৩২ অক্ষরের একটি গোপন চাবি ব্যবহার করা হচ্ছে, যা AES-256-GCM মোডে সম্পূর্ণ সুরক্ষিত।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
