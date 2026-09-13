"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  MessageSquare,
  ExternalLink,
  Users2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { MockBroadcast } from "@/lib/store";
import BroadcastModal from "@/components/BroadcastModal";

export default function BroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<MockBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  async function fetchBroadcasts() {
    setLoading(true);
    try {
      const res = await fetch("/api/broadcast");
      const json = await res.json();
      if (json.success) {
        setBroadcasts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-emerald-400" />
            ব্রডকাস্ট ও গ্রুপ মেসেজিং সেন্টার
          </h1>
          <p className="text-xs text-slate-400">
            একসাথে সকল জেলা ও উপজেলা প্রতিনিধিদের অফিসিয়াল নির্দেশনা ও নোটিশ প্রেরণের ব্যবস্থা
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন বার্তা ব্রডকাস্ট করুন</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-start gap-3">
        <MessageSquare className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-300">হোয়াটসঅ্যাপ ব্রডকাস্ট অটোমেশন</p>
          <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
            আপনি সমগ্র বাংলাদেশের সকল প্রতিনিধিকে অথবা নির্দিষ্ট জেলা/বিভাগের প্রতিনিধিদের ফিল্টার করে নোটিশ তৈরি করতে পারবেন। সিস্টেম প্রতিটি প্রতিনিধির জন্য পার্সোনালাইজড হোয়াটসঅ্যাপ লিঙ্ক তৈরি করে দেয়, যার মাধ্যমে এক ক্লিকেই বার্তা সরাসরি তাদের ফোনে পৌঁছে যায়।
          </p>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          পূর্ববর্তী বার্তা ও নোটিশ হিস্ট্রি
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">লোড হচ্ছে...</div>
        ) : broadcasts.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-xs text-slate-400">
            এখনও কোনো ব্রডকাস্ট বার্তা পাঠানো হয়নি।
          </div>
        ) : (
          <div className="space-y-3">
            {broadcasts.map((bc) => (
              <div
                key={bc._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl space-y-3 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{bc.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      প্রেরণের সময়: {bc.sentAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-700">
                      পরিধি: {bc.targetAudience === "all" ? "সমগ্র বাংলাদেশ" : bc.targetValue}
                    </span>
                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                      {bc.recipientsCount} জন প্রতিনিধি
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                  {bc.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBroadcasts}
      />
    </div>
  );
}
