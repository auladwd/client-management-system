"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  KeyRound,
  CreditCard,
  Wrench,
  Globe,
  Trash2,
} from "lucide-react";
import { MockClient, MockPayment } from "@/lib/store";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-data";
import VaultModal from "@/components/VaultModal";
import InvoiceModal from "@/components/InvoiceModal";
import ClientModal from "@/components/ClientModal";

export default function ClientsPage() {
  const [clients, setClients] = useState<MockClient[]>([]);
  const [payments, setPayments] = useState<MockPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedAppType, setSelectedAppType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modals
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [vaultTarget, setVaultTarget] = useState<{ id: string; name: string } | null>(null);
  const [invoiceTarget, setInvoiceTarget] = useState<MockPayment | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/payments"),
      ]);
      const [cJson, pJson] = await Promise.all([cRes.json(), pRes.json()]);
      if (cJson.success) setClients(cJson.data);
      if (pJson.success) setPayments(pJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`আপনি কি সত্যিই "${name}" এর ক্লায়েন্ট ও অ্যাপ রেকর্ডটি মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchClients();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      !selectedDistrict || c.district.toLowerCase() === selectedDistrict.toLowerCase();

    const matchesType = !selectedAppType || c.appType === selectedAppType;
    const matchesStatus = !selectedStatus || c.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sky-400" />
            ক্লায়েন্ট ও প্রজেক্ট ম্যানেজমেন্ট
          </h1>
          <p className="text-xs text-slate-400">
            প্রতিটি অ্যাপের ডেপ্লয়মেন্ট হিস্ট্রি, ডেডিকেটেড সার্ভিস অ্যাকাউন্ট ও পেমেন্ট ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={() => setNewClientOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>নতুন ক্লায়েন্ট ও অ্যাপ যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, ফোন, মেইল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="">সকল জেলা (৬৪ জেলা)</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.bnName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedAppType}
              onChange={(e) => setSelectedAppType(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="">সকল অ্যাপ ক্যাটাগরি</option>
              <option value="School Management">School Management</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="POS & Inventory">POS & Inventory</option>
              <option value="Hospital & Diagnostic">Hospital & Diagnostic</option>
                           <option value="">সকল স্ট্যাটাস</option>
              <option value="active">লাইভ</option>
              <option value="in_progress">চলমান</option>
              <option value="maintenance">মেইনটেন্যান্স</option>
              <option value="suspended">স্থগিত</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Row-based Table */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">ক্লায়েন্ট তালিকা লোড হচ্ছে...</div>
      ) : filteredClients.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-2">
          <p className="text-sm font-semibold text-slate-300">কোনো ক্লায়েন্ট পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">
            ফিল্টার পরিবর্তন করুন অথবা নতুন ক্লায়েন্ট ও অ্যাপ যুক্ত করুন
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">প্রতিষ্ঠান ও ক্লায়েন্ট</th>
                  <th className="py-3.5 px-4 font-semibold">অ্যাপ ও স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 font-semibold">ঠিকানা ও যোগাযোগ</th>
                  <th className="py-3.5 px-4 font-semibold">লাইভ লিংক ও ডোমেইন</th>
                  <th className="py-3.5 px-4 font-semibold text-right">বিলিং ও পেমেন্ট</th>
                  <th className="py-3.5 px-4 font-semibold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClients.map((client) => {
                  const clientPayment = payments.find((p) => p.clientId === client._id);
                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* 1. Client & Owner */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-0.5">
                          <p className="font-bold text-white text-sm leading-tight group-hover:text-sky-300 transition">
                            {client.name}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {client.ownerName}
                          </p>
                          {client.assignedRepCode && (
                            <span className="inline-block mt-1 rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-mono text-purple-400 border border-purple-500/20">
                              রেফ: {client.assignedRepCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. App Type & Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                              client.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : client.status === "in_progress"
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {client.status === "active" ? "লাইভ অ্যাপ" : client.status === "in_progress" ? "কাজ চলছে" : "মেইনটেন্যান্স"}
                          </span>
                          <p className="text-[11px] text-slate-300 font-medium">
                            {client.appType}
                          </p>
                        </div>
                      </td>

                      {/* 3. Location & Phone */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-slate-200">
                            📍 {client.upazila}, {client.district}
                          </p>
                          <p className="font-mono text-slate-400 text-[11px]">
                            📞 {client.phone}
                          </p>
                        </div>
                      </td>

                      {/* 4. Live Links */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1 max-w-[220px]">
                          <a
                            href={client.vercelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:underline truncate max-w-full"
                            title={client.vercelUrl}
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{client.vercelUrl.replace("https://", "")}</span>
                          </a>
                          {client.customDomain && (
                            <a
                              href={client.customDomain}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline truncate max-w-full block"
                              title={client.customDomain}
                            >
                              <Globe className="h-3 w-3 shrink-0" />
                              <span className="truncate">{client.customDomain.replace("https://", "")}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 5. Billing */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-slate-300 text-[11px]">
                            পরিশোধিত: <strong className="text-emerald-400">৳{clientPayment?.paidAmount || 0}</strong>
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            বকেয়া:{" "}
                            <strong className={clientPayment?.dueAmount ? "text-rose-400" : "text-slate-400"}>
                              ৳{clientPayment?.dueAmount || 0}
                            </strong>
                          </p>
                        </div>
                      </td>

                      {/* 6. Actions */}
                      <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setVaultTarget({ id: client._id, name: client.name })}
                            className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                            title="সিকিউর ভল্ট দেখুন ও এডিট করুন"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            <span>ভল্ট</span>
                          </button>

                          <button
                            onClick={() => {
                              const pay = payments.find((p) => p.clientId === client._id);
                              if (pay) setInvoiceTarget(pay);
                            }}
                            className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition"
                            title="ইনভয়েস ও কিস্তি পেমেন্ট"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>ইনভয়েস</span>
                          </button>

                          <button
                            onClick={() => handleDelete(client._id, client.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <VaultModal
        clientId={vaultTarget?.id || null}
        clientName={vaultTarget?.name || ""}
        isOpen={!!vaultTarget}
        onClose={() => setVaultTarget(null)}
      />

      <InvoiceModal
        payment={invoiceTarget}
        isOpen={!!invoiceTarget}
        onClose={() => setInvoiceTarget(null)}
        onPaymentUpdated={fetchClients}
      />

      <ClientModal
        isOpen={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        onSuccess={fetchClients}
      />
    </div>
  );
}
