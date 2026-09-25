"use client";

import { useState, useEffect } from "react";
import {
  X,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  ShieldAlert,
  Save,
} from "lucide-react";

interface VaultModalProps {
  clientId: string | null;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface VaultData {
  _id?: string;
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

export default function VaultModal({ clientId, clientName, isOpen, onClose }: VaultModalProps) {
  const [vault, setVault] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Editable fields
  const [dedicatedEmail, setDedicatedEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [mongodbUri, setMongodbUri] = useState("");
  const [firebaseProjectId, setFirebaseProjectId] = useState("");
  const [firebaseApiKey, setFirebaseApiKey] = useState("");
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState("");
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState("");
  const [cloudinaryApiSecret, setCloudinaryApiSecret] = useState("");
  const [vercelProjectId, setVercelProjectId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && clientId) {
      fetchVault();
    }
  }, [isOpen, clientId]);

  async function fetchVault() {
    setLoading(true);
    try {
      const res = await fetch(`/api/vault?clientId=${clientId}&decrypt=true`);
      const json = await res.json();
      if (json.success && json.data) {
        setVault(json.data);
        setDedicatedEmail(json.data.dedicatedEmail || "");
        setRecoveryEmail(json.data.recoveryEmail || "");
        setRecoveryPhone(json.data.recoveryPhone || "");
        const d = json.data.decrypted || {};
        setGmailPassword(d.gmailPassword || "");
        setMongodbUri(d.mongodbUri || "");
        setFirebaseProjectId(d.firebaseProjectId || "");
        setFirebaseApiKey(d.firebaseApiKey || "");
        setCloudinaryCloudName(d.cloudinaryCloudName || "");
        setCloudinaryApiKey(d.cloudinaryApiKey || "");
        setCloudinaryApiSecret(d.cloudinaryApiSecret || "");
        setVercelProjectId(d.vercelProjectId || "");
        setNotes(d.notes || "");
      } else {
        setVault(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(value: string, fieldName: string) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function downloadEnvFile() {
    const content = `# ===============================================
# Aulad IT Solution - Auto Generated .env.local
# Client: ${clientName}
# Generated At: ${new Date().toLocaleString()}
# ===============================================

# --- MongoDB Atlas ---
MONGODB_URI="${mongodbUri}"

# --- Firebase Authentication ---
NEXT_PUBLIC_FIREBASE_PROJECT_ID="${firebaseProjectId}"
NEXT_PUBLIC_FIREBASE_API_KEY="${firebaseApiKey}"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${firebaseProjectId}.firebaseapp.com"

# --- Cloudinary Media Upload ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${cloudinaryCloudName}"
CLOUDINARY_API_KEY="${cloudinaryApiKey}"
CLOUDINARY_API_SECRET="${cloudinaryApiSecret}"

# --- Vercel Deployment ---
VERCEL_PROJECT_ID="${vercelProjectId}"

# --- Dedicated Client Email & Notes ---
# Email: ${dedicatedEmail}
# Password/AppKey: ${gmailPassword}
# Notes: ${notes}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `.env.local`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleSave() {
    if (!clientId) return;
    setSaving(true);
    try {
      const payload = {
        clientId,
        clientName,
        dedicatedEmail,
        recoveryEmail,
        recoveryPhone,
        credentials: {
          gmailPassword,
          mongodbUri,
          firebaseProjectId,
          firebaseApiKey,
          cloudinaryCloudName,
          cloudinaryApiKey,
          cloudinaryApiSecret,
          vercelProjectId,
          notes,
        },
      };

      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        fetchVault();
        alert("ক্রেডেনশিয়াল সফলভাবে AES-256 এনক্রিপ্ট হয়ে সংরক্ষিত হয়েছে!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {clientName} - সিকিউর ভল্ট
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                AES-256-GCM এনক্রিপ্টেড ডাটাবেজ স্টোরেজ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed(!revealed)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{revealed ? "পাসওয়ার্ড লুকান (Mask)" : "পাসওয়ার্ড প্রকাশ করুন (Reveal)"}</span>
            </button>
          </div>

          <button
            onClick={downloadEnvFile}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>১-ক্লিকে .env.local ডাউনলোড</span>
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            এনক্রিপ্টেড ভল্ট লোড হচ্ছে...
          </div>
        ) : (
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            {/* Dedicated Gmail & Recovery */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-3">
              <h4 className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                <span>📧 ডেডিকেটেড গুগল/জিমেইল অ্যাকাউন্ট</span>
                <span className="text-[10px] text-slate-400">এই মেইল দিয়ে সকল সার্ভিস খোলা</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400">জিমেইল এড্রেস</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="text"
                      value={dedicatedEmail}
                      onChange={(e) => setDedicatedEmail(e.target.value)}
                      className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(dedicatedEmail, "email")}
                      className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                    >
                      {copiedField === "email" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">পাসওয়ার্ড / App Password</label>
                  <div className="flex items-center mt-1">
                    <input
                      type={revealed ? "text" : "password"}
                      value={gmailPassword}
                      onChange={(e) => setGmailPassword(e.target.value)}
                      className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(gmailPassword, "gmailPass")}
                      className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                    >
                      {copiedField === "gmailPass" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                <div>
                  <label className="text-[10px] text-slate-400">রিকভারি ইমেইল</label>
                  <input
                    type="text"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="aulad.recovery@gmail.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 text-xs focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">রিকভারি ফোন</label>
                  <input
                    type="text"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="01700000000"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 text-xs focus:outline-none mt-1"
                  />
                </div>
              </div>
            </div>

            {/* MongoDB Atlas */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <h4 className="font-semibold text-emerald-400 text-xs">🍃 MongoDB Atlas Credentials</h4>
              <div>
                <label className="text-[11px] text-slate-400">Connection String (URI)</label>
                <div className="flex items-center mt-1">
                  <input
                    type={revealed ? "text" : "password"}
                    value={mongodbUri}
                    onChange={(e) => setMongodbUri(e.target.value)}
                    className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(mongodbUri, "mongoUri")}
                    className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                  >
                    {copiedField === "mongoUri" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Firebase & Cloudinary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Firebase */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <h4 className="font-semibold text-amber-400 text-xs">🔥 Firebase Authentication</h4>
                <div>
                  <label className="text-[10px] text-slate-400">Project ID</label>
                  <input
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Web API Key</label>
                  <div className="flex items-center mt-1">
                    <input
                      type={revealed ? "text" : "password"}
                      value={firebaseApiKey}
                      onChange={(e) => setFirebaseApiKey(e.target.value)}
                      className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(firebaseApiKey, "fbKey")}
                      className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1 text-slate-300"
                    >
                      {copiedField === "fbKey" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cloudinary */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <h4 className="font-semibold text-sky-400 text-xs">☁️ Cloudinary Storage</h4>
                <div>
                  <label className="text-[10px] text-slate-400">Cloud Name</label>
                  <input
                    type="text"
                    value={cloudinaryCloudName}
                    onChange={(e) => setCloudinaryCloudName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">API Key & Secret</label>
                  <div className="flex items-center mt-1">
                    <input
                      type={revealed ? "text" : "password"}
                      value={cloudinaryApiKey}
                      onChange={(e) => setCloudinaryApiKey(e.target.value)}
                      placeholder="API Key"
                      className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(cloudinaryApiKey, "cKey")}
                      className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1 text-slate-300"
                    >
                      {copiedField === "cKey" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vercel & Notes */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
              <h4 className="font-semibold text-purple-400 text-xs">▲ Vercel & Additional Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Vercel Project Name / ID</label>
                  <input
                    type="text"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-mono text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">সুরক্ষিত নোট</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="অতিরিক্ত নির্দেশনা..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>শুধুমাত্র অ্যাডমিন ব্যবহারের জন্য</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "সংরক্ষণ হচ্ছে..." : "আপডেট সেভ করুন"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
