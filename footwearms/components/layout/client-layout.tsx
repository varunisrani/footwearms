'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { ThemeProvider } from '@/lib/contexts/theme-context';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        {/* Sidebar - stays dark in both themes */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card-background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}
