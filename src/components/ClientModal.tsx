"use client";

import { useState, useEffect } from "react";
import {
  X,
  Building2,
  KeyRound,
  CreditCard,
  Upload,
  Database,
  Flame,
  Cloud,
  Mail,
  Lock,
  Globe2,
  FileCode2,
  CheckCircle2,
} from "lucide-react";
import { DIVISIONS, BANGLADESH_DISTRICTS, getUpazilas } from "@/lib/bangladesh-data";
import { parseEnvText, DecryptedCredentials } from "@/lib/env-helper";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClientModal({ isOpen, onClose, onSuccess }: ClientModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "vault" | "billing">("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showImportEnv, setShowImportEnv] = useState(false);
  const [rawEnvInput, setRawEnvInput] = useState("");
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Step 1: Info
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("Savar");
  const [appType, setAppType] = useState("School Management");
  const [vercelUrl, setVercelUrl] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [assignedRepCode, setAssignedRepCode] = useState("");
  const [notes, setNotes] = useState("");

  // Step 2: Vault
  // 1. Gmail
  const [gmailPassword, setGmailPassword] = useState("");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("465");
  // 2. MongoDB
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
  // 5. NextAuth / Security
  const [nextauthSecret, setNextauthSecret] = useState("");
  const [nextauthUrl, setNextauthUrl] = useState("");
  // 6. Vercel
  const [vercelProjectId, setVercelProjectId] = useState("");
  const [vercelOrgId, setVercelOrgId] = useState("");
  const [vercelToken, setVercelToken] = useState("");
  // 7. SMS & Payment
  const [smsApiKey, setSmsApiKey] = useState("");
  const [smsSenderId, setSmsSenderId] = useState("");
  const [paymentMerchantId, setPaymentMerchantId] = useState("");
  const [paymentSecretKey, setPaymentSecretKey] = useState("");
  // 8. Custom
  const [customEnv, setCustomEnv] = useState("");

  // Step 3: Billing
  const [totalAmount, setTotalAmount] = useState("20000");
  const [advanceAmount, setAdvanceAmount] = useState("10000");

  // Dynamic district options based on division
  const filteredDistricts = BANGLADESH_DISTRICTS.filter((d) => d.division === division);
  const upazilaOptions = getUpazilas(district);

  useEffect(() => {
    if (filteredDistricts.length > 0 && !filteredDistricts.some((d) => d.name === district)) {
      setDistrict(filteredDistricts[0].name);
    }
  }, [division]);

  useEffect(() => {
    if (upazilaOptions.length > 0 && !upazilaOptions.includes(upazila)) {
      setUpazila(upazilaOptions[0]);
    }
  }, [district]);

  if (!isOpen) return null;

  function handleApplyImport() {
    if (!rawEnvInput.trim()) return;
    const { creds, detectedEmail } = parseEnvText(rawEnvInput);

    if (detectedEmail && !email) setEmail(detectedEmail);
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

    setShowImportEnv(false);
    setRawEnvInput("");
    setImportSuccess(".env ভ্যারিয়েবলগুলো সফলভাবে পার্স করে ভল্ট ফর্মে বসানো হয়েছে!");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const creds: DecryptedCredentials = {
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
        notes: `Created for ${name}`,
      };

      const payload = {
        name,
        ownerName: ownerName || name,
        phone,
        email,
        division,
        district,
        upazila,
        appType,
        vercelUrl,
        customDomain,
        githubRepo,
        assignedRepCode,
        notes,
        totalAmount: Number(totalAmount) || 0,
        advanceAmount: Number(advanceAmount) || 0,
        credentials: creds,
      };

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to add client");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving client");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-400" />
              নতুন ক্লায়েন্ট ও ভল্ট যুক্ত করুন
            </h2>
            <p className="text-xs text-slate-400">
              অ্যাপ তথ্য, লাইভ ইউআরএল, পেমেন্ট ও এনক্রিপ্টেড .env ক্রেডেনশিয়াল সংরক্ষণ
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mt-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "info"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="h-4 w-4" /> ১. প্রতিষ্ঠান ও অ্যাপ তথ্য
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "vault"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="h-4 w-4" /> ২. ক্রেডেনশিয়াল ভল্ট (.env)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === "billing"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CreditCard className="h-4 w-4" /> ৩. চুক্তি ও প্রাথমিক বিলিং
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-400 shrink-0">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-3 overflow-y-auto pr-1 flex-1 space-y-4 text-xs">
          {/* TAB 1: General Info */}
          {activeTab === "info" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    প্রতিষ্ঠানের নাম / অ্যাপের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    মালিক / দায়িত্বপ্রাপ্ত ব্যক্তির নাম
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ডেডিকেটেড জিমেইল ইমেইল *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* District & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">বিভাগ</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">জেলা</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  >
                    {filteredDistricts.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} ({d.bnName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">উপজেলা</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  >
                    {upazilaOptions.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* App Type & Deployment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    অ্যাপের ধরণ *
                  </label>
                  <select
                    value={appType}
                    onChange={(e) => setAppType(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="School Management">School Management (শিক্ষা প্রতিষ্ঠান)</option>
                    <option value="E-Commerce">E-Commerce (অনলাইন শপ)</option>
                    <option value="POS & Inventory">POS & Inventory (দোকান ও হিসাব)</option>
                    <option value="Hospital & Diagnostic">Hospital & Diagnostic (হাসপাতাল)</option>
                    <option value="Restaurant & Food">Restaurant & Food (রেস্টুরেন্ট)</option>
                    <option value="Real Estate">Real Estate (রিয়েল এস্টেট)</option>
                    <option value="Custom Web App">Custom Web App (কাস্টম অ্যাপ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vercel লাইভ লিংক *
                  </label>
                  <input
                    type="url"
                    required
                    value={vercelUrl}
                    onChange={(e) => setVercelUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    কাস্টম ডোমেইন (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    রেফারেল / প্রতিনিধি কোড
                  </label>
                  <input
                    type="text"
                    value={assignedRepCode}
                    onChange={(e) => setAssignedRepCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub রিপোজিটরি লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  নোটস ও বিশেষ নির্দেশনা
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Vault Info (.env) */}
          {activeTab === "vault" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300 text-xs">
                    মিলিটারি-গ্রেড <strong>AES-256-GCM</strong> এনক্রিপ্ট হয়ে ডাটাবেজে জমা থাকবে।
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowImportEnv(!showImportEnv)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold text-xs hover:bg-sky-500/30 transition shrink-0"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>.env পেস্ট করে অটো-ফিল</span>
                </button>
              </div>

              {importSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}

              {/* Import Drawer */}
              {showImportEnv && (
                <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-950/40 space-y-2">
                  <p className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                    <FileCode2 className="h-4 w-4" />
                    বিদ্যমান .env টেক্সট এখানে পেস্ট করুন (স্বয়ংক্রিয়ভাবে ফর্ম পূরণ হবে):
                  </p>
                  <textarea
                    rows={4}
                    value={rawEnvInput}
                    onChange={(e) => setRawEnvInput(e.target.value)}
                    placeholder={`MONGODB_URI="mongodb+srv://..."\nNEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."\nCLOUDINARY_API_KEY="..."`}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImportEnv(false)}
                      className="px-3 py-1 rounded-lg border border-slate-800 text-slate-400 text-xs hover:text-white"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyImport}
                      className="px-3.5 py-1 rounded-lg bg-sky-500 text-xs font-semibold text-white hover:bg-sky-400"
                    >
                      পার্স ও প্রয়োগ করুন
                    </button>
                  </div>
                </div>
              )}

              {/* MongoDB Atlas */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                <label className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <Database className="h-3.5 w-3.5" /> MONGODB_URI (কানেকশন স্ট্রিং)
                </label>
                <input
                  type="text"
                  value={mongodbUri}
                  onChange={(e) => setMongodbUri(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Firebase */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5 text-xs">
                  <Flame className="h-3.5 w-3.5" /> Firebase Authentication
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">NEXT_PUBLIC_FIREBASE_PROJECT_ID</label>
                    <input
                      type="text"
                      value={firebaseProjectId}
                      onChange={(e) => setFirebaseProjectId(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">NEXT_PUBLIC_FIREBASE_API_KEY</label>
                    <input
                      type="text"
                      value={firebaseApiKey}
                      onChange={(e) => setFirebaseApiKey(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cloudinary */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                <span className="font-semibold text-sky-400 flex items-center gap-1.5 text-xs">
                  <Cloud className="h-3.5 w-3.5" /> Cloudinary মিডিয়া স্টোরেজ
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">CLOUDINARY_CLOUD_NAME</label>
                    <input
                      type="text"
                      value={cloudinaryCloudName}
                      onChange={(e) => setCloudinaryCloudName(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">CLOUDINARY_API_KEY</label>
                    <input
                      type="text"
                      value={cloudinaryApiKey}
                      onChange={(e) => setCloudinaryApiKey(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">CLOUDINARY_API_SECRET</label>
                    <input
                      type="text"
                      value={cloudinaryApiSecret}
                      onChange={(e) => setCloudinaryApiSecret(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Gmail & Vercel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                  <span className="font-semibold text-purple-400 flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" /> 📧 গুগল 16-Digit App Password
                  </span>
                  <input
                    type="text"
                    value={gmailPassword}
                    onChange={(e) => setGmailPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5 text-xs">
                    <Globe2 className="h-3.5 w-3.5" /> ▲ Vercel Project ID
                  </span>
                  <input
                    type="text"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* NextAuth Secret */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <Lock className="h-3.5 w-3.5" /> 🔐 NEXTAUTH_SECRET / AUTH_SECRET
                </span>
                <input
                  type="text"
                  value={nextauthSecret}
                  onChange={(e) => setNextauthSecret(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {/* Custom Env */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                  <FileCode2 className="h-3.5 w-3.5 text-sky-400" /> ⚙️ অতিরিক্ত কাস্টম ভ্যারিয়েবল
                </span>
                <textarea
                  rows={2}
                  placeholder={`SMS_API_KEY="xxx"\nPAYMENT_GATEWAY_KEY="yyy"`}
                  value={customEnv}
                  onChange={(e) => setCustomEnv(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Billing Info */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    মোট প্রজেক্ট চুক্তি মূল্য (টাকা) *
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">৳</span>
                    <input
                      type="number"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    অ্যাপ তৈরি ও ডেপ্লয়মেন্টের সর্বমোট ফিক্সড চুক্তি
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    প্রাথমিক বুকিং / এডভান্স পেমেন্ট (টাকা)
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">৳</span>
                    <input
                      type="number"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    বুকিংয়ের সময় ক্লায়েন্টের দেওয়া প্রাথমিক ক্যাশ/বিকাশ
                  </p>
                </div>
              </div>

              {/* Calculated Preview */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>মোট চুক্তি মূল্য:</span>
                  <span className="font-bold text-white">৳{Number(totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>পরিশোধিত এডভান্স:</span>
                  <span className="font-bold">৳{Number(advanceAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-rose-400 border-t border-slate-800 pt-2">
                  <span>অবশিষ্ট বকেয়া:</span>
                  <span className="font-bold">৳{Math.max(0, Number(totalAmount) - Number(advanceAmount)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : "ক্লায়েন্ট ও ভল্ট সেভ করুন"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
