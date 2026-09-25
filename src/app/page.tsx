"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  KeyRound,
  CreditCard,
  Wrench,
  Users2,
  Megaphone,
  ArrowUpRight,
  Sparkles,
  Search,
  Plus,
} from "lucide-react";
import { MockClient, MockPayment, MockMaintenance, MockRepresentative } from "@/lib/store";
import VaultModal from "@/components/VaultModal";
import InvoiceModal from "@/components/InvoiceModal";
import ClientModal from "@/components/ClientModal";

interface StatsData {
  totalClients: number;
  activeProjects: number;
  inProgressProjects: number;
  totalRevenue: number;
  totalDue: number;
  totalReps: number;
  openTickets: number;
  coverageCount: number;
  totalDistricts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [clients, setClients] = useState<MockClient[]>([]);
  const [payments, setPayments] = useState<MockPayment[]>([]);
  const [maintenance, setMaintenance] = useState<MockMaintenance[]>([]);
  const [reps, setReps] = useState<MockRepresentative[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedVaultClient, setSelectedVaultClient] = useState<{ id: string; name: string } | null>(null);
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState<MockPayment | null>(null);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [sRes, cRes, pRes, mRes, rRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/clients"),
        fetch("/api/payments"),
        fetch("/api/maintenance"),
        fetch("/api/representatives"),
      ]);

      const [sJson, cJson, pJson, mJson, rJson] = await Promise.all([
        sRes.json(),
        cRes.json(),
        pRes.json(),
        mRes.json(),
        rRes.json(),
      ]);

      if (sJson.success) setStats(sJson.data);
      if (cJson.success) setClients(cJson.data);
      if (pJson.success) setPayments(pJson.data);
      if (mJson.success) setMaintenance(mJson.data);
      if (rJson.success) setReps(rJson.data);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Aulad IT Solution ম্যানেজমেন্ট পোর্টাল v1.0</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              আসসালামু আলাইকুম, আওলাদ হোসেন!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              আপনার প্রতিষ্ঠানের সকল ক্লায়েন্টের Vercel সাইট, এনক্রিপ্টেড ডাটাবেজ/ফায়ারবেস ক্রেডেনশিয়াল, বকেয়া হিসাব এবং ৬৪ জেলার প্রতিনিধিদের এক জায়গা থেকে পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setNewClientModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন ক্লায়েন্ট ও ভল্ট</span>
            </button>
            <Link
              href="/broadcast"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <Megaphone className="h-4 w-4" />
              <span>ব্রডকাস্ট বার্তা</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Clients */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">মোট ক্লায়েন্ট</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {loading ? "..." : stats?.totalClients ?? 0}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {stats?.activeProjects ?? 0} টি লাইভ
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.inProgressProjects ?? 0} টি নির্মাণাধীন
          </p>
        </div>

        {/* Total Revenue */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">মোট সংগৃহীত অর্থ</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-400">
              ৳{loading ? "..." : (stats?.totalRevenue ?? 0).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">পরিশোধিত প্রজেক্ট মূল্য</p>
        </div>

        {/* Total Due */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">অবশিষ্ট বকেয়া</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-rose-400">
              ৳{loading ? "..." : (stats?.totalDue ?? 0).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-rose-400/80 mt-1">গ্রাহকদের কাছে পাওনা</p>
        </div>

        {/* Representatives & Coverage */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">প্রতিনিধি ও কাভারেজ</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-400">
              {loading ? "..." : stats?.totalReps ?? 0} জন
            </span>
            <span className="text-[11px] text-slate-400">
              ({stats?.coverageCount ?? 0}/64 জেলা)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">সক্রিয় সেলস পার্টনার</p>
        </div>
      </div>

      {/* Main Section: Client Directory with Instant Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-400" />
              সাম্প্রতিক ক্লায়েন্ট ও অ্যাপসমূহ
            </h2>
            <p className="text-xs text-slate-400">
              লাইভ অ্যাপ লিংক, সুরক্ষিত ভল্ট ও বিলিং অ্যাক্সেস
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="প্রতিষ্ঠান, জেলা বা ব্যক্তি খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <Link
              href="/clients"
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              <span>সব দেখুন</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Client Cards List */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.slice(0, 4).map((client) => {
            const clientPayment = payments.find((p) => p.clientId === client._id);
            return (
              <div
                key={client._id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {client.name}
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          client.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : client.status === "in_progress"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {client.status === "active" ? "লাইভ" : client.status === "in_progress" ? "চলমান" : "মেইনটেন্যান্স"}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {client.ownerName} • {client.phone}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      📍 {client.upazila}, {client.district} ({client.appType})
                    </p>
                  </div>

                  <a
                    href={client.vercelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 text-[11px] font-medium text-sky-400 hover:bg-sky-500/20 transition shrink-0"
                  >
                    <span>Vercel অ্যাপ</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Financial bar */}
                <div className="flex items-center justify-between text-[11px] bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span>
                      চুক্তি: <strong>৳{clientPayment?.totalAmount.toLocaleString() || 20000}</strong>
                    </span>
                    <span className="text-emerald-400">
                      পরিশোধিত: ৳{clientPayment?.paidAmount.toLocaleString() || 0}
                    </span>
                  </div>
                  <div>
                    <span className={clientPayment?.dueAmount ? "text-rose-400 font-semibold" : "text-slate-400"}>
                      বকেয়া: ৳{clientPayment?.dueAmount ? clientPayment.dueAmount.toLocaleString() : 0}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSelectedVaultClient({ id: client._id, name: client.name })
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>ভল্ট (AES-256)</span>
                    </button>

                    <button
                      onClick={() => {
                        const pay = payments.find((p) => p.clientId === client._id);
                        if (pay) setSelectedInvoicePayment(pay);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 transition"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-purple-400" />
                      <span>রিসিট ও ইনভয়েস</span>
                    </button>
                  </div>

                  <Link
                    href={`/maintenance?client=${client._id}`}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    <Wrench className="h-3 w-3" />
                    <span>সমস্যা রিপোর্ট</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Support Tickets & Representatives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Tickets & Maintenance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" />
              সাপোর্ট ও সমাধান লগ
            </h3>
            <Link
              href="/maintenance"
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>সকল টিকিট</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {maintenance.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.clientName}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.status === "resolved" ? "সমাধান হয়েছে" : "চলমান"}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{item.issueTitle}</p>
                {item.solutionNotes && (
                  <p className="text-[11px] text-emerald-400/90 bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10">
                    💡 সমাধান: {item.solutionNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Representatives Network Summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users2 className="h-4 w-4 text-purple-400" />
              জেলা ও উপজেলা প্রতিনিধি নেটওয়ার্ক
            </h3>
            <Link
              href="/representatives"
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>সকল প্রতিনিধি</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-3 space-y-2.5">
            {reps.slice(0, 3).map((rep) => (
              <div
                key={rep._id}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-white">{rep.name}</p>
                  <p className="text-[11px] text-slate-400">
                    জেলা: {rep.district} ({rep.upazila}) • কোড: {rep.repCode}
                  </p>
                  <p className="text-[10px] text-purple-400 font-medium">
                    মোট সেল: {rep.totalSalesCount} টি | কমিশন পাওনা: ৳{rep.commissionDue}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${rep.whatsapp}?text=${encodeURIComponent(
                    "আসসালামু আলাইকুম " + rep.name + " ভাই, Aulad IT Solution থেকে বলছি..."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-600/30 transition"
                >
                  <span>হোয়াটসঅ্যাপ</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vault Modal */}
      <VaultModal
        clientId={selectedVaultClient?.id || null}
        clientName={selectedVaultClient?.name || ""}
        isOpen={!!selectedVaultClient}
        onClose={() => setSelectedVaultClient(null)}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        payment={selectedInvoicePayment}
        isOpen={!!selectedInvoicePayment}
        onClose={() => setSelectedInvoicePayment(null)}
        onPaymentUpdated={loadDashboardData}
      />

      {/* Client Modal */}
      <ClientModal
        isOpen={newClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
}
