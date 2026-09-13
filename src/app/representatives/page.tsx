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

      {/* Reps Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">প্রতিনিধি তালিকা লোড হচ্ছে...</div>
      ) : filteredReps.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">কোনো প্রতিনিধি পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">উপরে বোতামে ক্লিক করে নতুন প্রতিনিধি যুক্ত করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReps.map((rep) => {
            const waUrl = `https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
              `আসসালামু আলাইকুম ${rep.name} ভাই, Aulad IT Solution থেকে বলছি...`
            )}`;
            return (
              <div
                key={rep._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20 mb-1">
                        কোড: {rep.repCode}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">{rep.name}</h3>
                      <p className="text-xs text-slate-400">
                        📍 {rep.upazila}, {rep.district} ({rep.division})
                      </p>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition shrink-0"
                      title="হোয়াটসঅ্যাপে চ্যাট করুন"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>

                  {/* Details Card */}
                  <div className="rounded-xl bg-slate-950 p-3 text-xs space-y-1.5 border border-slate-800/80">
                    <div className="flex justify-between text-slate-400">
                      <span>মোবাইল:</span>
                      <span className="font-mono text-slate-200">{rep.phone}</span>
                    </div>
                    {rep.nidNumber && (
                      <div className="flex justify-between text-slate-400">
                        <span>NID নম্বর:</span>
                        <span className="font-mono text-slate-300">{rep.nidNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>কমিশন রেট:</span>
                      <span className="font-bold text-white">৳{rep.commissionValue} / সেল</span>
                    </div>
                  </div>

                  {/* Financial & Performance */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400">মোট বিক্রয় (Sales)</p>
                      <p className="text-base font-bold text-white mt-0.5">{rep.totalSalesCount} টি</p>
                    </div>
                    <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800 text-center">
                      <p className="text-[10px] text-slate-400">কমিশন পাওনা (Due)</p>
                      <p className="text-base font-bold text-emerald-400 mt-0.5">৳{rep.commissionDue}</p>
                    </div>
                  </div>
                </div>

                {/* Payout Details Footer */}
                {rep.payoutMethod && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>পে-আউট মেথড:</span>
                    <span className="font-medium text-slate-200">{rep.payoutMethod}</span>
                  </div>
                )}
              </div>
            );
          })}
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
