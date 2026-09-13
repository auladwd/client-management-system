"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  BookOpen,
} from "lucide-react";
import { MockMaintenance, MockClient } from "@/lib/store";
import MaintenanceModal from "@/components/MaintenanceModal";

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<MockMaintenance[]>([]);
  const [clients, setClients] = useState<MockClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<MockMaintenance | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch("/api/maintenance"),
        fetch("/api/clients"),
      ]);
      const [tJson, cJson] = await Promise.all([tRes.json(), cRes.json()]);
      if (tJson.success) setTickets(tJson.data || []);
      if (cJson.success) setClients(cJson.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.solutionNotes && t.solutionNotes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Wrench className="h-6 w-6 text-amber-400" />
            মেইনটেন্যান্স ও বাগ সলিউশন হিস্ট্রি
          </h1>
          <p className="text-xs text-slate-400">
            ক্লায়েন্ট অ্যাপের যেকোনো সমস্যা সমাধান করা এবং ভবিষ্যতে দ্রুত সমাধানের জন্য হিস্ট্রি সংরক্ষণ
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTicket(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:opacity-90 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন সমস্যা রিপোর্ট করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="সমস্যার শিরোনাম বা সলিউশন নোট দিয়ে সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান (Pending)</option>
              <option value="in_progress">চলমান (In Progress)</option>
              <option value="resolved">সমাধান হয়েছে (Resolved)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">টিকেট লোড হচ্ছে...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">কোনো সাপোর্ট রেকর্ড পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">নতুন সমস্যা হলে উপরে বোতামে ক্লিক করে রিপোর্ট করুন।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl hover:border-slate-700 transition space-y-3 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                      t.severity === "critical"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : t.severity === "medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    }`}
                  >
                    {t.severity}
                  </span>
                  <h3 className="text-sm font-bold text-white">{t.issueTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      t.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : t.status === "in_progress"
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {t.status === "resolved" ? "✓ সমাধান হয়েছে" : t.status === "in_progress" ? "কাজ চলছে" : "অপেক্ষমান"}
                  </span>

                  <button
                    onClick={() => {
                      setEditingTicket(t);
                      setModalOpen(true);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    আপডেট / সমাধান লিখুন
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>ক্লায়েন্ট: <strong className="text-white">{t.clientName}</strong></span>
                  <span>•</span>
                  <span>রিপোর্ট তারিখ: {t.reportedAt}</span>
                  {t.resolvedAt && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">সমাধান তারিখ: {t.resolvedAt}</span>
                    </>
                  )}
                </div>

                {t.description && (
                  <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    {t.description}
                  </p>
                )}

                {t.solutionNotes ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs space-y-1">
                    <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      কীভাবে সমাধান করা হলো (Solution Knowledge Note):
                    </p>
                    <p className="text-slate-200 leading-relaxed font-sans">{t.solutionNotes}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-400/80 italic">
                    এখনও কোনো সমাধান নোট যুক্ত করা হয়নি। সমাধান শেষে নোট লিখে রাখুন।
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTicket(null);
        }}
        clients={clients}
        ticketToEdit={editingTicket}
        onSuccess={fetchData}
      />
    </div>
  );
}
