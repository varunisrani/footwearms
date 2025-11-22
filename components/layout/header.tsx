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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-3 md:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left: Hamburger + Search */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {/* Search Bar - Hide on very small mobile */}
          <div className="hidden sm:flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
            <Search className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Icon - Smaller on mobile */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Backup Button - Hide text on mobile */}
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Backup</span>
          </button>
        </div>
      </div>
    </header>
  );
}
