"use client";

import { useState } from "react";
import { X, Printer, Plus, CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";
import { MockPayment } from "@/lib/store";

interface InvoiceModalProps {
  payment: MockPayment | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentUpdated: () => void;
}

export default function InvoiceModal({
  payment,
  isOpen,
  onClose,
  onPaymentUpdated,
}: InvoiceModalProps) {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bKash" | "Nagad" | "Rocket" | "Bank" | "Cash">("bKash");
  const [trxId, setTrxId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !payment) return null;

  async function handleAddInstallment(e: React.FormEvent) {
    e.preventDefault();
    if (!payment) return;
    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: payment.clientId,
          clientName: payment.clientName,
          installment: {
            amount: Number(amount),
            method,
            trxId,
            note,
            date: new Date().toISOString().split("T")[0],
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setShowAddPayment(false);
        setAmount("");
        setTrxId("");
        setNote("");
        onPaymentUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Top Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              ইনভয়েস নং: {payment.invoiceNumber}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                payment.status === "paid"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : payment.status === "partial"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {payment.status === "paid" ? "পরিশোধিত" : payment.status === "partial" ? "আংশিক বকেয়া" : "অপরিশোধিত"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddPayment(!showAddPayment)}
              className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>পেমেন্ট যোগ করুন</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>প্রিন্ট / PDF সেভ</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add Payment Form (Conditional) */}
        {showAddPayment && (
          <form
            onSubmit={handleAddInstallment}
            className="no-print mb-4 rounded-xl border border-sky-500/30 bg-slate-950 p-4 space-y-3"
          >
            <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" /> নতুন পেমেন্ট / কিস্তি গ্রহণ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">টাকার পরিমাণ *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">পদ্ধতি</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as "bKash" | "Nagad" | "Rocket" | "Bank" | "Cash")}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                  <option value="Bank">Bank (ব্যাংক)</option>
                  <option value="Cash">Cash (ক্যাশ)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400">ট্রানজেকশন আইডি</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">নোট</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPayment(false)}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-sky-500 px-4 py-1 text-xs font-semibold text-white hover:bg-sky-400"
              >
                {loading ? "সংরক্ষণ..." : "পেমেন্ট রেকর্ড করুন"}
              </button>
            </div>
          </form>
        )}

        {/* PRINTABLE INVOICE CONTAINER */}
        <div className="invoice-box rounded-2xl bg-slate-950 p-6 sm:p-8 border border-slate-800">
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  Aulad IT Solution
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                ওয়েব অ্যাপ্লিকেশন ও আইটি সলিউশন সার্ভিস
              </p>
              <p className="text-xs text-sky-400 font-medium">
                https://itsolution.auladhossen.com
              </p>
              <p className="text-[11px] text-slate-400">
                স্বত্বাধিকারী: মোঃ আওলাদ হোসেন | ফোন: 01700000000
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-200">
                মানি রিসিট ও ইনভয়েস
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ইনভয়েস নং: <span className="font-mono text-white font-semibold">{payment.invoiceNumber}</span>
              </p>
              <p className="text-xs text-slate-400">
                তারিখ: {new Date(payment.createdAt).toLocaleDateString("bn-BD")}
              </p>
              {payment.dueDate && (
                <p className="text-xs text-amber-400 font-medium mt-0.5">
                  বকেয়া পরিশোধের শেষ তারিখ: {payment.dueDate}
                </p>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className="mt-6 rounded-xl bg-slate-900/60 p-4 border border-slate-800/80">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              বিল প্রাপক / ক্লায়েন্ট
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-bold text-white text-sm">{payment.clientName}</p>
                <p className="text-slate-400">গ্রাহক আইডি: {payment.clientId}</p>
              </div>
              <div className="sm:text-right text-slate-300">
                <p className="text-slate-400">পরিষেবার ধরণ: সম্পূর্ণ ওয়েব অ্যাপ্লিকেশন ও ক্লাউড ডেপ্লয়মেন্ট</p>
              </div>
            </div>
          </div>

          {/* Service Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">সেবা / কাজের বিবরণ</th>
                  <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-right">মূল্য (টাকা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                <tr>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">কমপ্লিট কাস্টমাইজড ওয়েব অ্যাপ্লিকেশন ও পোর্টাল</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Next.js, MongoDB Atlas ক্লাস্টার সেটআপ, Firebase Google Auth, Cloudinary ফাইল স্টোরেজ এবং Vercel প্রোডাকশন লাইভ হোস্টিং।
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center font-medium">১টি প্রজেক্ট</td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    ৳{payment.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-800">
            {/* Installments Breakdown */}
            <div className="w-full sm:w-1/2">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                পরিশোধিত কিস্তির বিবরণ
              </h4>
              {payment.installments && payment.installments.length > 0 ? (
                <div className="space-y-1.5">
                  {payment.installments.map((inst, idx) => (
                    <div
                      key={inst.id || idx}
                      className="flex items-center justify-between text-[11px] bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    >
                      <div>
                        <span className="font-semibold text-emerald-400">৳{inst.amount.toLocaleString()}</span>
                        <span className="text-slate-400 ml-2">({inst.method} - {inst.trxId || "N/A"})</span>
                      </div>
                      <span className="text-slate-400">{inst.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">এখনও কোনো পেমেন্ট রেকর্ড নেই</p>
              )}
            </div>

            {/* Calculations */}
            <div className="w-full sm:w-1/3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>মোট চুক্তি মূল্য:</span>
                <span className="font-semibold text-white">৳{payment.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>পরিশোধিত অর্থ:</span>
                <span>৳{payment.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold text-sm pt-2 border-t border-slate-800">
                <span>অবশিষ্ট বকেয়া:</span>
                <span>৳{payment.dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms & Authorized Signature */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-slate-400">
            <div>
              <p className="font-semibold text-slate-300 mb-1">নিয়ম ও শর্তাবলী:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>অ্যাপ্লিকেশনটি এককালীন সাশ্রয়ী নির্ধারিত মূল্যে প্রস্তুত করা হয়েছে।</li>
                <li>যেকোনো ত্রুটি বা সমস্যায় সার্বক্ষণিক টেকনিক্যাল সাপোর্ট প্রদান করা হবে।</li>
              </ul>
            </div>

            <div className="text-center sm:text-right">
              <div className="h-10"></div>
              <p className="border-t border-slate-700 pt-1 font-bold text-slate-200">
                আওলাদ হোসেন (স্বত্বাধিকারী)
              </p>
              <p className="text-[10px] text-slate-400">Aulad IT Solution, অনুমোদিত স্বাক্ষর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
