'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function PurchasesPage() {
  const { purchases, manufacturers, loadPurchases, loadManufacturers, deletePurchase } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPurchases();
    loadManufacturers();
  }, [loadPurchases, loadManufacturers]);

  const handleDelete = (id: number, purchaseNumber: string) => {
    if (confirm(`Are you sure you want to delete purchase order "${purchaseNumber}"?`)) {
      deletePurchase(id);
      toast.success('Purchase order deleted successfully');
    }
  };

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'ordered': return 'info';
      case 'received': return 'success';
      case 'partial': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getManufacturerName(purchase.manufacturerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrdered = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalOutstanding = purchases.reduce((sum, p) => sum + p.balanceAmount, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage your purchase orders and inventory receipts</p>
        </div>
        <Link href="/purchases/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold mt-2">{purchases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Ordered</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(totalOrdered)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Paid</div>
            <div className="text-2xl font-bold mt-2 text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Outstanding</div>
            <div className="text-2xl font-bold mt-2 text-red-600">{formatCurrency(totalOutstanding)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Order List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search purchase orders..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPurchases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No purchase orders found</p>
              <Link href="/purchases/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first purchase order
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-mono text-xs">{purchase.purchaseNumber}</TableCell>
                    <TableCell className="font-medium">{getManufacturerName(purchase.manufacturerId)}</TableCell>
                    <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                    <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(purchase.paidAmount)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(purchase.balanceAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(purchase.status)}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {purchase.status === 'ordered' && (
                          <Link href={`/purchases/${purchase.id}/receive`}>
                            <Button variant="ghost" size="sm" title="Receive goods">
                              <Package className="w-4 h-4 text-green-600" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/purchases/${purchase.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(purchase.id, purchase.purchaseNumber)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
