"use client";

import { useState, useEffect } from "react";
import { X, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MockMaintenance } from "@/lib/store";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: { _id: string; name: string }[];
  ticketToEdit?: MockMaintenance | null;
  onSuccess: () => void;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  clients,
  ticketToEdit,
  onSuccess,
}: MaintenanceModalProps) {
  const [clientId, setClientId] = useState(ticketToEdit?.clientId || (clients[0]?._id ?? ""));
  const [issueTitle, setIssueTitle] = useState(ticketToEdit?.issueTitle || "");
  const [description, setDescription] = useState(ticketToEdit?.description || "");
  const [severity, setSeverity] = useState<"low" | "medium" | "critical">(
    ticketToEdit?.severity || "medium"
  );
  const [status, setStatus] = useState<"pending" | "in_progress" | "resolved">(
    ticketToEdit?.status || "pending"
  );
  const [solutionNotes, setSolutionNotes] = useState(ticketToEdit?.solutionNotes || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticketToEdit) {
      setClientId(ticketToEdit.clientId);
      setIssueTitle(ticketToEdit.issueTitle);
      setDescription(ticketToEdit.description || "");
      setSeverity(ticketToEdit.severity);
      setStatus(ticketToEdit.status);
      setSolutionNotes(ticketToEdit.solutionNotes || "");
    } else {
      if (clients.length > 0 && !clientId) {
        setClientId(clients[0]._id);
      }
    }
  }, [isOpen, ticketToEdit, clients, clientId]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedClient = clients.find((c) => c._id === clientId);

      if (ticketToEdit) {
        // PUT update
        await fetch("/api/maintenance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: ticketToEdit._id,
            status,
            solutionNotes,
          }),
        });
      } else {
        // POST create
        await fetch("/api/maintenance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            clientName: selectedClient?.name || "Client App",
            issueTitle,
            description,
            severity,
          }),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {ticketToEdit ? "ইস্যু সমাধান ও হিস্ট্রি আপডেট" : "নতুন সাপোর্ট টিকিট তৈরি"}
              </h2>
              <p className="text-xs text-slate-400">সমস্যা রিপোর্ট ও সমাধানের রেকর্ড রাখা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {!ticketToEdit && (
            <div>
              <label className="block text-slate-300 mb-1 font-medium">ক্লায়েন্ট নির্বাচন করুন *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              >
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">সমস্যার শিরোনাম *</label>
            <input
              type="text"
              required
              disabled={!!ticketToEdit}
              placeholder="যেমন: ডাটাবেজ কানেকশন ইরর / ওটিপি এসএমএস যাচ্ছে না"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">সমস্যার বিস্তারিত বিবরণ</label>
            <textarea
              rows={3}
              disabled={!!ticketToEdit}
              placeholder="কী সমস্যা হচ্ছে, কোন পেজে সমস্যা..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">জরুরী মাত্রা (Severity)</label>
              <select
                value={severity}
                disabled={!!ticketToEdit}
                onChange={(e) => setSeverity(e.target.value as "low" | "medium" | "critical")}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white disabled:opacity-60"
              >
                <option value="low">Low (সাধারণ)</option>
                <option value="medium">Medium (মাঝারি)</option>
                <option value="critical">Critical (জরুরী)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">বর্তমান অবস্থা (Status)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "pending" | "in_progress" | "resolved")}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="pending">Pending (অপেক্ষমান)</option>
                <option value="in_progress">In Progress (কাজ চলছে)</option>
                <option value="resolved">Resolved (সমাধান হয়েছে)</option>
              </select>
            </div>
          </div>

          {/* Solution notes */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
            <label className="block font-bold text-emerald-400">
              🛠️ সমাধানের বিবরণ ও সলিউশন নোট (ভবিষ্যতের রেফারেন্স)
            </label>
            <textarea
              rows={3}
              placeholder="কীভাবে সমস্যাটি সমাধান করলেন? (যেমন: ENV ফাইলে ক্লাউডিনারি সিক্রেট আপডেট করা হয়েছে বা কোডে রিট্রাই লজিক দেওয়া হয়েছে)..."
              value={solutionNotes}
              onChange={(e) => setSolutionNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
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
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{loading ? "সংরক্ষণ..." : "সেভ করুন"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
