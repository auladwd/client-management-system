"use client";

import { useState, useEffect } from "react";
import {
  Users2,
  Plus,
  Search,
  MessageSquare,
  ExternalLink,
  Phone,
  Mail,
  Shield,
  CreditCard,
} from "lucide-react";
import { MockRepresentative } from "@/lib/store";
import { DIVISIONS, BANGLADESH_DISTRICTS } from "@/lib/bangladesh-data";
import RepModal from "@/components/RepModal";

export default function RepresentativesPage() {
  const [reps, setReps] = useState<MockRepresentative[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchReps();
  }, []);

  async function fetchReps() {
    setLoading(true);
    try {
      const res = await fetch("/api/representatives");
      const json = await res.json();
      if (json.success) {
        setReps(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredDistricts = selectedDivision
    ? BANGLADESH_DISTRICTS.filter((d) => d.division.toLowerCase() === selectedDivision.toLowerCase())
    : BANGLADESH_DISTRICTS;

  const filteredReps = reps.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.repCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiv = !selectedDivision || r.division.toLowerCase() === selectedDivision.toLowerCase();
    const matchesDist = !selectedDistrict || r.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDiv && matchesDist;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users2 className="h-6 w-6 text-purple-400" />
            জেলা ও উপজেলা প্রতিনিধি নেটওয়ার্ক
          </h1>
          <p className="text-xs text-slate-400">
            সমগ্র বাংলাদেশের প্রতিটি জেলা ও উপজেলা থেকে এক জন করে প্রতিনিধি নিয়োগ, যোগাযোগ ও কমিশন ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন প্রতিনিধি নিয়োগ করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, ফোন বা কোড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict("");
              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">সকল বিভাগ (৮টি বিভাগ)</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">সকল জেলা (৬৪ জেলা)</option>
              {filteredDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.bnName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reps Row-based Table */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">প্রতিনিধি তালিকা লোড হচ্ছে...</div>
      ) : filteredReps.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">কোনো প্রতিনিধি পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">উপরে বোতামে ক্লিক করে নতুন প্রতিনিধি যুক্ত করুন।</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">প্রতিনিধির কোড ও নাম</th>
                  <th className="py-3.5 px-4 font-semibold">এলাকা ও কর্মক্ষেত্র</th>
                  <th className="py-3.5 px-4 font-semibold">যোগাযোগ ও NID</th>
                  <th className="py-3.5 px-4 font-semibold">কমিশন ও পে-আউট মেথড</th>
                  <th className="py-3.5 px-4 font-semibold text-right">বিক্রয় ও পাওনা</th>
                  <th className="py-3.5 px-4 font-semibold text-center">যোগাযোগ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReps.map((rep) => {
                  const waUrl = `https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম ${rep.name} ভাই, Aulad IT Solution থেকে বলছি...`
                  )}`;
                  return (
                    <tr
                      key={rep._id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* 1. Code & Name */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-block rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                            কোড: {rep.repCode}
                          </span>
                          <p className="font-bold text-white text-sm leading-tight group-hover:text-purple-300 transition">
                            {rep.name}
                          </p>
                        </div>
                      </td>

                      {/* 2. Area */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-slate-200 font-medium">
                            📍 {rep.upazila}, {rep.district}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            বিভাগ: {rep.division}
                          </p>
                        </div>
                      </td>

                      {/* 3. Contact & NID */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-mono text-slate-200">
                            📞 {rep.phone}
                          </p>
                          {rep.email && (
                            <p className="text-slate-400 text-[11px] truncate max-w-[160px]">
                              ✉️ {rep.email}
                            </p>
                          )}
                          {rep.nidNumber && (
                            <p className="text-slate-400 font-mono text-[10px]">
                              NID: {rep.nidNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 4. Commission Rate & Payout Method */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <span className="inline-block font-semibold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                            ৳{rep.commissionValue} / সেল
                          </span>
                          {rep.payoutMethod && (
                            <p className="text-[11px] text-slate-300 leading-tight">
                              পদ্ধতি: <span className="text-slate-400">{rep.payoutMethod}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 5. Sales & Commission Due */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-slate-300 text-[11px]">
                            মোট বিক্রয়: <strong className="text-white font-bold">{rep.totalSalesCount} টি</strong>
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            কমিশন পাওনা: <strong className="text-emerald-400 font-bold">৳{rep.commissionDue}</strong>
                          </p>
                        </div>
                      </td>

                      {/* 6. WhatsApp Action */}
                      <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition shadow-sm"
                          title="হোয়াটসঅ্যাপে চ্যাট করুন"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>হোয়াটসঅ্যাপ</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rep Modal */}
      <RepModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchReps}
      />
    </div>
  );
}
