'use client';

import { useEffect } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { StatsCard } from '@/components/features/dashboard/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/stores/app-store';
import { initializeDatabase } from '@/lib/services/storage.service';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

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

  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.isActive).length;
  const totalStock = products.reduce((sum, product) => sum + product.currentStock, 0);
  const lowStockProducts = products.filter((product) => product.currentStock <= product.minStockLevel);

  const totalSales = sales.length;
  const confirmedSales = sales.filter((sale) => sale.status === 'confirmed');
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const fulfillmentRate = totalSales ? Math.round((confirmedSales.length / totalSales) * 100) : 0;
  const averageOrderValue = totalSales ? totalRevenue / totalSales : 0;
  const activeCustomersCount = customers.filter((customer) => customer.isActive).length;
  const inventoryCoverage = totalProducts
    ? Math.round(((totalProducts - lowStockProducts.length) / Math.max(totalProducts, 1)) * 100)
    : 0;

  type QuickAction = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    accent: string;
    iconColor: string;
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Add Product',
      description: 'Keep the catalog fresh and organized.',
      href: '/products/new',
      icon: Package,
      accent: 'from-blue-50 via-white to-transparent',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Record Sale',
      description: 'Track every transaction in seconds.',
      href: '/sales/new',
      icon: TrendingUp,
      accent: 'from-emerald-50 via-white to-transparent',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'New Purchase',
      description: 'Restock shelves before they run low.',
      href: '/purchases/new',
      icon: ShoppingCart,
      accent: 'from-purple-50 via-white to-transparent',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Add Customer',
      description: 'Grow loyalty with quick onboarding.',
      href: '/customers/new',
      icon: Users,
      accent: 'from-amber-50 via-white to-transparent',
      iconColor: 'text-amber-600',
    },
  ];

  const heroHighlights = [
    { label: 'Total revenue', value: formatCurrency(totalRevenue) },
    { label: 'Avg order value', value: formatCurrency(totalSales ? averageOrderValue : 0) },
    { label: 'Fulfillment rate', value: `${fulfillmentRate}%` },
    { label: 'Active customers', value: activeCustomersCount },
  ];

  const highlightedAlerts = lowStockProducts.slice(0, 5);

  const getStockCoverage = (current: number, minimum: number) => {
    if (!minimum) return 100;
    return Math.min(100, Math.max(0, Math.round((current / minimum) * 100)));
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage < 40) return 'bg-red-400';
    if (coverage < 70) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="space-y-6 pb-10 md:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              <Sparkles className="h-4 w-4" />
              Operations Hall
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Keep every aisle of your footwear business in sync.
            </h1>
            <p className="max-w-2xl text-base text-white/80 md:text-lg">
              Monitor performance, act on low stock, and move from insight to action faster with a
              refreshed control center.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sales/new">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-blue-900/50"
                >
                  Launch sales flow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/inventory/alerts">
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-white/30 bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
                >
                  Review inventory
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {heroHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          helperText={`${activeProducts} active / ${Math.max(totalProducts - activeProducts, 0)} inactive`}
        />
        <StatsCard
          title="Total Stock"
          value={totalStock}
          icon={ShoppingCart}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
          helperText={`${lowStockProducts.length} low stock items`}
        />
        <StatsCard
          title="Total Sales"
          value={totalSales}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          helperText={`${fulfillmentRate}% fulfillment`}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          helperText={`Avg order ${formatCurrency(totalSales ? averageOrderValue : 0)}`}
        />
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-none bg-white/90 shadow-xl shadow-slate-200/80 backdrop-blur">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center justify-between text-slate-900">
              Quick Actions
              <Badge variant="info" className="text-xs uppercase tracking-widest">
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map(({ title, description, href, icon: Icon, accent, iconColor }) => (
                <Link
                  key={title}
                  href={href}
                  className="group block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 rounded-2xl"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                    <div
                      className={cn(
                        'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                        accent
                      )}
                    />
                    <div className="relative flex items-center gap-4">
                      <div
                        className={cn(
                          'rounded-2xl bg-white/80 p-3 shadow-inner transition-transform duration-300 group-hover:scale-110',
                          iconColor
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{title}</p>
                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/90 shadow-xl shadow-slate-200/80 backdrop-blur">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alerts ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {highlightedAlerts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Inventory levels are healthy. Keep monitoring for proactive restocks.
              </div>
            ) : (
              <div className="space-y-3">
                {highlightedAlerts.map((product) => {
                  const coverage = getStockCoverage(product.currentStock, product.minStockLevel);
                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl border border-slate-100 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                        </div>
                        <Badge variant="danger">{product.currentStock} units</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>Min stock {product.minStockLevel}</span>
                        <span className="font-medium text-red-600">Reorder recommended</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                        <span
                          className={cn('block h-full rounded-full', getCoverageColor(coverage))}
                          style={{ width: `${coverage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {lowStockProducts.length > highlightedAlerts.length && (
              <Link href="/inventory/alerts">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full border border-slate-200 text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  View all alerts
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="border-none bg-white/90 shadow-lg shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Products Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Active products</span>
                <span className="font-semibold text-slate-900">{activeProducts}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Inactive products</span>
                <span className="font-semibold text-slate-900">
                  {Math.max(totalProducts - activeProducts, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Low stock items</span>
                <span className="font-semibold text-red-600">{lowStockProducts.length}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Inventory coverage
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-slate-900 transition-all"
                  style={{ width: `${inventoryCoverage}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {inventoryCoverage}% of products are comfortably stocked.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/90 shadow-lg shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Manufacturers</p>
                  <p className="text-xs text-slate-500">Trusted supply partners</p>
                </div>
                <Badge variant="info">{manufacturers.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Customers</p>
                  <p className="text-xs text-slate-500">All-time accounts</p>
                </div>
                <Badge variant="default">{customers.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Active customers</p>
                  <p className="text-xs text-slate-500">Engaged within 90 days</p>
                </div>
                <Badge variant="success">{activeCustomersCount}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/90 shadow-lg shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total orders</span>
                <span className="font-semibold text-slate-900">{totalSales}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Confirmed orders</span>
                <span className="font-semibold text-slate-900">{confirmedSales.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total revenue</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
            <Link href="/reports">
              <Button
                variant="ghost"
                className="w-full border border-slate-200 text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                View detailed reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
