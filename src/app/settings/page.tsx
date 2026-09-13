"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function SettingsPage() {
  const [copiedEnv, setCopiedEnv] = useState(false);

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
          MongoDB Atlas, Firebase, Cloudinary এবং AES-256 সিকিউরিটি কনফিগারেশন গাইড
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">ডাটাবেজ ইঞ্জিন</span>
            <Database className="h-4 w-4 text-sky-400" />
          </div>
          <p className="text-xs text-slate-400">
            MongoDB Atlas + In-Memory Fallback
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
            <span className="text-xs font-semibold text-slate-300">হোস্টিং ও ডেপ্লয়মেন্ট</span>
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
              প্রোডাকশন এনভায়রনমেন্ট ভ্যারিয়েবল (.env.local) সেটআপ
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রজেক্ট রুটে <code>.env.local</code> ফাইলে আপনার আসল কী-গুলো বসিয়ে সেভ করুন
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
              MongoDB Atlas এ লগইন করে একটি ফ্রি ক্লাস্টার তৈরি করুন। তারপর &quot;Connect&quot; $\rightarrow$ &quot;Drivers&quot; এ গিয়ে কানেকশন স্ট্রিংটি কপি করে <code>MONGODB_URI</code> তে পেস্ট করুন। সাথে সাথে আপনার ডেটা সরাসরি Atlas ক্লাউডে জমা হতে শুরু করবে।
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400">🔐 ক্রেডেনশিয়াল ভল্ট নিরাপত্তা:</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ক্লায়েন্টদের জিমেইল ও ডাটাবেজ পাসওয়ার্ড সুরক্ষার জন্য <code>ENCRYPTION_SECRET</code> হিসেবে ৩২ অক্ষরের একটি গোপন চাবি দিন। এটি AES-256 এলগরিদমে আপনার সমস্ত পাসওয়ার্ড এনক্রিপ্ট রাখবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
