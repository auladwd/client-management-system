"use client";

import { useState, useEffect } from "react";
import {
  KeyRound,
  ShieldCheck,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ExternalLink,
  Plus,
} from "lucide-react";
import ClientModal from "@/components/ClientModal";

interface VaultItem {
  _id: string;
  clientId: string;
  clientName: string;
  dedicatedEmail: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  decrypted?: {
    gmailPassword?: string;
    mongodbUri?: string;
    mongodbUser?: string;
    mongodbPassword?: string;
    firebaseProjectId?: string;
    firebaseApiKey?: string;
    firebaseAuthDomain?: string;
    cloudinaryCloudName?: string;
    cloudinaryApiKey?: string;
    cloudinaryApiSecret?: string;
    vercelProjectId?: string;
    vercelToken?: string;
    notes?: string;
  };
}

export default function VaultPage() {
  const [vaults, setVaults] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [revealedAll, setRevealedAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);

  useEffect(() => {
    fetchVaults();
  }, []);

  async function fetchVaults() {
    setLoading(true);
    try {
      const res = await fetch("/api/vault?decrypt=true");
      const json = await res.json();
      if (json.success) {
        setVaults(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, id: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function downloadEnv(vault: VaultItem) {
    const d = vault.decrypted || {};
    const content = `# ===============================================
# Aulad IT Solution - Auto Generated .env.local
# Client: ${vault.clientName}
# Dedicated Gmail: ${vault.dedicatedEmail}
# ===============================================

MONGODB_URI="${d.mongodbUri || ""}"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="${d.firebaseProjectId || ""}"
NEXT_PUBLIC_FIREBASE_API_KEY="${d.firebaseApiKey || ""}"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${d.firebaseAuthDomain || (d.firebaseProjectId ? `${d.firebaseProjectId}.firebaseapp.com` : "")}"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${d.cloudinaryCloudName || ""}"
CLOUDINARY_API_KEY="${d.cloudinaryApiKey || ""}"
CLOUDINARY_API_SECRET="${d.cloudinaryApiSecret || ""}"

VERCEL_PROJECT_ID="${d.vercelProjectId || ""}"
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `.env.local`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredVaults = vaults.filter(
    (v) =>
      v.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.dedicatedEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Security Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-emerald-400" />
            এনক্রিপ্টেড ক্রেডেনশিয়াল ও সিকিউর ভল্ট
          </h1>
          <p className="text-xs text-slate-400">
            প্রতিটি অ্যাপের জিমেইল, MongoDB Atlas, Firebase, Cloudinary ও Vercel পাসওয়ার্ড ও কি নিরাপদে সংরক্ষণ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setRevealedAll(!revealedAll)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            {revealedAll ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{revealedAll ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}</span>
          </button>

          <button
            onClick={() => setNewClientModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>নতুন ক্লায়েন্ট ও ভল্ট যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Security Alert Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-300">
            সম্পূর্ণ মিলিটারি-গ্রেড AES-256-GCM এনক্রিপশন সক্রিয় রয়েছে
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            কোনো পাসওয়ার্ড বা কানেকশন স্ট্রিং সাধারণ টেক্সট আকারে ডেটাবেজে সংরক্ষিত হয় না। যে কোনো সময় এক ক্লিকে যেকোনো ক্লায়েন্ট অ্যাপের জন্য সম্পূর্ণ <code>.env.local</code> ফাইল ডাউনলোড করে সরাসরি প্রজেক্টে ব্যবহার করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="প্রতিষ্ঠান বা ডেডিকেটেড ইমেইল দিয়ে সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Vault Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">ভল্ট রেকর্ড লোড হচ্ছে...</div>
      ) : filteredVaults.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">কোনো ভল্ট রেকর্ড পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">নতুন ক্লায়েন্ট যোগ করলেই স্বয়ংক্রিয়ভাবে ভল্ট তৈরি হবে।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVaults.map((v) => {
            const d = v.decrypted || {};
            return (
              <div
                key={v._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl space-y-4 shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {v.clientName}
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        AES-256 Vault
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ডেডিকেটেড ইমেইল: <span className="font-mono text-slate-200">{v.dedicatedEmail}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => downloadEnv(v)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>১-ক্লিকে .env.local ডাউনলোড</span>
                  </button>
                </div>

                {/* Grid of Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* Dedicated Gmail */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-slate-300 text-[11px]">📧 Google / Gmail Account</p>
                    <div>
                      <span className="text-[10px] text-slate-400">Password / App Key:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{revealedAll ? d.gmailPassword || "Not set" : "••••••••••••"}</span>
                        <button
                          onClick={() => handleCopy(d.gmailPassword || "", `${v._id}-gmail`)}
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          {copiedKey === `${v._id}-gmail` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MongoDB Atlas */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-emerald-400 text-[11px]">🍃 MongoDB Connection String</p>
                    <div>
                      <span className="text-[10px] text-slate-400">URI:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span className="truncate max-w-[180px]">
                          {revealedAll ? d.mongodbUri || "Not set" : "mongodb+srv://••••••••"}
                        </span>
                        <button
                          onClick={() => handleCopy(d.mongodbUri || "", `${v._id}-mongo`)}
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          {copiedKey === `${v._id}-mongo` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Firebase */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-amber-400 text-[11px]">🔥 Firebase Auth Config</p>
                    <div>
                      <span className="text-[10px] text-slate-400">Project ID / API Key:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span className="truncate max-w-[180px]">
                          {d.firebaseProjectId || "None"}
                        </span>
                        <button
                          onClick={() => handleCopy(d.firebaseApiKey || "", `${v._id}-fb`)}
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          {copiedKey === `${v._id}-fb` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cloudinary */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-sky-400 text-[11px]">☁️ Cloudinary Storage</p>
                    <div>
                      <span className="text-[10px] text-slate-400">Cloud Name:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{d.cloudinaryCloudName || "None"}</span>
                        <button
                          onClick={() => handleCopy(d.cloudinaryApiKey || "", `${v._id}-cld`)}
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          {copiedKey === `${v._id}-cld` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vercel */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-purple-400 text-[11px]">▲ Vercel Project Info</p>
                    <div>
                      <span className="text-[10px] text-slate-400">Project ID / Token:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{d.vercelProjectId || "None"}</span>
                        <button
                          onClick={() => handleCopy(d.vercelProjectId || "", `${v._id}-vcl`)}
                          className="text-slate-400 hover:text-white ml-2"
                        >
                          {copiedKey === `${v._id}-vcl` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recovery */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-slate-400 text-[11px]">🛡️ রিকভারি তথ্য</p>
                    <p className="text-[11px] text-slate-300">
                      ইমেইল: {v.recoveryEmail || "aulad.recovery@gmail.com"}
                    </p>
                    <p className="text-[11px] text-slate-300">
                      ফোন: {v.recoveryPhone || "01700000000"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Client & Vault Modal */}
      <ClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSuccess={fetchVaults}
      />
    </div>
  );
}
