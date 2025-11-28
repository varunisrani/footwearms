'use client';

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="relative flex h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-200/30 via-purple-100/30 to-transparent opacity-60 blur-3xl"
          aria-hidden="true"
        />
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden bg-white/60 backdrop-blur-[18px] shadow-[0_25px_65px_-45px_rgba(15,23,42,0.85)]">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/80 via-white/70 to-transparent p-4 md:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 animate-fade-up">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
