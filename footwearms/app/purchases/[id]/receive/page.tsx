'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppStore } from '@/lib/stores/app-store';
import { Purchase, PurchaseItem } from '@/lib/types/database.types';
import { StorageService } from '@/lib/services/storage.service';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

const purchaseItemService = new StorageService<PurchaseItem>('purchaseItems');

interface ReceiveQuantity {
  itemId: number;
  quantity: number;
}

export default function ReceiveGoodsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { purchases, products, manufacturers, updatePurchase, updateProduct, loadPurchases, loadProducts, loadManufacturers } = useAppStore();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [lineItems, setLineItems] = useState<PurchaseItem[]>([]);
  const [receiveQuantities, setReceiveQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    loadPurchases();
    loadProducts();
    loadManufacturers();
  }, [loadPurchases, loadProducts, loadManufacturers]);

  useEffect(() => {
    const purchaseId = parseInt(params.id);
    const foundPurchase = purchases.find(p => p.id === purchaseId);
    if (foundPurchase) {
      setPurchase(foundPurchase);

      // Load line items
      const items = purchaseItemService.find(item => item.purchaseId === purchaseId);
      setLineItems(items);

      // Initialize receive quantities with remaining quantities
      const initialQuantities: Record<number, number> = {};
      items.forEach(item => {
        initialQuantities[item.id] = item.quantity - item.receivedQuantity;
      });
      setReceiveQuantities(initialQuantities);
    }
  }, [purchases, params.id]);

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown';
  };

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    const qty = parseInt(value) || 0;
    setReceiveQuantities({
      ...receiveQuantities,
      [itemId]: qty,
    });
  };

  const handleReceiveGoods = () => {
    if (!purchase) return;

    let totalReceived = 0;
    let hasChanges = false;

    // Update purchase items and product stock
    lineItems.forEach(item => {
      const receiveQty = receiveQuantities[item.id] || 0;
      if (receiveQty > 0) {
        hasChanges = true;
        totalReceived++;

        // Update purchase item received quantity
        const updatedReceivedQty = item.receivedQuantity + receiveQty;
        purchaseItemService.update(item.id, {
          receivedQuantity: updatedReceivedQty,
        });

        // Update product stock
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(product.id, {
            currentStock: product.currentStock + receiveQty,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });

    if (!hasChanges) {
      toast.error('Please enter quantities to receive');
      return;
    }

    // Update purchase status
    const allItemsReceived = lineItems.every(item => {
      const receiveQty = receiveQuantities[item.id] || 0;
      return item.receivedQuantity + receiveQty >= item.quantity;
    });

    const anyItemsReceived = lineItems.some(item => {
      const receiveQty = receiveQuantities[item.id] || 0;
      return item.receivedQuantity + receiveQty > 0;
    });

    let newStatus: Purchase['status'] = purchase.status;
    if (allItemsReceived) {
      newStatus = 'received';
    } else if (anyItemsReceived) {
      newStatus = 'partial';
    }

    updatePurchase(purchase.id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    toast.success(`Successfully received ${totalReceived} item(s)`);
    router.push('/purchases');
  };

  if (!purchase) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading purchase order...</p>
      </div>
    );
  }

  if (purchase.status === 'received') {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/purchases"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Purchase Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Receive Goods</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <p className="text-lg text-gray-700">This purchase order has already been fully received.</p>
              <Link href="/purchases">
                <Button className="mt-4">Back to Purchase Orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/purchases"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Purchase Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Receive Goods</h1>
        <p className="text-gray-600 mt-1">Update inventory by receiving goods from purchase order</p>
      </div>

      {/* Purchase Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="font-medium">{purchase.purchaseNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Manufacturer</p>
              <p className="font-medium">{getManufacturerName(purchase.manufacturerId)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Purchase Date</p>
              <p className="font-medium">{formatDate(purchase.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium">{formatCurrency(purchase.totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receive Goods */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items - Enter Received Quantities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Ordered Qty</TableHead>
                <TableHead>Already Received</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Receive Now</TableHead>
                <TableHead>Unit Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => {
                const remaining = item.quantity - item.receivedQuantity;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{getProductName(item.productId)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.receivedQuantity}</TableCell>
                    <TableCell className="font-semibold">{remaining}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={remaining}
                        value={receiveQuantities[item.id] || 0}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/purchases')}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleReceiveGoods}>
              <Package className="w-4 h-4 mr-2" />
              Receive Goods & Update Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
