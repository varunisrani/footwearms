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
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
  { name: 'Products', href: '/products', icon: Package, color: 'from-purple-500 to-purple-600' },
  { name: 'Manufacturers', href: '/manufacturers', icon: Factory, color: 'from-orange-500 to-orange-600' },
  { name: 'Inventory', href: '/inventory', icon: Boxes, color: 'from-cyan-500 to-cyan-600' },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart, color: 'from-pink-500 to-pink-600' },
  { name: 'Customers', href: '/customers', icon: Users, color: 'from-green-500 to-green-600' },
  { name: 'Sales', href: '/sales', icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
  { name: 'Invoices', href: '/billing/invoices', icon: Receipt, color: 'from-amber-500 to-amber-600' },
  { name: 'Reports', href: '/reports', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
  { name: 'AI Agent', href: '/ai-agent', icon: Bot, color: 'from-violet-500 to-violet-600', special: true },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'from-slate-500 to-slate-600' },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Base styles
          'fixed md:static inset-y-0 left-0 z-50',
          'w-72 md:w-64',
          'flex flex-col transition-all duration-300 ease-out',
          // Gradient background
          'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
          // Mobile: slide in/out
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-30" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">FootwearMS</h1>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Management System</p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <div className="mb-4">
            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Menu
            </p>
          </div>

          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  item.special && 'mt-4 border border-dashed border-violet-500/30'
                )}
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-blue-600" />
                )}

                {/* Icon with gradient background */}
                <div className={cn(
                  'relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg`
                    : 'bg-white/5 group-hover:bg-white/10'
                )}>
                  <Icon className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  )} />
                  {item.special && !isActive && (
                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 animate-pulse" />
                  )}
                </div>

                <span className={cn(
                  'flex-1 text-sm font-medium transition-colors',
                  isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                )}>
                  {item.name}
                </span>

                {/* Arrow indicator on hover */}
                <ChevronRight className={cn(
                  'w-4 h-4 transition-all duration-200',
                  isActive
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                )} />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400">System Online</span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">
              v2.1.0
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
