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
  FileText,
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Base styles
          'fixed md:static inset-y-0 left-0 z-50',
          'w-64 bg-gray-900 text-white',
          'flex flex-col transition-transform duration-300 ease-in-out',

          // Mobile: slide in/out
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 bg-gray-800">
          <h1 className="text-xl font-bold text-white">FootwearMS</h1>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 text-center">
            v2.0.0 - Phase 3 & 4
          </p>
        </div>
      </div>
    </>
  );
}
