"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { MockPayment } from "@/lib/store";
import InvoiceModal from "@/components/InvoiceModal";

export default function BillingPage() {
  const [payments, setPayments] = useState<MockPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<MockPayment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      const json = await res.json();
      if (json.success) {
        setPayments(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const totalContract = payments.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalDue = payments.reduce((acc, p) => acc + p.dueAmount, 0);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !selectedStatus || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-purple-400" />
            বিলিং, ইনভয়েসিং ও কিস্তি ট্র্যাকিং
          </h1>
          <p className="text-xs text-slate-400">
            কারা টাকা পরিশোধ করেছে, কারা করে নাই তার বিস্তারিত হিসাব ও রিসিট জেনারেটর
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">মোট চুক্তি মূল্য</p>
          <p className="text-2xl font-bold text-white mt-1">৳{totalContract.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">সর্বমোট সম্পাদিত প্রজেক্ট ভ্যালু</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 backdrop-blur-xl">
          <p className="text-xs font-medium text-emerald-400">মোট পরিশোধিত অর্থ (Paid)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">৳{totalPaid.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-300/80 mt-1">আদায়কৃত ক্যাশ/বিকাশ/ব্যাংক পেমেন্ট</p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 backdrop-blur-xl">
          <p className="text-xs font-medium text-rose-400">অবশিষ্ট বকেয়া (Total Due)</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">৳{totalDue.toLocaleString()}</p>
          <p className="text-[11px] text-rose-300/80 mt-1">গ্রাহকদের কাছে পাওনা অর্থ</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="ক্লায়েন্ট বা ইনভয়েস নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="">সকল পেমেন্ট স্ট্যাটাস</option>
              <option value="paid">পরিশোধিত (Paid)</option>
              <option value="partial">আংশিক বকেয়া (Partial)</option>
              <option value="unpaid">সম্পূর্ণ বকেয়া (Unpaid)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">ইনভয়েস নং</th>
                <th className="py-3.5 px-4">ক্লায়েন্ট / প্রতিষ্ঠান</th>
                <th className="py-3.5 px-4 text-right">চুক্তি মূল্য</th>
                <th className="py-3.5 px-4 text-right">পরিশোধিত</th>
                <th className="py-3.5 px-4 text-right">অবশিষ্ট বকেয়া</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-center">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো বিলিং রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{p.clientName}</p>
                      <p className="text-[10px] text-slate-400">তারিখ: {p.createdAt ? p.createdAt.split("T")[0] : "2026-03-01"}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-white">
                      ৳{p.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      ৳{p.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">
                      ৳{p.dueAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          p.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : p.status === "partial"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {p.status === "paid" ? "পরিশোধিত" : p.status === "partial" ? "আংশিক" : "বকেয়া"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
                      >
                        <Printer className="h-3 w-3 text-purple-400" />
                        <span>ইনভয়েস / পেমেন্ট</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        payment={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPaymentUpdated={fetchPayments}
      />
    </div>
  );
}
