"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  KeyRound,
  CreditCard,
  Wrench,
  Users2,
  Megaphone,
  Settings,
  ShieldCheck,
  Globe2,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/clients", label: "ক্লায়েন্ট ও প্রজেক্ট", icon: Building2 },
  { href: "/vault", label: "সিকিউর ভল্ট", icon: KeyRound},
  { href: "/billing", label: "বিলিং ও পেমেন্ট", icon: CreditCard },
  { href: "/maintenance", label: "মেইনটেন্যান্স লগ", icon: Wrench },
  { href: "/representatives", label: "প্রতিনিধি নেটওয়ার্ক", icon: Users2},
  { href: "/broadcast", label: "ব্রডকাস্ট ও বার্তা", icon: Megaphone },
  { href: "/settings", label: "সেটিংস ও কনফিগ", icon: Settings },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <ShieldCheck className="h-6 w-6 text-white" />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Aulad IT Solution
                  <span className="inline-flex items-center rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 ring-1 ring-inset ring-sky-500/20">
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Client & Business Portal</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-900/80 p-2.5 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5 text-sky-400" />
                <a
                  href="https://itsolution.auladhossen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-slate-300 hover:text-sky-400 transition truncate max-w-[150px]"
                >
                  itsolution.auladhossen.com
                </a>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              মেইন মেন্যু
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                      ? "bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/10 text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${isActive
                          ? "text-sky-400"
                          : "text-slate-400 group-hover:text-slate-200"
                        }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700/50">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-sky-400" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Authenticated User / Admin Footer Info */}
          <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-sky-500/40 shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow">
                    {user?.displayName?.substring(0, 2).toUpperCase() || "AH"}
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.displayName || "Md. Aulad Hossen"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || "aulad@itsolution.com"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                title="লগআউট"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Sparkles className="h-3 w-3" />
                {user?.isDemo ? "ডেমো অ্যাডমিন" : "Firebase সেশন"}
              </span>
              <span>Next.js 16</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
