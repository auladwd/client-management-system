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
  Plus,
  FileCode2,
  Edit3,
  Database,
  Flame,
  Cloud,
  Mail,
  Lock,
  Globe2,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import ClientModal from "@/components/ClientModal";
import VaultModal from "@/components/VaultModal";
import {
  DecryptedCredentials,
  generateEnvContent,
  downloadEnvFile,
  copyEnvToClipboard,
} from "@/lib/env-helper";

interface VaultItem {
  _id: string;
  clientId: string;
  clientName: string;
  dedicatedEmail: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  decrypted?: DecryptedCredentials;
}

export default function VaultPage() {
  const [vaults, setVaults] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [revealedAll, setRevealedAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [selectedEditVault, setSelectedEditVault] = useState<{
    clientId: string;
    clientName: string;
  } | null>(null);

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

  async function handleCopyEntireEnv(vault: VaultItem) {
    const creds = vault.decrypted || {};
    const content = generateEnvContent(vault.clientName, vault.dedicatedEmail, creds);
    const ok = await copyEnvToClipboard(content);
    if (ok) {
      setCopiedKey(`all-env-${vault._id}`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  }

  function handleDownloadEnv(vault: VaultItem, filename: string = ".env.local") {
    const creds = vault.decrypted || {};
    const content = generateEnvContent(vault.clientName, vault.dedicatedEmail, creds);
    downloadEnvFile(content, filename);
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
            এনক্রিপ্টেড ক্রেডেনশিয়াল ও সিকিউর ভল্ট সেন্টার
          </h1>
          <p className="text-xs text-slate-400">
            MongoDB Atlas, Firebase, Cloudinary, Gmail ও প্রয়োজনীয় সকল প্রযুক্তির ক্রেডেনশিয়াল সংরক্ষণ ও সরাসরি .env ফাইল ডাউনলোড
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setRevealedAll(!revealedAll)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            {revealedAll ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-slate-400" />}
            <span>{revealedAll ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}</span>
          </button>

          <button
            type="button"
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
            কোনো পাসওয়ার্ড বা ডাটাবেজ স্ট্রিং প্লেইন-টেক্সট আকারে থাকে না। আপনি এক ক্লিকেই যেকোনো ক্লায়েন্টের সম্পূর্ণ <code className="text-emerald-300">.env.local</code> অথবা <code className="text-emerald-300">.env</code> ফাইল ডাউনলোড করে যেকোনো Next.js, React, Node.js বা Vite অ্যাপে সরাসরি ড্রপ করে ব্যবহার করতে পারবেন।
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
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-300">কোনো ভল্ট রেকর্ড পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">নতুন ক্লায়েন্ট যোগ করলেই স্বয়ংক্রিয়ভাবে ভল্ট তৈরি হবে।</p>
          <button
            type="button"
            onClick={() => setNewClientModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            <span>প্রথম ক্লায়েন্ট ও ভল্ট তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVaults.map((v) => {
            const d = v.decrypted || {};
            const isCopiedAll = copiedKey === `all-env-${v._id}`;

            return (
              <div
                key={v._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl space-y-4 shadow-lg hover:border-slate-700/80 transition"
              >
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{v.clientName}</span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        AES-256 Vault
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      সার্ভিস ইমেইল: <span className="font-mono text-slate-200">{v.dedicatedEmail}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Edit Vault Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEditVault({
                          clientId: v.clientId,
                          clientName: v.clientName,
                        })
                      }
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                      title="ক্রেডেনশিয়াল এডিট ও নতুন কী যুক্ত করুন"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-sky-400" />
                      <span>ভল্ট এডিট</span>
                    </button>

                    {/* Copy All .env */}
                    <button
                      type="button"
                      onClick={() => handleCopyEntireEnv(v)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      title="সম্পূর্ণ .env ফাইল কপি করুন"
                    >
                      {isCopiedAll ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopiedAll ? "কপি হয়েছে!" : ".env কপি"}</span>
                    </button>

                    {/* Download .env.local */}
                    <button
                      type="button"
                      onClick={() => handleDownloadEnv(v, ".env.local")}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:opacity-90 transition active:scale-95 shrink-0"
                      title="সরাসরি .env.local ফাইল ডাউনলোড করুন"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>.env.local ডাউনলোড</span>
                    </button>

                    {/* Download .env */}
                    <button
                      type="button"
                      onClick={() => handleDownloadEnv(v, ".env")}
                      className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                      title=".env ফাইল ডাউনলোড করুন"
                    >
                      <FileCode2 className="h-3.5 w-3.5" />
                      <span>.env</span>
                    </button>
                  </div>
                </div>

                {/* Service Configuration Tags */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.mongodbUri
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Database className="h-3 w-3" />
                    <span>MongoDB Atlas {d.mongodbUri ? "✓" : "—"}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.firebaseApiKey
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Flame className="h-3 w-3" />
                    <span>Firebase Auth {d.firebaseApiKey ? "✓" : "—"}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.cloudinaryApiKey
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Cloud className="h-3 w-3" />
                    <span>Cloudinary CDN {d.cloudinaryApiKey ? "✓" : "—"}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.gmailPassword
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Mail className="h-3 w-3" />
                    <span>Gmail App Key {d.gmailPassword ? "✓" : "—"}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.nextauthSecret
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Lock className="h-3 w-3" />
                    <span>NextAuth Secret {d.nextauthSecret ? "✓" : "—"}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${
                      d.vercelProjectId
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Globe2 className="h-3 w-3" />
                    <span>Vercel {d.vercelProjectId ? "✓" : "—"}</span>
                  </span>

                  {d.smsApiKey && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      <MessageSquare className="h-3 w-3" />
                      <span>SMS Gateway ✓</span>
                    </span>
                  )}

                  {d.paymentMerchantId && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border bg-rose-500/10 text-rose-400 border-rose-500/30">
                      <CreditCard className="h-3 w-3" />
                      <span>Payment Gateway ✓</span>
                    </span>
                  )}
                </div>

                {/* Grid of Key Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* Dedicated Gmail */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                    <p className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-purple-400" />
                      <span>Google / Gmail Service</span>
                    </p>
                    <div>
                      <span className="text-[10px] text-slate-400">Password / App Key:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{revealedAll ? d.gmailPassword || "Not set" : "••••••••••••"}</span>
                        <button
                          type="button"
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
                    <p className="font-semibold text-emerald-400 text-[11px] flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5" />
                      <span>MongoDB Atlas Connection</span>
                    </p>
                    <div>
                      <span className="text-[10px] text-slate-400">URI:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span className="truncate max-w-[180px]">
                          {revealedAll ? d.mongodbUri || "Not set" : "mongodb+srv://••••••••"}
                        </span>
                        <button
                          type="button"
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
                    <p className="font-semibold text-amber-400 text-[11px] flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5" />
                      <span>Firebase Auth & Storage</span>
                    </p>
                    <div>
                      <span className="text-[10px] text-slate-400">Project ID / API Key:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span className="truncate max-w-[180px]">
                          {d.firebaseProjectId || "None"}
                        </span>
                        <button
                          type="button"
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
                    <p className="font-semibold text-sky-400 text-[11px] flex items-center gap-1.5">
                      <Cloud className="h-3.5 w-3.5" />
                      <span>Cloudinary Storage</span>
                    </p>
                    <div>
                      <span className="text-[10px] text-slate-400">Cloud Name / Key:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{d.cloudinaryCloudName || "None"}</span>
                        <button
                          type="button"
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
                    <p className="font-semibold text-purple-400 text-[11px] flex items-center gap-1.5">
                      <Globe2 className="h-3.5 w-3.5" />
                      <span>Vercel Deployment</span>
                    </p>
                    <div>
                      <span className="text-[10px] text-slate-400">Project ID / Token:</span>
                      <div className="flex items-center justify-between mt-0.5 font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <span>{d.vercelProjectId || "None"}</span>
                        <button
                          type="button"
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
                    <p className="font-semibold text-slate-400 text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>রিকভারি ব্যাকআপ</span>
                    </p>
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

      {/* New Client & Vault Modal */}
      <ClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSuccess={fetchVaults}
      />

      {/* Edit Vault Modal */}
      {selectedEditVault && (
        <VaultModal
          clientId={selectedEditVault.clientId}
          clientName={selectedEditVault.clientName}
          isOpen={!!selectedEditVault}
          onClose={() => {
            setSelectedEditVault(null);
            fetchVaults();
          }}
        />
      )}
    </div>
  );
}
