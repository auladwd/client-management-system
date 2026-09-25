"use client";

import { useState, useEffect } from "react";
import { X, Users2, CheckCircle2 } from "lucide-react";
import { DIVISIONS, BANGLADESH_DISTRICTS, getUpazilas } from "@/lib/bangladesh-data";

interface RepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RepModal({ isOpen, onClose, onSuccess }: RepModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("Savar");
  const [nidNumber, setNidNumber] = useState("");
  const [commissionType, setCommissionType] = useState<"fixed" | "percentage">("fixed");
  const [commissionValue, setCommissionValue] = useState("1500");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      const res = await fetch("/api/representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          whatsapp: whatsapp || phone,
          email,
          division,
          district,
          upazila,
          nidNumber,
          commissionType,
          commissionValue: Number(commissionValue),
          payoutMethod,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">নতুন প্রতিনিধি নিয়োগ করুন</h2>
              <p className="text-slate-400">জেলা ও উপজেলা ভিত্তিক সেলস রিপ্রেজেন্টেটিভ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">প্রতিনিধির নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: হাসান মাহমুদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                placeholder="017xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">হোয়াটসঅ্যাপ নম্বর</label>
              <input
                type="tel"
                placeholder="88017xxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">ইমেইল এড্রেস</label>
              <input
                type="email"
                placeholder="rep.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Area selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">বিভাগ</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-white"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">জেলা *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-white"
              >
                {filteredDistricts.map((d) => (
                  <option key={d.name} value={d.name}>{d.name} ({d.bnName})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">উপজেলা *</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-white"
              >
                {upazilaOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">জাতীয় পরিচয়পত্র (NID) নম্বর</label>
              <input
                type="text"
                placeholder="199xxxxxxxxxx"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">প্রতি সেলে কমিশন (টাকা)</label>
              <input
                type="number"
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              কমিশন পেমেন্ট মেথড ও একাউন্ট
            </label>
            <input
              type="text"
              placeholder="যেমন: bKash Personal 017xxxxxxxx অথবা ব্যাংক একাউন্ট নম্বর"
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-slate-400 hover:bg-slate-800"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : "প্রতিনিধি সেভ করুন"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
