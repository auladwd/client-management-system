"use client";

import { useState, useEffect } from "react";
import { X, Building2, KeyRound, CreditCard, CheckCircle2 } from "lucide-react";
import { DIVISIONS, BANGLADESH_DISTRICTS, getUpazilas } from "@/lib/bangladesh-data";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClientModal({ isOpen, onClose, onSuccess }: ClientModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "vault" | "billing">("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const [gmailPassword, setGmailPassword] = useState("");
  const [mongodbUri, setMongodbUri] = useState("");
  const [firebaseProjectId, setFirebaseProjectId] = useState("");
  const [firebaseApiKey, setFirebaseApiKey] = useState("");
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState("");
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState("");
  const [vercelProjectId, setVercelProjectId] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name,
        ownerName,
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
        credentials: {
          gmailPassword,
          mongodbUri,
          firebaseProjectId,
          firebaseApiKey,
          cloudinaryCloudName,
          cloudinaryApiKey,
          vercelProjectId,
          notes: `Created for ${name}`,
        },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-400" />
              নতুন ক্লায়েন্ট ও অ্যাপ যুক্ত করুন
            </h2>
            <p className="text-xs text-slate-400">
              অ্যাপ তথ্য, ডেপ্লয়মেন্ট ইউআরএল ও এনক্রিপ্টেড ক্রেডেনশিয়াল সংরক্ষণ
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
        <div className="flex border-b border-slate-800 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
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
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === "vault"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <KeyRound className="h-4 w-4" /> ২. এনক্রিপ্টেড ক্রেডেনশিয়াল (Vault)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === "billing"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <CreditCard className="h-4 w-4" /> ৩. প্রাথমিক চুক্তি ও বিলিং
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* TAB 1: General Info */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    প্রতিষ্ঠানের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: আল-হেরা একাডেমি"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    মালিক / যোগাযোগের ব্যক্তি *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
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
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ডেডিকেটেড ইমেইল এড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alhera.school.bd@gmail.com"
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
                    placeholder="https://alhera-school.vercel.app"
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
                    placeholder="https://alheraschool.edu.bd"
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
                    placeholder="যেমন: REP-DHK-01"
                    value={assignedRepCode}
                    onChange={(e) => setAssignedRepCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  প্রজেক্ট সম্পর্কিত বিশেষ নোট
                </label>
                <textarea
                  rows={2}
                  placeholder="ক্লায়েন্টের কোনো বিশেষ রিকোয়ারমেন্ট বা নির্দেশনা..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Vault Info */}
          {activeTab === "vault" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <KeyRound className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  এই তথ্যগুলো <strong>AES-256-GCM</strong> এনক্রিপ্ট হয়ে ডাটাবেজে জমা হবে। শুধুমাত্র এডমিন প্যানেল থেকে নিরাপদে কপি বা দেখা যাবে।
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  জিমেইল পাসওয়ার্ড / App Password
                </label>
                <input
                  type="text"
                  placeholder="AppPassword_16_digits"
                  value={gmailPassword}
                  onChange={(e) => setGmailPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  MongoDB Atlas Connection String (URI)
                </label>
                <input
                  type="text"
                  placeholder="mongodb+srv://admin:pass@cluster0.xxx.mongodb.net/dbname"
                  value={mongodbUri}
                  onChange={(e) => setMongodbUri(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Firebase Project ID
                  </label>
                  <input
                    type="text"
                    placeholder="my-client-app-auth"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Firebase Web API Key
                  </label>
                  <input
                    type="text"
                    placeholder="AIzaSyD-..."
                    value={firebaseApiKey}
                    onChange={(e) => setFirebaseApiKey(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cloudinary Cloud Name
                  </label>
                  <input
                    type="text"
                    placeholder="cloud-name"
                    value={cloudinaryCloudName}
                    onChange={(e) => setCloudinaryCloudName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vercel Project ID / Slug
                  </label>
                  <input
                    type="text"
                    placeholder="prj_xxx"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Billing Info */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    মোট চুক্তি মূল্য (টাকা) *
                  </label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-base font-bold text-white focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    এককালীন সাশ্রয়ী নির্ধারিত মূল্য
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    প্রাথমিক এডভান্স পেমেন্ট (টাকা)
                  </label>
                  <input
                    type="number"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-base font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    বকেয়া থাকবে: ৳{Math.max(0, Number(totalAmount) - Number(advanceAmount))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="text-xs text-slate-400">
              {activeTab === "info" && "ধাপ ১ / ৩"}
              {activeTab === "vault" && "ধাপ ২ / ৩"}
              {activeTab === "billing" && "ধাপ ৩ / ৩"}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                বাতিল
              </button>

              {activeTab === "info" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("vault")}
                  className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 transition"
                >
                  পরবর্তী: ক্রেডেনশিয়াল
                </button>
              )}

              {activeTab === "vault" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("billing")}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 transition"
                >
                  পরবর্তী: বিলিং
                </button>
              )}

              {activeTab === "billing" && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:from-sky-400 hover:to-indigo-500 transition disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {loading ? "সংরক্ষণ হচ্ছে..." : "সম্পূর্ণ সংরক্ষণ করুন"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
