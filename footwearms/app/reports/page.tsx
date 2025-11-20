'use client';

import { useEffect, useState } from 'react';
import { Download, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { StorageService } from '@/lib/services/storage.service';
import { PurchaseItem, SaleItem } from '@/lib/types/database.types';
import { SalesTrendChart } from '@/components/charts/sales-trend-chart';
import { RevenuePieChart } from '@/components/charts/revenue-pie-chart';
import { InventoryBarChart } from '@/components/charts/inventory-bar-chart';
import { TopCustomersChart } from '@/components/charts/top-customers-chart';

const purchaseItemService = new StorageService<PurchaseItem>('purchaseItems');
const saleItemService = new StorageService<SaleItem>('saleItems');

export default function ReportsPage() {
  const { products, manufacturers, customers, purchases, sales, loadProducts, loadManufacturers, loadCustomers, loadPurchases, loadSales } = useAppStore();
  const [activeReport, setActiveReport] = useState<'inventory' | 'sales' | 'purchases'>('inventory');

  useEffect(() => {
    loadProducts();
    loadManufacturers();
    loadCustomers();
    loadPurchases();
    loadSales();
  }, [loadProducts, loadManufacturers, loadCustomers, loadPurchases, loadSales]);

  // Inventory Report Data
  const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.basePrice), 0);
  const totalStockQty = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;

  // Sales Report Data
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSalesCount = sales.length;
  const totalPaidAmount = sales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalOutstanding = sales.reduce((sum, s) => sum + s.balanceAmount, 0);

  // Purchase Report Data
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPurchasesPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPurchasesOutstanding = purchases.reduce((sum, p) => sum + p.balanceAmount, 0);

  // Export to CSV function
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (activeReport === 'inventory') {
      csvContent = 'SKU,Product Name,Brand,Category,Current Stock,Min Level,Base Price,Stock Value\n';
      products.forEach(p => {
        const stockValue = p.currentStock * p.basePrice;
        csvContent += `${p.sku},${p.name},${p.brand},${p.category},${p.currentStock},${p.minStockLevel},${p.basePrice},${stockValue}\n`;
      });
      filename = 'inventory-report.csv';
    } else if (activeReport === 'sales') {
      csvContent = 'Sale Number,Customer,Date,Total,Paid,Balance,Status\n';
      sales.forEach(s => {
        const customer = customers.find(c => c.id === s.customerId);
        csvContent += `${s.saleNumber},${customer?.name || 'Unknown'},${formatDate(s.saleDate)},${s.totalAmount},${s.paidAmount},${s.balanceAmount},${s.status}\n`;
      });
      filename = 'sales-report.csv';
    } else {
      csvContent = 'PO Number,Manufacturer,Date,Total,Paid,Balance,Status\n';
      purchases.forEach(p => {
        const manufacturer = manufacturers.find(m => m.id === p.manufacturerId);
        csvContent += `${p.purchaseNumber},${manufacturer?.name || 'Unknown'},${formatDate(p.purchaseDate)},${p.totalAmount},${p.paidAmount},${p.balanceAmount},${p.status}\n`;
      });
      filename = 'purchases-report.csv';
    }

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View comprehensive business reports and export data</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveReport('inventory')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeReport === 'inventory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Inventory Report
        </button>
        <button
          onClick={() => setActiveReport('sales')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeReport === 'sales'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Sales Report
        </button>
        <button
          onClick={() => setActiveReport('purchases')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeReport === 'purchases'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Purchase Report
        </button>
      </div>

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Stock Value</div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(totalStockValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Stock Quantity</div>
                <div className="text-2xl font-bold mt-2">{totalStockQty}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="text-2xl font-bold mt-2">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Low Stock Items</div>
                <div className="text-2xl font-bold mt-2 text-red-600">{lowStockCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Chart */}
          <Card>
            <CardContent className="pt-6">
              <InventoryBarChart products={products} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Valuation Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Stock Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.currentStock}</TableCell>
                      <TableCell>{formatCurrency(product.basePrice)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(product.currentStock * product.basePrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Sales</div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(totalSalesAmount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold mt-2">{totalSalesCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Received</div>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatCurrency(totalPaidAmount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Outstanding</div>
                <div className="text-2xl font-bold mt-2 text-red-600">{formatCurrency(totalOutstanding)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <SalesTrendChart sales={sales} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <RevenuePieChart sales={sales} customers={customers} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <TopCustomersChart sales={sales} customers={customers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map(sale => {
                    const customer = customers.find(c => c.id === sale.customerId);
                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono text-xs">{sale.saleNumber}</TableCell>
                        <TableCell className="font-medium">{customer?.name || 'Unknown'}</TableCell>
                        <TableCell>{formatDate(sale.saleDate)}</TableCell>
                        <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(sale.paidAmount)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(sale.balanceAmount)}</TableCell>
                        <TableCell>{sale.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Purchase Report */}
      {activeReport === 'purchases' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Purchases</div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(totalPurchases)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold mt-2">{purchases.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Total Paid</div>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatCurrency(totalPurchasesPaid)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Outstanding</div>
                <div className="text-2xl font-bold mt-2 text-red-600">{formatCurrency(totalPurchasesOutstanding)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map(purchase => {
                    const manufacturer = manufacturers.find(m => m.id === purchase.manufacturerId);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-xs">{purchase.purchaseNumber}</TableCell>
                        <TableCell className="font-medium">{manufacturer?.name || 'Unknown'}</TableCell>
                        <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                        <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(purchase.paidAmount)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(purchase.balanceAmount)}</TableCell>
                        <TableCell>{purchase.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
