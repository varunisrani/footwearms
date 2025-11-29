'use client';

import { Bell, Download, Search, Menu, Command, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backupService } from '@/lib/services/storage.service';
import { useState } from 'react';
import { useTheme } from '@/lib/contexts/theme-context';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleBackup = () => {
    backupService.downloadBackup();
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-4 md:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left: Hamburger + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className={`relative w-full transition-all duration-200 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search products, customers..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`
                  w-full pl-10 pr-16 py-2.5
                  bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-xl
                  text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800
                  transition-all duration-200
                `}
              />
              {/* Keyboard shortcut indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
                <kbd className="flex items-center justify-center h-5 px-1.5 rounded bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  <Command className="w-2.5 h-2.5 mr-0.5" />K
                </kbd>
              </div>
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            )}
          </button>

          {/* Notification Button */}
          <button className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 group">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
            {/* Notification badge */}
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          {/* Backup Button */}
          <Button
            onClick={handleBackup}
            variant="primary"
            size="sm"
            className="hidden sm:flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Backup</span>
          </Button>

          {/* Mobile Backup Button (icon only) */}
          <button
            onClick={handleBackup}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 text-white" />
          </button>

          {/* User Avatar */}
          <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-slate-700">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">
                AU
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
