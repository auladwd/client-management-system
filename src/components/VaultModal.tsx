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
  ShieldCheck,
  Save,
  FileCode2,
  Upload,
  Database,
  Flame,
  Cloud,
  Mail,
  Lock,
  Globe2,
  MessageSquare,
  CreditCard,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  DecryptedCredentials,
  generateEnvContent,
  downloadEnvFile,
  copyEnvToClipboard,
  parseEnvText,
} from "@/lib/env-helper";

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
  decrypted?: DecryptedCredentials;
}

export default function VaultModal({
  clientId,
  clientName,
  isOpen,
  onClose,
}: VaultModalProps) {
  const [vault, setVault] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyAllStatus, setCopyAllStatus] = useState(false);
  const [showImportBox, setShowImportBox] = useState(false);
  const [rawEnvInput, setRawEnvInput] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "db" | "firebase" | "cloudinary" | "email" | "security" | "vercel" | "sms" | "custom"
  >("all");

  // 1. Email & Recovery
  const [dedicatedEmail, setDedicatedEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("465");

  // 2. MongoDB Atlas
  const [mongodbUri, setMongodbUri] = useState("");
  const [mongodbDbName, setMongodbDbName] = useState("");

  // 3. Firebase
  const [firebaseApiKey, setFirebaseApiKey] = useState("");
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState("");
  const [firebaseProjectId, setFirebaseProjectId] = useState("");
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState("");
  const [firebaseMessagingSenderId, setFirebaseMessagingSenderId] = useState("");
  const [firebaseAppId, setFirebaseAppId] = useState("");

  // 4. Cloudinary
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState("");
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState("");
  const [cloudinaryApiSecret, setCloudinaryApiSecret] = useState("");

  // 5. Security & NextAuth
  const [nextauthSecret, setNextauthSecret] = useState("");
  const [nextauthUrl, setNextauthUrl] = useState("");

  // 6. Vercel
  const [vercelProjectId, setVercelProjectId] = useState("");
  const [vercelOrgId, setVercelOrgId] = useState("");
  const [vercelToken, setVercelToken] = useState("");

  // 7. SMS Gateway
  const [smsApiKey, setSmsApiKey] = useState("");
  const [smsSenderId, setSmsSenderId] = useState("");

  // 8. Payment Gateway
  const [paymentMerchantId, setPaymentMerchantId] = useState("");
  const [paymentSecretKey, setPaymentSecretKey] = useState("");

  // 9. Custom / Extra
  const [customEnv, setCustomEnv] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && clientId) {
      fetchVault();
    }
  }, [isOpen, clientId]);

  async function fetchVault() {
    setLoading(true);
    setSaveSuccessMsg(null);
    try {
      const res = await fetch(`/api/vault?clientId=${clientId}&decrypt=true`);
      const json = await res.json();
      if (json.success && json.data) {
        setVault(json.data);
        setDedicatedEmail(json.data.dedicatedEmail || "");
        setRecoveryEmail(json.data.recoveryEmail || "");
        setRecoveryPhone(json.data.recoveryPhone || "");

        const d: DecryptedCredentials = json.data.decrypted || {};
        setMongodbUri(d.mongodbUri || "");
        setMongodbDbName(d.mongodbDbName || "");

        setFirebaseApiKey(d.firebaseApiKey || "");
        setFirebaseAuthDomain(d.firebaseAuthDomain || "");
        setFirebaseProjectId(d.firebaseProjectId || "");
        setFirebaseStorageBucket(d.firebaseStorageBucket || "");
        setFirebaseMessagingSenderId(d.firebaseMessagingSenderId || "");
        setFirebaseAppId(d.firebaseAppId || "");

        setCloudinaryCloudName(d.cloudinaryCloudName || "");
        setCloudinaryApiKey(d.cloudinaryApiKey || "");
        setCloudinaryApiSecret(d.cloudinaryApiSecret || "");

        setGmailPassword(d.gmailPassword || "");
        setSmtpHost(d.smtpHost || "smtp.gmail.com");
        setSmtpPort(d.smtpPort || "465");

        setNextauthSecret(d.nextauthSecret || "");
        setNextauthUrl(d.nextauthUrl || "");

        setVercelProjectId(d.vercelProjectId || "");
        setVercelOrgId(d.vercelOrgId || "");
        setVercelToken(d.vercelToken || "");

        setSmsApiKey(d.smsApiKey || "");
        setSmsSenderId(d.smsSenderId || "");

        setPaymentMerchantId(d.paymentMerchantId || "");
        setPaymentSecretKey(d.paymentSecretKey || "");

        setCustomEnv(d.customEnv || "");
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

  function getCurrentCredentials(): DecryptedCredentials {
    return {
      mongodbUri,
      mongodbDbName,
      firebaseApiKey,
      firebaseAuthDomain,
      firebaseProjectId,
      firebaseStorageBucket,
      firebaseMessagingSenderId,
      firebaseAppId,
      cloudinaryCloudName,
      cloudinaryApiKey,
      cloudinaryApiSecret,
      gmailPassword,
      smtpHost,
      smtpPort,
      nextauthSecret,
      nextauthUrl,
      vercelProjectId,
      vercelOrgId,
      vercelToken,
      smsApiKey,
      smsSenderId,
      paymentMerchantId,
      paymentSecretKey,
      customEnv,
      notes,
    };
  }

  function handleCopy(value: string, fieldName: string) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  }

  async function handleCopyEntireEnv() {
    const creds = getCurrentCredentials();
    const content = generateEnvContent(clientName, dedicatedEmail, creds);
    const success = await copyEnvToClipboard(content);
    if (success) {
      setCopyAllStatus(true);
      setTimeout(() => setCopyAllStatus(false), 2500);
    }
  }

  function handleDownload(filename: string = ".env.local") {
    const creds = getCurrentCredentials();
    const content = generateEnvContent(clientName, dedicatedEmail, creds);
    downloadEnvFile(content, filename);
  }

  function handleApplyImport() {
    if (!rawEnvInput.trim()) return;
    const { creds, detectedEmail } = parseEnvText(rawEnvInput);

    if (detectedEmail && !dedicatedEmail) setDedicatedEmail(detectedEmail);
    if (creds.mongodbUri) setMongodbUri(creds.mongodbUri);
    if (creds.mongodbDbName) setMongodbDbName(creds.mongodbDbName);

    if (creds.firebaseApiKey) setFirebaseApiKey(creds.firebaseApiKey);
    if (creds.firebaseAuthDomain) setFirebaseAuthDomain(creds.firebaseAuthDomain);
    if (creds.firebaseProjectId) setFirebaseProjectId(creds.firebaseProjectId);
    if (creds.firebaseStorageBucket) setFirebaseStorageBucket(creds.firebaseStorageBucket);
    if (creds.firebaseMessagingSenderId) setFirebaseMessagingSenderId(creds.firebaseMessagingSenderId);
    if (creds.firebaseAppId) setFirebaseAppId(creds.firebaseAppId);

    if (creds.cloudinaryCloudName) setCloudinaryCloudName(creds.cloudinaryCloudName);
    if (creds.cloudinaryApiKey) setCloudinaryApiKey(creds.cloudinaryApiKey);
    if (creds.cloudinaryApiSecret) setCloudinaryApiSecret(creds.cloudinaryApiSecret);

    if (creds.gmailPassword) setGmailPassword(creds.gmailPassword);
    if (creds.smtpHost) setSmtpHost(creds.smtpHost);
    if (creds.smtpPort) setSmtpPort(creds.smtpPort);

    if (creds.nextauthSecret) setNextauthSecret(creds.nextauthSecret);
    if (creds.nextauthUrl) setNextauthUrl(creds.nextauthUrl);

    if (creds.vercelProjectId) setVercelProjectId(creds.vercelProjectId);
    if (creds.vercelOrgId) setVercelOrgId(creds.vercelOrgId);
    if (creds.vercelToken) setVercelToken(creds.vercelToken);

    if (creds.smsApiKey) setSmsApiKey(creds.smsApiKey);
    if (creds.smsSenderId) setSmsSenderId(creds.smsSenderId);

    if (creds.paymentMerchantId) setPaymentMerchantId(creds.paymentMerchantId);
    if (creds.paymentSecretKey) setPaymentSecretKey(creds.paymentSecretKey);

    if (creds.customEnv) setCustomEnv(creds.customEnv);

    setShowImportBox(false);
    setRawEnvInput("");
    setSaveSuccessMsg(".env ফাইল থেকে ভ্যালুগুলো সফলভাবে ইনপুট ফিল্ডে বসানো হয়েছে! সেভ করতে 'সংরক্ষণ করুন' বাটনে চাপুন।");
  }

  async function handleSave() {
    if (!clientId) return;
    setSaving(true);
    setSaveSuccessMsg(null);
    try {
      const payload = {
        clientId,
        clientName,
        dedicatedEmail,
        recoveryEmail,
        recoveryPhone,
        credentials: getCurrentCredentials(),
      };

      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        fetchVault();
        setSaveSuccessMsg("ক্রেডেনশিয়াল সফলভাবে মিলিটারি-গ্রেড AES-256 এনক্রিপ্ট হয়ে MongoDB Atlas এ সংরক্ষিত হয়েছে!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{clientName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                  মিলিটারি AES-256 ভল্ট
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                MongoDB Atlas, Firebase, Cloudinary, Gmail ও প্রোডাকশন ক্রেডেনশিয়াল ম্যানেজার
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

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setRevealed(!revealed)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              {revealed ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-slate-400" />}
              <span>{revealed ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportBox(!showImportBox)}
              className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>.env ফাইল থেকে পেস্ট/ইম্পোর্ট</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyEntireEnv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
              title="সম্পূর্ণ .env ফাইল ক্লিপবোর্ডে কপি করুন"
            >
              {copyAllStatus ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copyAllStatus ? "কপি হয়েছে!" : "সম্পূর্ণ .env কপি"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload(".env.local")}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:opacity-90 transition active:scale-95"
              title="রেডি টু ইউজ .env.local ফাইল ডাউনলোড করুন"
            >
              <Download className="h-3.5 w-3.5" />
              <span>.env.local ডাউনলোড</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload(".env")}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
              title=".env ফাইল হিসেবে ডাউনলোড করুন"
            >
              <FileCode2 className="h-3.5 w-3.5" />
              <span>.env</span>
            </button>
          </div>
        </div>

        {/* Success / Alert Banner */}
        {saveSuccessMsg && (
          <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Quick Import Drawer / Box */}
        {showImportBox && (
          <div className="mt-3 p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/40 space-y-2 shrink-0 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-sky-300 flex items-center gap-1.5">
                <Upload className="h-4 w-4" />
                আপনার বিদ্যমান .env ফাইলের টেক্সট নিচে পেস্ট করুন:
              </span>
              <button
                type="button"
                onClick={() => setShowImportBox(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={rawEnvInput}
              onChange={(e) => setRawEnvInput(e.target.value)}
              placeholder={`MONGODB_URI="mongodb+srv://..."\nNEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."\nCLOUDINARY_API_KEY="12345..."`}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRawEnvInput("")}
                className="px-3 py-1 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                ক্লিয়ার
              </button>
              <button
                type="button"
                onClick={handleApplyImport}
                className="px-3.5 py-1 rounded-lg bg-sky-500 text-xs font-semibold text-white hover:bg-sky-400 transition"
              >
                ভ্যালু পার্স করে বসান
              </button>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 mt-3 border-b border-slate-800 pb-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
          {[
            { id: "all", label: "সকল সার্ভিস", icon: Sliders },
            { id: "db", label: "MongoDB Atlas", icon: Database },
            { id: "firebase", label: "Firebase", icon: Flame },
            { id: "cloudinary", label: "Cloudinary", icon: Cloud },
            { id: "email", label: "Gmail / SMTP", icon: Mail },
            { id: "security", label: "সিকিউরিটি", icon: Lock },
            { id: "vercel", label: "Vercel", icon: Globe2 },
            { id: "sms", label: "SMS গেটওয়ে", icon: MessageSquare },
            { id: "custom", label: "কাস্টম .env", icon: FileCode2 },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-slate-800 text-sky-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Content */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            এনক্রিপ্টেড ভল্ট লোড হচ্ছে...
          </div>
        ) : (
          <div className="mt-3 space-y-4 overflow-y-auto pr-1 text-xs flex-1">
            {/* 1. MongoDB Atlas Section */}
            {(activeCategory === "all" || activeCategory === "db") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-400" />
                    <span>MongoDB Atlas ডাটাবেজ কনফিগারেশন</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">কানেকশন স্ট্রিং ও ক্লাস্টার</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-400">MONGODB_URI (কানেকশন স্ট্রিং)</label>
                    <div className="flex items-center mt-1">
                      <input
                        type={revealed ? "text" : "password"}
                        value={mongodbUri}
                        onChange={(e) => setMongodbUri(e.target.value)}
                        placeholder="mongodb+srv://..."
                        className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(mongodbUri, "mongo")}
                        className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:text-white"
                      >
                        {copiedField === "mongo" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">MONGODB_DB_NAME (ডাটাবেজ নাম - ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={mongodbDbName}
                      onChange={(e) => setMongodbDbName(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Firebase Section */}
            {(activeCategory === "all" || activeCategory === "firebase") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span>Firebase Authentication & Cloud Storage</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">গুগল সাইন-ইন ও স্টোরেজ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_API_KEY</label>
                    <div className="flex items-center mt-1">
                      <input
                        type={revealed ? "text" : "password"}
                        value={firebaseApiKey}
                        onChange={(e) => setFirebaseApiKey(e.target.value)}
                        className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(firebaseApiKey, "fb_key")}
                        className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                      >
                        {copiedField === "fb_key" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_PROJECT_ID</label>
                    <input
                      type="text"
                      value={firebaseProjectId}
                      onChange={(e) => setFirebaseProjectId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</label>
                    <input
                      type="text"
                      value={firebaseAuthDomain}
                      onChange={(e) => setFirebaseAuthDomain(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</label>
                    <input
                      type="text"
                      value={firebaseStorageBucket}
                      onChange={(e) => setFirebaseStorageBucket(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</label>
                    <input
                      type="text"
                      value={firebaseMessagingSenderId}
                      onChange={(e) => setFirebaseMessagingSenderId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXT_PUBLIC_FIREBASE_APP_ID</label>
                    <input
                      type="text"
                      value={firebaseAppId}
                      onChange={(e) => setFirebaseAppId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Cloudinary Section */}
            {(activeCategory === "all" || activeCategory === "cloudinary") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-sky-400" />
                    <span>Cloudinary মিডিয়া ও ইমেজ স্টোরেজ</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">প্রোডাক্ট, প্রোফাইল ও ব্যানার ইমেজ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">CLOUDINARY_CLOUD_NAME</label>
                    <input
                      type="text"
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">CLOUDINARY_API_KEY</label>
                    <input
                      type="text"
                      value={cloudinaryApiKey}
                      onChange={(e) => setCloudinaryApiKey(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">CLOUDINARY_API_SECRET</label>
                    <div className="flex items-center mt-1">
                      <input
                        type={revealed ? "text" : "password"}
                        value={cloudinaryApiSecret}
                        onChange={(e) => setCloudinaryApiSecret(e.target.value)}
                        className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(cloudinaryApiSecret, "c_sec")}
                        className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                      >
                        {copiedField === "c_sec" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Dedicated Gmail & SMTP Section */}
            {(activeCategory === "all" || activeCategory === "email") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-400" />
                    <span>ডেডিকেটেড জিমেইল ও SMTP মেইলার সার্ভিস</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">ওটিপি ও ইনভয়েস মেইল প্রেরক</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">ডেডিকেটেড জিমেইল *</label>
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
                    <label className="text-[11px] text-slate-400">গুগল 16-Digit App Password</label>
                    <div className="flex items-center mt-1">
                      <input
                        type={revealed ? "text" : "password"}
                        value={gmailPassword}
                        onChange={(e) => setGmailPassword(e.target.value)}
                        className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(gmailPassword, "g_pass")}
                        className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                      >
                        {copiedField === "g_pass" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">রিকভারি ইমেইল</label>
                    <input
                      type="text"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">রিকভারি মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={recoveryPhone}
                      onChange={(e) => setRecoveryPhone(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Security & NextAuth Section */}
            {(activeCategory === "all" || activeCategory === "security") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>সিকিউরিটি ও NextAuth / JWT সিক্রেট</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">সেশন টোকেন ও সিগনেচার</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">NEXTAUTH_SECRET / AUTH_SECRET</label>
                    <div className="flex items-center mt-1">
                      <input
                        type={revealed ? "text" : "password"}
                        value={nextauthSecret}
                        onChange={(e) => setNextauthSecret(e.target.value)}
                        className="w-full rounded-l-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(nextauthSecret, "na_sec")}
                        className="rounded-r-lg border border-l-0 border-slate-800 bg-slate-800 px-2 py-1.5 text-slate-300 hover:text-white"
                      >
                        {copiedField === "na_sec" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">NEXTAUTH_URL</label>
                    <input
                      type="text"
                      value={nextauthUrl}
                      onChange={(e) => setNextauthUrl(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Vercel Section */}
            {(activeCategory === "all" || activeCategory === "vercel") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-sky-400" />
                    <span>Vercel প্রজেক্ট ও ডেপ্লয়মেন্ট টোকেন</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">স্বয়ংক্রিয় CI/CD ও হোস্টিং</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">VERCEL_PROJECT_ID</label>
                    <input
                      type="text"
                      value={vercelProjectId}
                      onChange={(e) => setVercelProjectId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">VERCEL_ORG_ID</label>
                    <input
                      type="text"
                      value={vercelOrgId}
                      onChange={(e) => setVercelOrgId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">VERCEL_TOKEN</label>
                    <input
                      type={revealed ? "text" : "password"}
                      value={vercelToken}
                      onChange={(e) => setVercelToken(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. SMS & Payment Gateways */}
            {(activeCategory === "all" || activeCategory === "sms") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span>বাল্ক SMS ও পেমেন্ট গেটওয়ে (ঐচ্ছিক)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">bKash, Nagad ও SMS এপিআই</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">SMS_API_KEY (Greenweb / BulkSMSBD)</label>
                    <input
                      type={revealed ? "text" : "password"}
                      value={smsApiKey}
                      onChange={(e) => setSmsApiKey(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">SMS_SENDER_ID (Masking / Non-masking)</label>
                    <input
                      type="text"
                      value={smsSenderId}
                      onChange={(e) => setSmsSenderId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">PAYMENT_MERCHANT_ID (bKash / Nagad)</label>
                    <input
                      type="text"
                      value={paymentMerchantId}
                      onChange={(e) => setPaymentMerchantId(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">PAYMENT_SECRET_KEY</label>
                    <input
                      type={revealed ? "text" : "password"}
                      value={paymentSecretKey}
                      onChange={(e) => setPaymentSecretKey(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. Custom / Extra Variables & Notes */}
            {(activeCategory === "all" || activeCategory === "custom") && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-sky-400" />
                    <span>অতিরিক্ত কাস্টম .env ভ্যারিয়েবল ও নোটস</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">অন্যান্য যেকোনো কী=ভ্যালু</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400">কাস্টম এনভায়রনমেন্ট ভ্যারিয়েবল (KEY=VALUE ফরম্যাটে)</label>
                    <textarea
                      rows={3}
                      value={customEnv}
                      onChange={(e) => setCustomEnv(e.target.value)}
                      placeholder={`STRIPE_SECRET_KEY="sk_live_..."\nREDIS_URL="redis://..."`}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 p-2 font-mono text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">ভল্ট নোটস ও মন্তব্য</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>AES-256 এনক্রিপশনে ডাটাবেজে সম্পূর্ণ সংরক্ষিত</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              বন্ধ করুন
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "সংরক্ষণ হচ্ছে..." : "ভল্ট সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
