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
    <header className="sticky top-0 z-30 h-16 flex items-center border-b border-white/50 bg-white/70 px-3 shadow-[0_10px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all md:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left: Hamburger + Search */}
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="relative rounded-2xl border border-white/60 bg-white/70 p-2 text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search Bar - Hide on very small mobile */}
          <div className="hidden flex-1 items-center sm:flex">
            <div className="relative w-full max-w-lg">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search products, customers..."
                className="w-full rounded-2xl border border-white/60 bg-white/90 py-2.5 pl-11 pr-4 text-sm text-gray-700 shadow-inner shadow-blue-100/50 transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button className="rounded-2xl border border-white/60 bg-white/80 p-2 text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-gray-900 sm:hidden">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Icon - Smaller on mobile */}
          <button className="relative rounded-2xl border border-white/60 bg-white/80 p-2 text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-gray-900">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute top-1 right-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          </button>

          {/* Backup Button - Hide text on mobile */}
          <Button
            onClick={handleBackup}
            size="sm"
            className="gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Backup</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
