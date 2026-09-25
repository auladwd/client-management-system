"use client";

import { Menu, Plus, Lock, Database, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
  onOpenNewClient?: () => void;
  onOpenNewRep?: () => void;
  onOpenBroadcast?: () => void;
  title?: string;
  subtitle?: string;
}

export default function Header({
  onMenuClick,
  onOpenNewClient,
  onOpenNewRep,
  onOpenBroadcast,
  title = "ম্যানেজমেন্ট ড্যাশবোর্ড",
  subtitle = "Aulad IT Solution ক্লায়েন্ট, ক্রেডেনশিয়াল ও প্রতিনিধি পরিচালনা সিস্টেম",
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white lg:hidden transition"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Right: Status Badges, Action Buttons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Security Badge */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <Lock className="h-3.5 w-3.5" />
            <span>AES-256 Vault Active</span>
          </div>

          {/* Database Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400 border border-sky-500/20">
            <Database className="h-3.5 w-3.5" />
            <span>Atlas Ready</span>
          </div>

          {/* Quick Action Button Dropdown or Buttons */}
          {onOpenNewClient && (
            <button
              onClick={onOpenNewClient}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">নতুন ক্লায়েন্ট</span>
            </button>
          )}

          {onOpenNewRep && (
            <button
              onClick={onOpenNewRep}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
            >
              <Plus className="h-4 w-4" />
              <span>নতুন প্রতিনিধি</span>
            </button>
          )}

          {onOpenBroadcast && (
            <button
              onClick={onOpenBroadcast}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <span>📢 বার্তা</span>
            </button>
          )}

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-sky-500/30"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-[10px] font-bold">
                    {user.displayName?.substring(0, 2).toUpperCase() || "AH"}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {user.displayName || "অ্যাডমিন"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                title="লগআউট করুন"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
