'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Factory,
  TrendingUp,
  Settings,
  Boxes,
  BarChart3,
  Receipt,
  X,
  Bot,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Manufacturers', href: '/manufacturers', icon: Factory },
  { name: 'Inventory', href: '/inventory', icon: Boxes },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Sales', href: '/sales', icon: TrendingUp },
  { name: 'Invoices', href: '/billing/invoices', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'AI Agent', href: '/ai-agent', icon: Bot },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950/95 text-white shadow-2xl shadow-slate-900/60 transition-transform duration-300 ease-in-out backdrop-blur-xl md:static',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Footwear</p>
            <h1 className="text-xl font-semibold text-white">Management</h1>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-white/70 transition hover:bg-white/10 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/10 text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'mr-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all',
                    isActive ? 'bg-white/20 text-white' : 'text-slate-300 group-hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.name}
                {isActive && (
                  <span className="absolute right-3 h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shadow-[0_0_12px_rgba(14,165,233,0.85)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 px-4 py-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-xs text-white/70 shadow-inner shadow-black/20">
            v2.0.0 · Phase 3 & 4
          </div>
        </div>
      </div>
    </>
  );
}
