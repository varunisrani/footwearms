'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/lib/stores/app-store';
import { Purchase, PurchaseItem } from '@/lib/types/database.types';
import { generateDocumentNumber } from '@/lib/services/storage.service';
import { StorageService } from '@/lib/services/storage.service';
import { formatCurrency } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface PurchaseFormProps {
  purchase?: Purchase;
  isEdit?: boolean;
}

interface PurchaseFormData {
  purchaseNumber: string;
  manufacturerId: string;
  purchaseDate: string;
  expectedDeliveryDate: string;
  status: 'draft' | 'ordered' | 'received' | 'partial' | 'cancelled';
  notes: string;
}

interface LineItem {
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
}

const purchaseItemService = new StorageService<PurchaseItem>('purchaseItems');

export function PurchaseForm({ purchase, isEdit = false }: PurchaseFormProps) {
  const router = useRouter();
  const { manufacturers, products, loadManufacturers, loadProducts, addPurchase, updatePurchase } = useAppStore();
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unitCost, setUnitCost] = useState<string>('0');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PurchaseFormData>({
    defaultValues: purchase
      ? {
          purchaseNumber: purchase.purchaseNumber,
          manufacturerId: purchase.manufacturerId.toString(),
          purchaseDate: purchase.purchaseDate.split('T')[0],
          expectedDeliveryDate: purchase.expectedDeliveryDate?.split('T')[0] || '',
          status: purchase.status,
          notes: purchase.notes || '',
        }
      : {
          purchaseNumber: generateDocumentNumber('PO'),
          purchaseDate: new Date().toISOString().split('T')[0],
          status: 'draft',
        },
  });

  useEffect(() => {
    loadManufacturers();
    loadProducts();
  }, [loadManufacturers, loadProducts]);

  useEffect(() => {
    // Load existing line items if editing
    if (purchase && isEdit) {
      const items = purchaseItemService.find(item => item.purchaseId === purchase.id);
      const loadedLineItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown',
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalAmount: item.totalAmount,
        };
      });
      setLineItems(loadedLineItems);
    }
  }, [purchase, isEdit, products]);

  const addLineItem = () => {
    if (!selectedProductId || !quantity || !unitCost) {
      toast.error('Please fill in all line item fields');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return;

    const qty = parseInt(quantity);
    const cost = parseFloat(unitCost);
    const total = qty * cost;

    const newItem: LineItem = {
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitCost: cost,
      totalAmount: total,
    };

    setLineItems([...lineItems, newItem]);
    setSelectedProductId('');
    setQuantity('1');
    setUnitCost('0');
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const onSubmit = (data: PurchaseFormData) => {
    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    const totalAmount = calculateTotal();

    const purchaseData = {
      purchaseNumber: data.purchaseNumber,
      manufacturerId: parseInt(data.manufacturerId),
      purchaseDate: data.purchaseDate,
      expectedDeliveryDate: data.expectedDeliveryDate || undefined,
      totalAmount,
      paidAmount: purchase?.paidAmount || 0,
      balanceAmount: totalAmount - (purchase?.paidAmount || 0),
      status: data.status,
      notes: data.notes,
      createdAt: purchase?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedPurchase;
    if (isEdit && purchase) {
      updatePurchase(purchase.id, purchaseData);
      savedPurchase = { ...purchase, ...purchaseData };

      // Delete existing line items
      const existingItems = purchaseItemService.find(item => item.purchaseId === purchase.id);
      existingItems.forEach(item => purchaseItemService.delete(item.id));

      toast.success('Purchase order updated successfully');
    } else {
      savedPurchase = addPurchase(purchaseData);
      toast.success('Purchase order created successfully');
    }

    // Save line items
    lineItems.forEach(item => {
      purchaseItemService.create({
        purchaseId: savedPurchase.id,
        productId: item.productId,
        quantity: item.quantity,
        receivedQuantity: 0,
        unitCost: item.unitCost,
        totalAmount: item.totalAmount,
        createdAt: new Date().toISOString(),
      });
    });

    router.push('/purchases');
  };

  const manufacturerOptions = manufacturers
    .filter(m => m.isActive)
    .map((m) => ({
      value: m.id.toString(),
      label: m.name,
    }));

  const productOptions = products
    .filter(p => p.isActive)
    .map((p) => ({
      value: p.id.toString(),
      label: `${p.name} (${p.sku})`,
    }));

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'received', label: 'Received' },
    { value: 'partial', label: 'Partial' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Auto-fill unit cost when product is selected
  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === parseInt(selectedProductId));
      if (product) {
        setUnitCost(product.basePrice.toString());
      }
    }
  }, [selectedProductId, products]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="PO Number"
              {...register('purchaseNumber', { required: 'PO number is required' })}
              error={errors.purchaseNumber?.message}
              required
            />
            <Select
              label="Manufacturer"
              {...register('manufacturerId', { required: 'Manufacturer is required' })}
              options={manufacturerOptions}
              error={errors.manufacturerId?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Purchase Date"
              type="date"
              {...register('purchaseDate', { required: 'Purchase date is required' })}
              error={errors.purchaseDate?.message}
              required
            />
            <Input
              label="Expected Delivery Date"
              type="date"
              {...register('expectedDeliveryDate')}
            />
            <Select
              label="Status"
              {...register('status', { required: 'Status is required' })}
              options={statusOptions}
              error={errors.status?.message}
              required
            />
          </div>

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

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Line Item Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="sm:col-span-2">
              <Select
                label="Product"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                options={productOptions}
              />
            </div>
            <div>
              <Input
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Input
                label="Unit Cost"
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                min="0"
              />
            </div>
            <div className="flex items-end sm:col-span-2 md:col-span-1">
              <Button type="button" onClick={addLineItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Line Items - Desktop Table View */}
          {lineItems.length > 0 ? (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
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
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        {formatCurrency(calculateTotal())}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: Card View */}
              <div className="md:hidden space-y-3">
                {lineItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {item.productName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Quantity:</span>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Unit Cost:</span>
                        <p className="font-medium">{formatCurrency(item.unitCost)}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total:</span>
                      <span className="font-bold text-base">{formatCurrency(item.totalAmount)}</span>
                    </div>
                  </div>
                ))}

                {/* Mobile Total */}
                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base">Total:</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No line items added yet. Add products above.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/purchases')}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto">
          {isEdit ? 'Update Purchase Order' : 'Create Purchase Order'}
        </Button>
      </div>
    </form>
  );
}
