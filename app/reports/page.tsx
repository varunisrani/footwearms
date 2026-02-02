'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const purchaseItemService = new StorageService<PurchaseItem>('purchaseItems');
const saleItemService = new StorageService<SaleItem>('saleItems');

export default function ReportsPage() {
  const { products, manufacturers, customers, purchases, sales, loadProducts, loadManufacturers, loadCustomers, loadPurchases, loadSales } = useAppStore();
  const [activeReport, setActiveReport] = useState<'inventory' | 'sales' | 'purchases'>('inventory');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadProducts();
    loadManufacturers();
    loadCustomers();
    loadPurchases();
    loadSales();
  }, [loadProducts, loadManufacturers, loadCustomers, loadPurchases, loadSales]);

  const withinRange = (dateStr?: string) => {
    if (!startDate && !endDate) return true;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    if (startDate && date < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (date > end) return false;
    }
    return true;
  };

  const filteredSales = sales.filter((s) => withinRange(s.saleDate));
  const filteredPurchases = purchases.filter((p) => withinRange(p.purchaseDate));

  // Inventory Report Data
  const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.basePrice), 0);
  const totalStockQty = products.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;

  // Sales Report Data
  const totalSalesAmount = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSalesCount = filteredSales.length;
  const totalPaidAmount = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalOutstanding = filteredSales.reduce((sum, s) => sum + s.balanceAmount, 0);

  // Purchase Report Data
  const totalPurchases = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPurchasesPaid = filteredPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPurchasesOutstanding = filteredPurchases.reduce((sum, p) => sum + p.balanceAmount, 0);

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
      filteredSales.forEach(s => {
        const customer = customers.find(c => c.id === s.customerId);
        csvContent += `${s.saleNumber},${customer?.name || 'Unknown'},${formatDate(s.saleDate)},${s.totalAmount},${s.paidAmount},${s.balanceAmount},${s.status}\n`;
      });
      filename = 'sales-report.csv';
    } else {
      csvContent = 'PO Number,Manufacturer,Date,Total,Paid,Balance,Status\n';
      filteredPurchases.forEach(p => {
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    const title = activeReport === 'inventory' ? 'Inventory Report' : activeReport === 'sales' ? 'Sales Report' : 'Purchase Report';
    doc.text(title, 14, 18);

    if (activeReport === 'inventory') {
      autoTable(doc, {
        startY: 24,
        head: [['SKU', 'Product', 'Brand', 'Category', 'Stock', 'Min', 'Base Price', 'Stock Value']],
        body: products.map((p) => [
          p.sku,
          p.name,
          p.brand,
          p.category,
          p.currentStock,
          p.minStockLevel,
          formatCurrency(p.basePrice),
          formatCurrency(p.currentStock * p.basePrice),
        ]),
      });
    } else if (activeReport === 'sales') {
      autoTable(doc, {
        startY: 24,
        head: [['Sale #', 'Customer', 'Date', 'Total', 'Paid', 'Balance', 'Status']],
        body: filteredSales.map((s) => {
          const customer = customers.find((c) => c.id === s.customerId);
          return [
            s.saleNumber,
            customer?.name || 'Unknown',
            formatDate(s.saleDate),
            formatCurrency(s.totalAmount),
            formatCurrency(s.paidAmount),
            formatCurrency(s.balanceAmount),
            s.status,
          ];
        }),
      });
    } else {
      autoTable(doc, {
        startY: 24,
        head: [['PO #', 'Manufacturer', 'Date', 'Total', 'Paid', 'Balance', 'Status']],
        body: filteredPurchases.map((p) => {
          const manufacturer = manufacturers.find((m) => m.id === p.manufacturerId);
          return [
            p.purchaseNumber,
            manufacturer?.name || 'Unknown',
            formatDate(p.purchaseDate),
            formatCurrency(p.totalAmount),
            formatCurrency(p.paidAmount),
            formatCurrency(p.balanceAmount),
            p.status,
          ];
        }),
      });
    }

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">View comprehensive business reports and export data</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={exportToCSV} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF} className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveReport('inventory')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors w-full sm:w-auto ${
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
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors w-full sm:w-auto ${
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
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors w-full sm:w-auto ${
            activeReport === 'purchases'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Purchase Report
        </button>
      </div>

      {(activeReport === 'sales' || activeReport === 'purchases') && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="w-full sm:w-auto"
          >
            Clear Filter
          </Button>
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="text-base md:text-lg">Stock Valuation Report</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-sm text-gray-500">No inventory data yet.</p>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <SalesTrendChart sales={filteredSales} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <RevenuePieChart sales={filteredSales} customers={customers} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <TopCustomersChart sales={filteredSales} customers={customers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSales.length === 0 ? (
                <p className="text-sm text-gray-500">No sales recorded yet.</p>
              ) : (
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
                    {filteredSales.map(sale => {
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
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Purchase Report */}
      {activeReport === 'purchases' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="text-base md:text-lg">Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPurchases.length === 0 ? (
                <p className="text-sm text-gray-500">No purchases recorded yet.</p>
              ) : (
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
                    {filteredPurchases.map(purchase => {
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
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
