"use client";

import { useState } from "react";
import { X, Megaphone, Send, MessageSquare, ExternalLink, Check } from "lucide-react";
import { DIVISIONS, BANGLADESH_DISTRICTS } from "@/lib/bangladesh-data";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RecipientLink {
  name: string;
  district: string;
  phone: string;
  whatsapp: string;
  directUrl: string;
}

export default function BroadcastModal({ isOpen, onClose, onSuccess }: BroadcastModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState<"all" | "division" | "district">("all");
  const [targetValue, setTargetValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<RecipientLink[]>([]);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          targetAudience,
          targetValue,
          channel: "whatsapp",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSentSuccess(true);
        setRecipients(json.recipients || []);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                প্রতিনিধি ব্রডকাস্ট ও হোয়াটসঅ্যাপ বার্তা
              </h2>
              <p className="text-slate-400">
                একসাথে সকল জেলা/উপজেলা প্রতিনিধিদের নির্দেশনা ও অফার প্রেরণ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!sentSuccess ? (
          <form onSubmit={handleSend} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">বার্তা প্রেরণের পরিধি *</label>
                <select
                  value={targetAudience}
                  onChange={(e) => {
                    setTargetAudience(e.target.value as "all" | "division" | "district");
                    setTargetValue("");
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                >
                  <option value="all">📢 সমগ্র বাংলাদেশ (সকল জেলা ও উপজেলা)</option>
                  <option value="division">নির্দিষ্ট বিভাগ</option>
                  <option value="district">নির্দিষ্ট জেলা</option>
                </select>
              </div>

              {targetAudience === "division" && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">বিভাগ নির্বাচন করুন</label>
                  <select
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="">নির্বাচন করুন...</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {targetAudience === "district" && (
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">জেলা নির্বাচন করুন</label>
                  <select
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="">নির্বাচন করুন...</option>
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} ({d.bnName})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">বার্তার বিষয় / নোটিশ শিরোনাম *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">নির্দেশনা বা বার্তার মূল বক্তব্য *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                বার্তার শেষে স্বয়ংক্রিয়ভাবে আপনার স্বাক্ষর &quot;আওলাদ হোসেন, Aulad IT Solution&quot; যুক্ত হবে।
              </p>
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
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? "প্রক্রিয়াকরণ..." : "হোয়াটসঅ্যাপ ব্রডকাস্ট তৈরি করুন"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-300 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                ব্রডকাস্ট তৈরি হয়েছে! ({recipients.length} জন প্রতিনিধির জন্য)
              </span>
              <button
                onClick={() => setSentSuccess(false)}
                className="text-[11px] underline text-emerald-400"
              >
                নতুন বার্তা লিখুন
              </button>
            </div>

            <p className="text-slate-300 text-xs">
              নিচের প্রতিনিধিদের নামের পাশের বোতামে ক্লিক করে এক ক্লিকে হোয়াটসঅ্যাপে বার্তাটি পাঠিয়ে দিন:
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {recipients.map((rep, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <p className="font-bold text-white text-xs">{rep.name}</p>
                    <p className="text-[11px] text-slate-400">
                      জেলা: {rep.district} | ফোন: {rep.phone}
                    </p>
                  </div>

                  <a
                    href={rep.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpenedIndex(index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      openedIndex === index
                        ? "bg-slate-800 text-slate-400 border border-slate-700"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{openedIndex === index ? "পাঠানো হয়েছে" : "হোয়াটসঅ্যাপে পাঠান"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-medium text-white hover:bg-slate-700"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
