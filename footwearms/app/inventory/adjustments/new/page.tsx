'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/lib/stores/app-store';
import { StockAdjustment, StockAdjustmentItem } from '@/lib/types/database.types';
import { StorageService, generateDocumentNumber } from '@/lib/services/storage.service';
import toast from 'react-hot-toast';

const adjustmentService = new StorageService<StockAdjustment>('stockAdjustments');
const adjustmentItemService = new StorageService<StockAdjustmentItem>('stockAdjustmentItems');

interface AdjustmentFormData {
  adjustmentNumber: string;
  adjustmentDate: string;
  adjustmentType: 'increase' | 'decrease' | 'correction';
  reason: string;
  notes: string;
}

interface AdjustmentLineItem {
  productId: number;
  productName: string;
  currentStock: number;
  adjustmentQty: number;
  newStock: number;
}

export default function NewStockAdjustmentPage() {
  const router = useRouter();
  const { products, updateProduct, loadProducts } = useAppStore();
  const [lineItems, setLineItems] = useState<AdjustmentLineItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [adjustmentQty, setAdjustmentQty] = useState<string>('0');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AdjustmentFormData>({
    defaultValues: {
      adjustmentNumber: generateDocumentNumber('ADJ'),
      adjustmentDate: new Date().toISOString().split('T')[0],
      adjustmentType: 'correction',
    },
  });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const adjustmentType = watch('adjustmentType');

  const addLineItem = () => {
    if (!selectedProductId || adjustmentQty === '' || parseInt(adjustmentQty) === 0) {
      toast.error('Please select a product and enter adjustment quantity');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    const qty = parseInt(adjustmentQty);
    let newStock = product.currentStock;

    if (adjustmentType === 'increase') {
      newStock = product.currentStock + Math.abs(qty);
    } else if (adjustmentType === 'decrease') {
      newStock = Math.max(0, product.currentStock - Math.abs(qty));
    } else { // correction
      newStock = qty;
    }

    const newItem: AdjustmentLineItem = {
      productId: product.id,
      productName: product.name,
      currentStock: product.currentStock,
      adjustmentQty: qty,
      newStock: newStock,
    };

    setLineItems([...lineItems, newItem]);
    setSelectedProductId('');
    setAdjustmentQty('0');
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AdjustmentFormData) => {
    if (lineItems.length === 0) {
      toast.error('Please add at least one adjustment item');
      return;
    }

    // Create stock adjustment record
    const adjustment = adjustmentService.create({
      adjustmentNumber: data.adjustmentNumber,
      adjustmentDate: data.adjustmentDate,
      adjustmentType: data.adjustmentType,
      reason: data.reason,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    });

    // Create adjustment items and update product stock
    lineItems.forEach(item => {
      adjustmentItemService.create({
        adjustmentId: adjustment.id,
        productId: item.productId,
        quantityBefore: item.currentStock,
        quantityAdjusted: item.adjustmentQty,
        quantityAfter: item.newStock,
        createdAt: new Date().toISOString(),
      });

      // Update product stock
      updateProduct(item.productId, {
        currentStock: item.newStock,
        updatedAt: new Date().toISOString(),
      });
    });

    toast.success('Stock adjustment created successfully');
    router.push('/inventory/adjustments');
  };

  const productOptions = products
    .filter(p => p.isActive)
    .map((p) => ({
      value: p.id.toString(),
      label: `${p.name} (${p.sku}) - Current: ${p.currentStock}`,
    }));

  const adjustmentTypeOptions = [
    { value: 'increase', label: 'Increase Stock' },
    { value: 'decrease', label: 'Decrease Stock' },
    { value: 'correction', label: 'Stock Correction' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/inventory/adjustments"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Adjustments
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Stock Adjustment</h1>
        <p className="text-gray-600 mt-1">Adjust inventory quantities for various reasons</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <CardTitle>Adjustment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Adjustment Number"
                {...register('adjustmentNumber', { required: 'Adjustment number is required' })}
                error={errors.adjustmentNumber?.message}
                required
              />
              <Input
                label="Adjustment Date"
                type="date"
                {...register('adjustmentDate', { required: 'Adjustment date is required' })}
                error={errors.adjustmentDate?.message}
                required
              />
              <Select
                label="Adjustment Type"
                {...register('adjustmentType', { required: 'Adjustment type is required' })}
                options={adjustmentTypeOptions}
                error={errors.adjustmentType?.message}
                required
              />
            </div>

            <Input
              label="Reason"
              {...register('reason', { required: 'Reason is required' })}
              error={errors.reason?.message}
              placeholder="e.g., Damaged goods, Lost items, Stock count correction"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Additional notes..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Adjustment Items */}
        <Card>
          <CardHeader>
            <CardTitle>Adjustment Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Item Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="md:col-span-2">
                <Select
                  label="Product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  options={productOptions}
                />
              </div>
              <div>
                <Input
                  label={adjustmentType === 'correction' ? 'New Stock Quantity' : 'Adjustment Quantity'}
                  type="number"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  helperText={
                    adjustmentType === 'correction'
                      ? 'Enter the correct stock quantity'
                      : adjustmentType === 'increase'
                      ? 'Enter quantity to add'
                      : 'Enter quantity to subtract'
                  }
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={addLineItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Items Table */}
            {lineItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Adjustment</TableHead>
                    <TableHead>New Stock</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          item.adjustmentQty > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.adjustmentQty > 0 ? '+' : ''}{item.adjustmentQty}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{item.newStock}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No items added yet. Add products above.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/inventory/adjustments')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Adjustment
          </Button>
        </div>
      </form>
    </div>
  );
}
