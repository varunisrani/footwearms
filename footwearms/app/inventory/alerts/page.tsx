'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency } from '@/lib/utils/format';

export default function StockAlertsPage() {
  const { products, manufacturers, loadProducts, loadManufacturers } = useAppStore();

  useEffect(() => {
    loadProducts();
    loadManufacturers();
  }, [loadProducts, loadManufacturers]);

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel && p.currentStock > 0);
  const outOfStockProducts = products.filter(p => p.currentStock === 0);

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Link
          href="/inventory"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Inventory
        </Link>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Alerts</h1>
            <p className="text-gray-600 mt-1">Products that need immediate attention</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Low Stock Items</div>
                <div className="text-3xl font-bold mt-2 text-orange-600">{lowStockProducts.length}</div>
                <p className="text-sm text-gray-500 mt-1">Below minimum stock level</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Out of Stock Items</div>
                <div className="text-3xl font-bold mt-2 text-red-600">{outOfStockProducts.length}</div>
                <p className="text-sm text-gray-500 mt-1">Zero stock available</p>
              </div>
              <Package className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock Products */}
      {outOfStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Package className="w-5 h-5 mr-2" />
              Out of Stock ({outOfStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outOfStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{getManufacturerName(product.manufacturerId)}</TableCell>
                    <TableCell>{product.minStockLevel}</TableCell>
                    <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                    <TableCell>
                      <Link href="/purchases/new">
                        <Button size="sm" variant="outline">
                          Create PO
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => {
                  const percentageOfMin = (product.currentStock / product.minStockLevel) * 100;
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{getManufacturerName(product.manufacturerId)}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-orange-600">{product.currentStock}</span>
                      </TableCell>
                      <TableCell>{product.minStockLevel}</TableCell>
                      <TableCell>
                        <Badge variant="warning">
                          {percentageOfMin.toFixed(0)}% of min
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href="/purchases/new">
                          <Button size="sm" variant="outline">
                            Create PO
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* No Alerts */}
      {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Stock Levels are Good!</h3>
              <p className="text-gray-600">There are no low stock or out of stock alerts at this time.</p>
              <Link href="/inventory">
                <Button className="mt-4">Back to Inventory</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
