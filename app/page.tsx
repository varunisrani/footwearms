'use client';

import { useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/features/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/stores/app-store';
import { initializeDatabase } from '@/lib/services/storage.service';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format';

export default function Dashboard() {
  const { products, manufacturers, customers, sales, loadProducts, loadManufacturers, loadCustomers, loadSales } = useAppStore();

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
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fadeIn">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to your Footwear Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Total Stock"
          value={totalStock}
          icon={ShoppingCart}
          color="green"
        />
        <StatsCard
          title="Total Sales"
          value={totalSales}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card hover={false} className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/products/new">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
              <Link href="/sales/new">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  New Sale
                </Button>
              </Link>
              <Link href="/purchases/new">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  New Purchase
                </Button>
              </Link>
              <Link href="/customers/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card hover={false} className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Low Stock Alerts ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No low stock alerts</p>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="danger">{product.currentStock} units</Badge>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <Link href="/inventory/alerts">
                    <Button variant="ghost" size="sm" className="w-full">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card hover={false} className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Products Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Products</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{activeProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Inactive Products</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{totalProducts - activeProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">{lowStockProducts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover={false} className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Manufacturers</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{manufacturers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customers</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{customers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Customers</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{customers.filter(c => c.isActive).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover={false} className="animate-fadeIn">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{totalSales}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed Orders</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{sales.filter(s => s.status === 'confirmed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
