"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ClientModal from "@/components/ClientModal";
import RepModal from "@/components/RepModal";
import BroadcastModal from "@/components/BroadcastModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newRepOpen, setNewRepOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  function handleSuccess() {
    window.location.reload();
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
