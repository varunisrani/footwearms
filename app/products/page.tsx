'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { products, manufacturers, loadProducts, loadManufacturers, deleteProduct } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadManufacturers();
  }, [loadProducts, loadManufacturers]);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Total Products</div>
            <div className="text-2xl font-bold mt-2 text-black">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Active Products</div>
            <div className="text-2xl font-bold mt-2 text-black">{products.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Total Stock</div>
            <div className="text-2xl font-bold mt-2 text-black">{products.reduce((sum, p) => sum + p.currentStock, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Low Stock Items</div>
            <div className="text-2xl font-bold mt-2 text-black">
              {products.filter(p => p.currentStock <= p.minStockLevel).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found</p>
              <Link href="/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first product
                </Button>
              </Link>
            </div>
          ) : (
            <ResponsiveTable
              data={filteredProducts}
              tableView={
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{getManufacturerName(product.manufacturerId)}</TableCell>
                        <TableCell>
                          <span className={product.currentStock <= product.minStockLevel ? 'text-red-600 font-semibold' : ''}>
                            {product.currentStock}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'success' : 'default'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              mobileCardRender={(product) => (
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        SKU: {product.sku}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        {product.brand && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {product.brand}
                          </span>
                        )}
                        {product.size && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Size: {product.size}
                          </span>
                        )}
                        {product.color && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {product.color}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                      <p className={`text-xs mt-0.5 ${product.currentStock <= product.minStockLevel ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                        Stock: {product.currentStock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <Badge variant={product.isActive ? 'success' : 'default'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `/products/${product.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
