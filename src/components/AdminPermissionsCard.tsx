"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  XCircle,
  Crown,
  Mail,
  User,
  Tag,
  FileText,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth, SUPER_ADMIN_EMAIL } from "@/context/AuthContext";

interface AllowedUserItem {
  _id: string;
  email: string;
  name?: string;
  role: "superadmin" | "admin" | "manager" | "viewer";
  status: "active" | "inactive";
  addedBy: string;
  notes?: string;
  createdAt: string;
}

export default function AdminPermissionsCard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AllowedUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New User Form State
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "manager" | "viewer">("admin");
  const [newNotes, setNewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load allowed users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setActionSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          role: newRole,
          notes: newNotes,
          addedBy: user?.email || SUPER_ADMIN_EMAIL,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "অনুমতি যুক্ত করতে সমস্যা হয়েছে");
      }

      setActionSuccess(`সফল! ${newEmail} কে পোর্টালে প্রবেশের অনুমতি দেওয়া হয়েছে।`);
      setNewEmail("");
      setNewName("");
      setNewNotes("");
      setIsAddModalOpen(false);
      await fetchUsers();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setFormError(err.message || "ত্রুটি হয়েছে");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(item: AllowedUserItem) {
    const nextStatus = item.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item._id,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  }

  async function handleDelete(item: AllowedUserItem) {
    if (
      !confirm(
        `আপনি কি নিশ্চিত যে (${item.email}) এর পোর্টালে প্রবেশের অনুমতি বাতিল করতে চান?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${item._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`(${item.email}) এর অনুমতি বাতিল করা হয়েছে।`);
        await fetchUsers();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>ইউজার পারমিশন ও অনুমোদিত ইমেইল তালিকা</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                হোয়াইটলিস্ট সিকিউরিটি
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              শুধুমাত্র এখানে অনুমোদিত ইমেইলগুলোই পোর্টালে লগইন করতে পারবে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            <span>নতুন ইমেইল অনুমতি দিন</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Primary Super Admin Card */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{SUPER_ADMIN_EMAIL}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                মাস্টার সুপার এডমিন
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Md. Aulad Hossen • স্থায়ী ও সর্বোচ্চ অধিকারপ্রাপ্ত • অপসারণযোগ্য নয়
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="h-4 w-4" />
          <span>সর্বদা সক্রিয়</span>
        </div>
      </div>

      {/* Allowed Users List Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>অনুমোদিত অন্যান্য ইউজার ({users.length})</span>
          <span>স্ট্যাটাস ও নিয়ন্ত্রণ</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
            <span>অনুমোদিত তালিকা লোড হচ্ছে...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400 space-y-1">
            <p className="text-slate-300 font-medium">এখনও কোনো অতিরিক্ত ইউজারকে অনুমতি দেওয়া হয়নি।</p>
            <p className="text-slate-400">
              শুধুমাত্র মাস্টার সুপার এডমিন ({SUPER_ADMIN_EMAIL}) বর্তমানে প্রবেশ করতে পারবেন। প্রয়োজন হলে নতুন ইমেইল যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            {users.map((item) => (
              <div
                key={item._id}
                className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold shrink-0 mt-0.5">
                    {item.name ? item.name.substring(0, 2).toUpperCase() : item.email.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {item.email}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                        {item.role === "admin" ? "এডমিন" : item.role === "manager" ? "ম্যানেজার" : "ভিউয়ার"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.name && `${item.name} • `}যুক্ত করেছেন: {item.addedBy}
                      {item.notes && ` • “${item.notes}”`}
                    </p>
                  </div>
                </div>

                {/* Actions: Toggle Active & Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition border ${
                      item.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {item.status === "active" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>সক্রিয়</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>স্থগিত</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                    title="অনুমতি অপসারণ করুন"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-sky-400" />
                <span>নতুন ইউজারকে প্রবেশের অনুমতি দিন</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  অনুমোদিত ইমেইল এড্রেস (Google / Firebase) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  এই ইমেইলটি দিয়ে Google Sign-In বা Password লগইন করা যাবে।
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  ইউজারের নাম (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tanvir Ahmed"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">রোল ও অধিকার</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3 py-2 text-white focus:border-sky-500 focus:outline-none"
                  >
                    <option value="admin">এডমিন (সম্পূর্ণ এক্সেস)</option>
                    <option value="manager">ম্যানেজার (ক্লায়েন্ট ও বিলিং পরিচালনা)</option>
                    <option value="viewer">ভিউয়ার (শুধুমাত্র দেখার অনুমতি)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">মন্তব্য বা নোট (ঐচ্ছিক)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="অফিস সাপোর্ট টিম মেম্বার"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:opacity-95 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  <span>অনুমতি নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
