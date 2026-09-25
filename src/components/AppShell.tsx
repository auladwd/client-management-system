"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ClientModal from "@/components/ClientModal";
import RepModal from "@/components/RepModal";
import BroadcastModal from "@/components/BroadcastModal";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newRepOpen, setNewRepOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  function handleSuccess() {
    window.location.reload();
  }

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/login");
    }
  }, [loading, user, isLoginPage, router]);

  // If on login page, render full screen without dashboard shell
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 ring-1 ring-white/20 animate-pulse">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Aulad IT Solution</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
              <span>নিরাপত্তা যাচাই ও সেশন লোড হচ্ছে...</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in and not on login page: wait for redirect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (offset by 72 = 18rem on desktop) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onOpenNewClient={() => setNewClientOpen(true)}
          onOpenNewRep={() => setNewRepOpen(true)}
          onOpenBroadcast={() => setBroadcastOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <ClientModal
        isOpen={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        onSuccess={handleSuccess}
      />

      <RepModal
        isOpen={newRepOpen}
        onClose={() => setNewRepOpen(false)}
        onSuccess={handleSuccess}
      />

      <BroadcastModal
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
