'use client';

import { useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { StatsCard } from '@/components/features/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/stores/app-store';
import { initializeDatabase } from '@/lib/services/storage.service';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

export default function Dashboard() {
  const {
    products,
    manufacturers,
    customers,
    sales,
    loadProducts,
    loadManufacturers,
    loadCustomers,
    loadSales,
  } = useAppStore();

  useEffect(() => {
    initializeDatabase();
    loadProducts();
    loadManufacturers();
    loadCustomers();
    loadSales();
  }, [loadProducts, loadManufacturers, loadCustomers, loadSales]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);

  const totalSales = sales.length;
  const confirmedSales = sales.filter((s) => s.status === 'confirmed').length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalAlerts = lowStockProducts.length;
  const lowStockPreview = lowStockProducts.slice(0, 5);

  const quickActions = [
    { label: 'Add Product', href: '/products/new', icon: Package, ariaLabel: 'Add a new product' },
    { label: 'New Sale', href: '/sales/new', icon: TrendingUp, ariaLabel: 'Create a new sale' },
    {
      label: 'New Purchase',
      href: '/purchases/new',
      icon: ShoppingCart,
      ariaLabel: 'Add a purchase order',
    },
    { label: 'Add Customer', href: '/customers/new', icon: Users, ariaLabel: 'Add a new customer' },
  ];

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      iconColor: 'text-blue-500',
      iconBgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Stock',
      value: totalStock,
      icon: ShoppingCart,
      iconColor: 'text-emerald-500',
      iconBgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Total Sales',
      value: totalSales,
      icon: TrendingUp,
      iconColor: 'text-purple-500',
      iconBgColor: 'bg-purple-500/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: Users,
      iconColor: 'text-amber-500',
      iconBgColor: 'bg-amber-500/10',
    },
  ];

  const heroHighlights = [
    {
      label: 'Active SKUs',
      value: totalProducts ? `${activeProducts}/${totalProducts}` : `${activeProducts}`,
      helper: 'Products live in catalog',
      icon: Package,
    },
    {
      label: 'Revenue (all time)',
      value: formatCurrency(totalRevenue),
      helper: 'Recorded sales volume',
      icon: TrendingUp,
    },
    {
      label: 'Confirmed Orders',
      value: confirmedSales,
      helper: 'Awaiting fulfillment',
      icon: ShieldCheck,
    },
    {
      label: 'Low Stock Alerts',
      value: totalAlerts,
      helper: 'Items needing restock',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 px-6 py-10 text-white md:px-12 md:py-14"
        aria-labelledby="hero-heading"
        data-animate
      >
        <div className="absolute inset-0 opacity-80" aria-hidden="true">
          <div className="hero-orb h-72 w-72 -top-14 -left-10 bg-fuchsia-400/60" />
          <div className="hero-orb h-64 w-64 bottom-0 right-12 bg-sky-300/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        </div>
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl space-y-6">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-wide backdrop-blur"
              aria-label="Footwear dashboard refresh"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Fresh look
            </span>
            <h1 id="hero-heading" className="animated-gradient-text text-3xl font-bold leading-tight md:text-5xl">
              Manage every pair with confidence and clarity.
            </h1>
            <p className="text-base text-white/80 md:text-lg">
              Keep inventory, purchasing, and sales perfectly in sync with a control center that feels
              as good as it performs. Spot issues early, collaborate faster, and scale operations with
              ease.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/products/new" aria-label="Create a new product" className="inline-flex">
                <Button variant="gradient" size="lg" className="gap-2 shadow-blue-900/20">
                  Get started
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reports" aria-label="Explore performance reports" className="inline-flex">
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  Explore reports
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroHighlights.map((highlight, index) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-white/40 bg-white/10 p-4 backdrop-blur-xl"
                data-animate
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <highlight.icon className="h-4 w-4" aria-hidden="true" />
                  {highlight.label}
                </div>
                <p className="mt-4 text-2xl font-semibold">{highlight.value}</p>
                <p className="text-sm text-white/70">{highlight.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key performance indicators
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {statCards.map((stat, index) => (
            <div key={stat.title} data-animate style={{ transitionDelay: `${index * 70}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2" aria-label="Quick actions and alerts">
        <Card className="h-full" data-animate>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, href, icon: Icon, ariaLabel }) => (
                <Link key={label} href={href} aria-label={ariaLabel} className="group block">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 text-sm font-semibold text-gray-900 shadow-lg shadow-slate-900/5 transition-colors group-hover:text-blue-600"
                    fullWidthOnMobile
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full" data-animate style={{ transitionDelay: '120ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" aria-hidden="true" />
              Low Stock Alerts ({totalAlerts})
            </CardTitle>
          </CardHeader>
          <CardContent aria-live="polite">
            {totalAlerts === 0 ? (
              <p className="text-sm text-gray-600">Inventory is healthy. Great job!</p>
            ) : (
              <>
                <div
                  className="max-h-56 space-y-3 overflow-y-auto pr-1"
                  role="list"
                  aria-label="Products requiring restock"
                >
                  {lowStockPreview.map((product) => (
                    <div
                      key={product.id}
                      role="listitem"
                      className="flex items-start justify-between rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="danger" aria-label={`${product.currentStock} units remaining`}>
                          {product.currentStock} units
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {totalAlerts > lowStockPreview.length && (
                  <Link href="/inventory/alerts" aria-label="View all inventory alerts" className="mt-4 inline-flex w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-center text-blue-600 hover:bg-blue-50">
                      View all alerts
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Operational summaries
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <Card data-animate>
            <CardHeader>
              <CardTitle>Products Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Active Products</dt>
                  <dd className="text-sm font-semibold text-gray-900">{activeProducts}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Inactive Products</dt>
                  <dd className="text-sm font-semibold text-gray-900">{totalProducts - activeProducts}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Low Stock Items</dt>
                  <dd className="text-sm font-semibold text-rose-600">{totalAlerts}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card data-animate style={{ transitionDelay: '80ms' }}>
            <CardHeader>
              <CardTitle>Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Manufacturers</dt>
                  <dd className="text-sm font-semibold text-gray-900">{manufacturers.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Customers</dt>
                  <dd className="text-sm font-semibold text-gray-900">{customers.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Active Customers</dt>
                  <dd className="text-sm font-semibold text-emerald-600">
                    {customers.filter((c) => c.isActive).length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card data-animate style={{ transitionDelay: '160ms' }}>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Total Orders</dt>
                  <dd className="text-sm font-semibold text-gray-900">{totalSales}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Confirmed Orders</dt>
                  <dd className="text-sm font-semibold text-gray-900">{confirmedSales}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Total Revenue</dt>
                  <dd className="text-sm font-semibold text-emerald-600">{formatCurrency(totalRevenue)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
