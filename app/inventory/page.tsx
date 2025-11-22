'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency } from '@/lib/utils/format';

export default function InventoryPage() {
  const { products, loadProducts } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.basePrice), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  const getStockStatus = (product: typeof products[0]) => {
    if (product.currentStock === 0) return { label: 'Out of Stock', variant: 'danger' as const };
    if (product.currentStock <= product.minStockLevel) return { label: 'Low Stock', variant: 'warning' as const };
    if (product.currentStock > product.minStockLevel * 3) return { label: 'High Stock', variant: 'success' as const };
    return { label: 'In Stock', variant: 'info' as const };
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Link href="/inventory/adjustments/new">
            <Button variant="outline" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Stock Adjustment
            </Button>
          </Link>
          <Link href="/inventory/alerts">
            <Button variant="outline" className="w-full sm:w-auto">
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Alerts ({lowStockCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-black">Total Stock</div>
                <div className="text-2xl font-bold mt-2 text-black">{totalStock}</div>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-black">Inventory Value</div>
                <div className="text-2xl font-bold mt-2 text-black">{formatCurrency(totalValue)}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-black">Low Stock Items</div>
                <div className="text-2xl font-bold mt-2 text-black">{lowStockCount}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-black">Out of Stock</div>
                <div className="text-2xl font-bold mt-2 text-black">{outOfStockCount}</div>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Inventory</CardTitle>
            <Input
              type="text"
              placeholder="Search inventory..."
              className="w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Stock Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const stockValue = product.currentStock * product.basePrice;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        product.currentStock === 0 ? 'text-red-600' :
                        product.currentStock <= product.minStockLevel ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {product.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{product.minStockLevel}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.basePrice)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(stockValue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
