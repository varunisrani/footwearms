'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { StockAdjustment, StockAdjustmentItem } from '@/lib/types/database.types';
import { StorageService } from '@/lib/services/storage.service';
import { useAppStore } from '@/lib/stores/app-store';
import { formatDate } from '@/lib/utils/format';

const adjustmentService = new StorageService<StockAdjustment>('stockAdjustments');
const adjustmentItemService = new StorageService<StockAdjustmentItem>('stockAdjustmentItems');

export default function StockAdjustmentsPage() {
  const { products, loadProducts } = useAppStore();
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadAdjustments();
  }, [loadProducts]);

  const loadAdjustments = () => {
    const allAdjustments = adjustmentService.getAll();
    setAdjustments(allAdjustments.sort((a, b) =>
      new Date(b.adjustmentDate).getTime() - new Date(a.adjustmentDate).getTime()
    ));
  };

  const getAdjustmentTypeVariant = (type: string) => {
    switch (type) {
      case 'increase': return 'success';
      case 'decrease': return 'danger';
      case 'correction': return 'warning';
      default: return 'default';
    }
  };

  const getAdjustmentItemsCount = (adjustmentId: number) => {
    return adjustmentItemService.find(item => item.adjustmentId === adjustmentId).length;
  };

  const filteredAdjustments = adjustments.filter(adj =>
    adj.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-gray-600 mt-1">Track all inventory adjustments and corrections</p>
        </div>
        <Link href="/inventory/adjustments/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Adjustment
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Total Adjustments</div>
            <div className="text-2xl font-bold mt-2">{adjustments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Increases</div>
            <div className="text-2xl font-bold mt-2 text-green-600">
              {adjustments.filter(a => a.adjustmentType === 'increase').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Decreases</div>
            <div className="text-2xl font-bold mt-2 text-red-600">
              {adjustments.filter(a => a.adjustmentType === 'decrease').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Adjustment History</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search adjustments..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAdjustments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No adjustments found</p>
              <Link href="/inventory/adjustments/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first adjustment
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adjustment #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="font-mono text-xs">{adjustment.adjustmentNumber}</TableCell>
                    <TableCell>{formatDate(adjustment.adjustmentDate)}</TableCell>
                    <TableCell>
                      <Badge variant={getAdjustmentTypeVariant(adjustment.adjustmentType)}>
                        {adjustment.adjustmentType.charAt(0).toUpperCase() + adjustment.adjustmentType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{adjustment.reason}</TableCell>
                    <TableCell>{getAdjustmentItemsCount(adjustment.id)} item(s)</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {adjustment.notes || '-'}
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
