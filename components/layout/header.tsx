'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Bell,
  Download,
  Search,
  Menu,
  ChevronDown,
  PanelLeftOpen,
  Sparkles,
  Loader2,
  Bot,
  X,
} from 'lucide-react';
import { backupService } from '@/lib/services/storage.service';
import { cn } from '@/lib/utils/cn';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    description?: string;
    href: string;
  }>;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  {
    label: 'Inventory',
    href: '/inventory',
    children: [
      { label: 'Overview', href: '/inventory', description: 'Stock & KPIs' },
      { label: 'Alerts', href: '/inventory/alerts', description: 'Restock triggers' },
      { label: 'Adjustments', href: '/inventory/adjustments', description: 'Balance stock' },
      { label: 'New Adjustment', href: '/inventory/adjustments/new', description: 'Manual tweak' },
    ],
  },
  {
    label: 'Sales',
    href: '/sales',
    children: [
      { label: 'Overview', href: '/sales', description: 'Pipelines & metrics' },
      { label: 'New Sale', href: '/sales/new', description: 'Create invoice' },
    ],
  },
  {
    label: 'Customers',
    href: '/customers',
    children: [
      { label: 'Directory', href: '/customers', description: 'All contacts' },
      { label: 'Add Customer', href: '/customers/new', description: 'Create record' },
    ],
  },
  {
    label: 'Billing',
    href: '/billing/invoices',
    children: [
      { label: 'Invoices', href: '/billing/invoices', description: 'Track AR' },
      { label: 'New Invoice', href: '/billing/invoices/new', description: 'Send bill' },
      { label: 'Record Payment', href: '/billing/payments/record', description: 'Log payment' },
    ],
  },
  { label: 'Reports', href: '/reports' },
];

interface HeaderProps {
  onMenuClick: () => void;
  isScrolled?: boolean;
}

export function Header({ onMenuClick, isScrolled = false }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isBackingUp, setIsBackingUp] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeParent = useMemo(
    () =>
      navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname]
  );

  useEffect(() => {
    if (!activeParent?.label) {
      return;
    }

    setExpandedSections((prev) =>
      prev[activeParent.label]
        ? prev
        : {
            ...prev,
            [activeParent.label]: true,
          }
    );
  }, [activeParent?.label]);

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    setMobileNavOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const toggleMobileSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const closeOverlays = () => {
    setMobileNavOpen(false);
    setSearchOpen(false);
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      await backupService.downloadBackup();
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchOpen(true);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 900);
  };

  return (
    <div className="relative z-40 w-full">
      <header
        className={cn(
          'sticky top-0 inset-x-0 border-b transition-all duration-300 backdrop-blur',
          isScrolled
            ? 'bg-white/90 shadow-[0_4px_20px_rgba(15,23,42,0.08)] border-slate-200'
            : 'bg-white/70 border-transparent'
        )}
      >
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 md:hidden"
              aria-label="Open sidebar navigation"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                setMobileNavOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-blue-600"
            >
              FootwearMS
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive(item.href)
                        ? 'text-blue-600'
                        : 'text-slate-500 hover:text-slate-900'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-slate-400 transition group-hover:text-blue-500',
                          isActive(item.href) && 'text-blue-500'
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-blue-500 transition',
                        isActive(item.href) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </Link>

                  {item.children && (
                    <div className="pointer-events-none absolute left-0 top-full mt-3 w-64 rounded-2xl border border-slate-100 bg-white/95 p-2 text-sm text-slate-600 opacity-0 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-100',
                            isActive(child.href) && 'bg-blue-50 text-blue-700'
                          )}
                        >
                          <span className="font-medium text-slate-800">{child.label}</span>
                          {child.description && (
                            <span className="text-xs text-slate-500">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <form
              onSubmit={handleSearch}
              className="relative flex w-full max-w-md items-center"
            >
              <Search className="absolute left-4 h-4 w-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="search"
                placeholder="Search products, customers, invoices..."
                className="w-full rounded-full border border-slate-200 bg-white/80 py-2.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="absolute right-1 inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                {isSearching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Search</span>
                )}
              </button>
              <span className="sr-only" role="status">
                {isSearching ? 'Searching records' : 'Search ready'}
              </span>
            </form>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setSearchOpen((prev) => {
                  if (!prev) {
                    setMobileNavOpen(false);
                  }
                  return !prev;
                });
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 md:hidden"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/ai-agent"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:border-blue-300"
            >
              <Sparkles className="h-4 w-4" />
              AI Agent
            </Link>

            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-amber-400" />
            </button>

            <button
              onClick={handleBackup}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {isBackingUp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          'absolute left-0 right-0 top-16 origin-top border-b border-slate-100 bg-white/95 px-3 py-4 shadow-2xl transition duration-300 lg:hidden',
          mobileNavOpen
            ? 'pointer-events-auto scale-y-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-y-95 opacity-0'
        )}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="space-y-3">
          {navItems.map((item) => {
            const sectionOpen = expandedSections[item.label] ?? false;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white/90 p-3 shadow-sm transition hover:border-blue-100"
              >
                <button
                  type="button"
                  onClick={() =>
                    item.children ? toggleMobileSection(item.label) : closeOverlays()
                  }
                  className="flex w-full items-center justify-between text-left text-base font-semibold text-slate-900"
                >
                  <span>{item.label}</span>
                  {item.children ? (
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-slate-400 transition',
                        sectionOpen && 'rotate-180 text-blue-500'
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full transition',
                        isActive(item.href) ? 'bg-blue-500' : 'bg-slate-300'
                      )}
                    />
                  )}
                </button>

                {item.children ? (
                  <div
                    className={cn(
                      'mt-2 space-y-2 overflow-hidden text-sm text-slate-600 transition-all',
                      sectionOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeOverlays}
                        className={cn(
                          'block rounded-xl px-3 py-2 transition hover:bg-slate-100',
                          isActive(child.href) && 'bg-blue-50 text-blue-700'
                        )}
                      >
                        <div className="font-medium">{child.label}</div>
                        {child.description && (
                          <p className="text-xs text-slate-500">{child.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeOverlays}
                    className={cn(
                      'mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800',
                      isActive(item.href) && 'bg-blue-600'
                    )}
                  >
                    Go now
                  </Link>
                )}
              </div>
            );
          })}

          <Link
            href="/ai-agent"
            onClick={closeOverlays}
            className="flex items-center justify-between rounded-2xl border border-dashed border-blue-200 bg-blue-50/80 px-4 py-3 text-sm font-semibold text-blue-900"
          >
            <span>Talk with the AI Agent</span>
            <Bot className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          'absolute left-0 right-0 top-16 origin-top bg-white/95 px-3 py-3 shadow-2xl transition duration-300 md:hidden',
          searchOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            type="search"
            placeholder="Search anything..."
            className="w-full rounded-full border border-slate-200 bg-white/80 py-2.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="absolute right-1 inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            {isSearching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
