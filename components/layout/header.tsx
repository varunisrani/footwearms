'use client';

import { Bell, Download, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backupService } from '@/lib/services/storage.service';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const handleBackup = () => {
    backupService.downloadBackup();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/60 backdrop-blur">
      <div className="flex min-h-[72px] w-full items-center justify-between gap-3 px-3 py-3 md:gap-6 md:px-8">
        {/* Left: Navigation + Search */}
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden rounded-2xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden flex-1 items-center gap-3 sm:flex">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Search products, customers, or orders"
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-10 py-2 text-sm text-white placeholder:text-white/70 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              />
              <kbd className="absolute right-3 top-1/2 hidden h-6 -translate-y-1/2 items-center rounded-md border border-white/20 bg-white/10 px-2 text-[11px] font-semibold text-white/80 lg:flex">
                ⌘K
              </kbd>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 lg:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Fulfillment hall live
            </div>
          </div>

          <button className="sm:hidden rounded-2xl border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Open search">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="relative rounded-2xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Notifications">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <Button
            variant="primary"
            size="sm"
            className="rounded-2xl border border-white/20 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-600 hover:to-blue-700 md:hidden"
            onClick={handleBackup}
            aria-label="Backup data"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="hidden gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-600 hover:to-blue-700 md:inline-flex"
            onClick={handleBackup}
          >
            <Download className="h-4 w-4" />
            Backup Data
          </Button>

          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold">
              HA
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Hall Admin</p>
              <p className="text-xs text-white/70">Central floor</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
