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
              <option value="Restaurant & Food">Restaurant & Food</option>
              <option value="Custom Web App">Custom Web App</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="active">Active (লাইভ)</option>
              <option value="in_progress">In Progress (চলমান)</option>
              <option value="maintenance">Maintenance (মেইনটেন্যান্স)</option>
              <option value="suspended">Suspended (স্থগিত)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientPayment = payments.find((p) => p.clientId === client._id);
            return (
              <div
                key={client._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold mb-1.5 ${
                          client.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : client.status === "in_progress"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {client.status === "active" ? "লাইভ অ্যাপ" : client.status === "in_progress" ? "কাজ চলছে" : "মেইনটেন্যান্স"}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {client.name}
                      </h3>
                      <p className="text-xs text-slate-400">{client.ownerName}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(client._id, client.name)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* App Type & Location */}
                  <div className="rounded-xl bg-slate-950 p-3 text-xs space-y-1.5 border border-slate-800/80">
                    <div className="flex justify-between text-slate-400">
                      <span>অ্যাপের ধরণ:</span>
                      <span className="font-semibold text-slate-200">{client.appType}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>ঠিকানা:</span>
                      <span className="text-slate-200">
                        {client.upazila}, {client.district}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>যোগাযোগ:</span>
                      <span className="font-mono text-slate-300">{client.phone}</span>
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="space-y-1.5 text-xs">
                    <a
                      href={client.vercelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg bg-sky-500/10 border border-sky-500/20 p-2 text-sky-300 hover:bg-sky-500/20 transition"
                    >
                      <span className="truncate max-w-[200px] text-[11px] font-mono">
                        {client.vercelUrl}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>

                    {client.customDomain && (
                      <a
                        href={client.customDomain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2 text-indigo-300 hover:bg-indigo-500/20 transition"
                      >
                        <span className="truncate max-w-[200px] text-[11px] font-mono flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {client.customDomain}
                        </span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      পরিশোধিত: <strong className="text-emerald-400">৳{clientPayment?.paidAmount || 0}</strong>
                    </span>
                    <span className="text-slate-400">
                      বকেয়া:{" "}
                      <strong className={clientPayment?.dueAmount ? "text-rose-400" : "text-slate-400"}>
                        ৳{clientPayment?.dueAmount || 0}
                      </strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setVaultTarget({ id: client._id, name: client.name })}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>ভল্ট (AES)</span>
                    </button>

                    <button
                      onClick={() => {
                        const pay = payments.find((p) => p.clientId === client._id);
                        if (pay) setInvoiceTarget(pay);
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 font-semibold text-purple-300 hover:bg-purple-500/20 transition"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>ইনভয়েস</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
