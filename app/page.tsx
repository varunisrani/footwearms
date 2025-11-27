'use client';

import { useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { StatsCard } from '@/components/features/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/stores/app-store';
import { initializeDatabase } from '@/lib/services/storage.service';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

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
    // Initialize database
    initializeDatabase();

    // Load data
    loadProducts();
    loadManufacturers();
    loadCustomers();
    loadSales();
  }, [loadProducts, loadManufacturers, loadCustomers, loadSales]);

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const confirmedOrders = sales.filter((s) => ['confirmed', 'delivered'].includes(s.status));
  const processingOrders = sales.filter((s) => ['draft', 'processing', 'shipped'].includes(s.status));
  const fulfillmentRate = totalSales === 0 ? 0 : Math.round((confirmedOrders.length / totalSales) * 100);
  const stockCoverage = totalProducts === 0
    ? 0
    : Math.round(((totalProducts - lowStockProducts.length) / Math.max(totalProducts, 1)) * 100);
  const activeCustomersCount = customers.filter((c) => c.isActive).length;
  const revenuePerOrder = totalSales === 0 ? 0 : totalRevenue / totalSales;
  const safeCoverage = Math.max(0, Math.min(stockCoverage, 100));
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Launch a new SKU to the hall',
      href: '/products/new',
      icon: Package,
      accent: 'from-sky-500/40 via-sky-500/0 to-transparent',
      text: 'text-sky-500',
    },
    {
      title: 'Record Sale',
      description: 'Capture a sale from the floor',
      href: '/sales/new',
      icon: TrendingUp,
      accent: 'from-violet-500/30 via-violet-500/0 to-transparent',
      text: 'text-violet-500',
    },
    {
      title: 'Receive Purchase',
      description: 'Log incoming cartons and GRNs',
      href: '/purchases/new',
      icon: ShoppingCart,
      accent: 'from-emerald-500/30 via-emerald-500/0 to-transparent',
      text: 'text-emerald-500',
    },
    {
      title: 'Add Customer',
      description: 'Invite a new retail partner',
      href: '/customers/new',
      icon: Users,
      accent: 'from-amber-500/30 via-amber-500/0 to-transparent',
      text: 'text-amber-500',
    },
  ];

  const hallFocus: Array<{
    title: string;
    value: string;
    helper: string;
    badge: BadgeVariant;
  }> = [
    {
      title: 'Low stock SKUs',
      value: `${lowStockProducts.length}`,
      helper: lowStockProducts.length ? 'Schedule replenishment for the hall' : 'All aisles stocked',
      badge: lowStockProducts.length ? 'danger' : 'success',
    },
    {
      title: 'Processing orders',
      value: `${processingOrders.length}`,
      helper: processingOrders.length ? 'Confirm picking & packing windows' : 'No pending orders',
      badge: processingOrders.length ? 'warning' : 'success',
    },
    {
      title: 'Active customers',
      value: `${activeCustomersCount}`,
      helper: 'Retailers actively placing hall orders',
      badge: 'info',
    },
  ];

  return (
    <div className="space-y-5 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{todayLabel} • Hall Control Center</p>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Footwear hall overview</h1>
          <p className="mt-1 text-gray-600">
            Monitor stock coverage, fulfillment velocity, and hall-level alerts from a single view.
          </p>
        </div>
        <Badge
          variant={processingOrders.length ? 'warning' : 'success'}
          className="text-sm"
        >
          {processingOrders.length ? `${processingOrders.length} orders in motion` : 'Hall running smoothly'}
        </Badge>
      </div>

      {/* Hero Section */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">Hall overview</p>
              <h2 className="mt-2 text-3xl font-semibold">Control the entire floor in real time</h2>
              <p className="mt-3 text-white/80">
                Stay ahead of replenishment, fulfillment commitments, and partner demand without leaving the console.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/30 bg-white/10 p-4">
                <p className="text-xs text-white/70">Stock coverage</p>
                <p className="mt-2 text-3xl font-bold">{safeCoverage}%</p>
                <div className="mt-3 h-2 w-full rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${safeCoverage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/70">
                  {totalProducts - lowStockProducts.length} of {totalProducts} SKUs above minimums
                </p>
              </div>

              <div className="rounded-2xl border border-white/30 bg-white/10 p-4">
                <p className="text-xs text-white/70">Fulfillment rate</p>
                <p className="mt-2 text-3xl font-bold">{fulfillmentRate}%</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  {confirmedOrders.length} confirmed / {totalSales || 0} total orders
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
                  <Activity className="h-4 w-4" />
                  {formatCurrency(revenuePerOrder || 0)} avg order value
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/inventory/alerts">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full border border-white/30 bg-white text-slate-900 hover:bg-white/90"
                >
                  Review alerts
                </Button>
              </Link>
              <Link href="/sales/new">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/60 text-white hover:bg-white/10"
                >
                  Launch new sale
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl border-gray-200/80">
          <CardHeader className="border-0 pb-0">
            <CardTitle>Today's hall focus</CardTitle>
            <CardDescription>Priority workstreams to keep fulfillment flowing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {hallFocus.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-2xl border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.helper}</p>
                </div>
                <Badge variant={item.badge}>{item.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={
            totalProducts
              ? {
                  value: Math.round((activeProducts / totalProducts) * 100),
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Total Stock"
          value={totalStock}
          icon={ShoppingCart}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={
            totalProducts
              ? {
                  value: stockCoverage,
                  isPositive: stockCoverage >= 70,
                }
              : undefined
          }
        />
        <StatsCard
          title="Total Sales"
          value={totalSales}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={
            totalSales
              ? {
                  value: fulfillmentRate,
                  isPositive: fulfillmentRate >= 60,
                }
              : undefined
          }
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border-gray-200/80 lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick hall actions</CardTitle>
            <CardDescription>Shortcuts for the most common floor operations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.accent} ${action.text}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="mt-4 text-base font-semibold text-gray-900">{action.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                    <span className="mt-3 inline-flex items-center text-xs font-medium text-gray-700">
                      Go <ArrowUpRight className="ml-1 h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200/80">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alerts
              </span>
              <Badge variant={lowStockProducts.length ? 'danger' : 'success'}>
                {lowStockProducts.length ? `${lowStockProducts.length} alerts` : 'All good'}
              </Badge>
            </CardTitle>
            <CardDescription>Keep the hall replenished before the floor runs dry.</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No low stock alerts</p>
            ) : (
              <div className="space-y-3 overflow-hidden">
                {lowStockProducts.slice(0, 5).map((product) => {
                  const coverage = product.minStockLevel
                    ? Math.round((product.currentStock / product.minStockLevel) * 100)
                    : 0;
                  const safeCoverageValue = Math.max(0, Math.min(coverage, 100));

                  return (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-gray-100 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <Badge variant="danger">{product.currentStock} units</Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Level</span>
                          <span>{safeCoverageValue}% of min</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-red-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                            style={{ width: `${safeCoverageValue}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {lowStockProducts.length > 5 && (
                  <Link href="/inventory/alerts">
                    <Button variant="ghost" size="sm" className="w-full text-blue-600">
                      View all alerts
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border-gray-200/80">
          <CardHeader>
            <CardTitle>Products Summary</CardTitle>
            <CardDescription>Hall inventory readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active products</span>
                <span className="font-semibold text-gray-900">{activeProducts}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                  style={{
                    width: `${totalProducts ? Math.round((activeProducts / totalProducts) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Inactive products</span>
              <span className="font-semibold text-gray-900">{totalProducts - activeProducts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Low stock items</span>
              <span className="font-semibold text-red-600">{lowStockProducts.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200/80">
          <CardHeader>
            <CardTitle>Partners</CardTitle>
            <CardDescription>Manufacturers and retailers tied to the hall.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Manufacturers</p>
                <p className="text-xs text-gray-500">Supplying SKUs</p>
              </div>
              <Badge variant="info">{manufacturers.length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Customers</p>
                <p className="text-xs text-gray-500">Total accounts</p>
              </div>
              <Badge variant="success">{customers.length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Active customers</p>
                <p className="text-xs text-gray-500">Trading this month</p>
              </div>
              <Badge variant="warning">{activeCustomersCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-gray-200/80">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Revenue momentum across the hall.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total orders</span>
              <span className="font-semibold text-gray-900">{totalSales}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Confirmed orders</span>
              <span className="font-semibold text-gray-900">{confirmedOrders.length}</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fulfillment rate</span>
                <span className="font-semibold text-gray-900">{fulfillmentRate}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${Math.max(0, Math.min(fulfillmentRate, 100))}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total revenue</span>
              <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Avg order value</span>
              <span className="font-semibold text-gray-900">{formatCurrency(revenuePerOrder || 0)}</span>
            </div>
            <Link href="/reports" className="inline-flex items-center text-sm font-medium text-blue-600">
              View detailed reports <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
