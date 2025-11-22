'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  SalesReturn,
  SalesReturnItem,
  Sale,
  SaleItem,
  Product,
} from '@/lib/types/database.types';
import { generateDocumentNumber } from '@/lib/services/storage.service';
import { formatCurrency } from '@/lib/utils/format';

interface SalesReturnFormProps {
  sale: Sale;
  saleItems: SaleItem[];
  products: Product[];
  onSubmit: (
    salesReturn: Omit<SalesReturn, 'id'>,
    items: Omit<SalesReturnItem, 'id' | 'returnId'>[]
  ) => void;
  onCancel?: () => void;
}

interface ReturnLineItem {
  saleItemId: number;
  productId: number;
  maxQuantity: number;
  quantityReturned: number;
  unitPrice: number;
  taxPercent: number;
  selected: boolean;
}

export function SalesReturnForm({
  sale,
  saleItems,
  products,
  onSubmit,
  onCancel,
}: SalesReturnFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    returnNumber: generateDocumentNumber('RET'),
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    refundMethod: 'cash' as const,
    status: 'pending' as const,
    notes: '',
  });

  const [lineItems, setLineItems] = useState<ReturnLineItem[]>(
    saleItems.map((item) => ({
      saleItemId: item.id,
      productId: item.productId,
      maxQuantity: item.quantity,
      quantityReturned: item.quantity,
      unitPrice: item.unitPrice,
      taxPercent: item.taxPercent,
      selected: false,
    }))
  );

  const updateLineItem = (
    index: number,
    field: keyof ReturnLineItem,
    value: number | boolean
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateLineTotal = (item: ReturnLineItem) => {
    if (!item.selected) return { subtotal: 0, taxAmount: 0, total: 0 };

    const subtotal = item.quantityReturned * item.unitPrice;
    const taxAmount = (subtotal * item.taxPercent) / 100;
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;

    lineItems.forEach((item) => {
      if (item.selected) {
        const lineTotals = calculateLineTotal(item);
        subtotal += lineTotals.subtotal;
        taxAmount += lineTotals.taxAmount;
      }
    });

    return {
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedItems = lineItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    if (!formData.reason.trim()) {
      alert('Please provide a reason for the return');
      return;
    }

    const totals = calculateTotals();
    const returnItems: Omit<SalesReturnItem, 'id' | 'returnId'>[] = selectedItems.map(
      (item) => {
        const lineTotals = calculateLineTotal(item);
        return {
          saleItemId: item.saleItemId,
          productId: item.productId,
          quantityReturned: item.quantityReturned,
          unitPrice: item.unitPrice,
          taxPercent: item.taxPercent,
          taxAmount: lineTotals.taxAmount,
          totalAmount: lineTotals.total,
          createdAt: new Date().toISOString(),
        };
      }
    );

    const salesReturn: Omit<SalesReturn, 'id'> = {
      returnNumber: formData.returnNumber,
      saleId: sale.id,
      customerId: sale.customerId,
      returnDate: formData.returnDate,
      reason: formData.reason,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      refundAmount: totals.totalAmount,
      refundMethod: formData.refundMethod,
      status: formData.status,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(salesReturn, returnItems);
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Number
          </label>
          <input
            type="text"
            value={formData.returnNumber}
            onChange={(e) =>
              setFormData({ ...formData, returnNumber: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Date
          </label>
          <input
            type="date"
            value={formData.returnDate}
            onChange={(e) =>
              setFormData({ ...formData, returnDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refund Method
          </label>
          <select
            value={formData.refundMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                refundMethod: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="cheque">Cheque</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_note">Credit Note</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Return <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select reason</option>
          <option value="Defective Product">Defective Product</option>
          <option value="Wrong Item Shipped">Wrong Item Shipped</option>
          <option value="Size/Color Issue">Size/Color Issue</option>
          <option value="Customer Changed Mind">Customer Changed Mind</option>
          <option value="Quality Issues">Quality Issues</option>
          <option value="Late Delivery">Late Delivery</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Items to Return</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Original Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Return Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tax
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lineItems.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                const lineTotals = calculateLineTotal(item);
                return (
                  <tr key={index} className={item.selected ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) =>
                          updateLineItem(index, 'selected', e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {product?.name || 'Unknown Product'}
                    </td>
                    <td className="px-4 py-4 text-sm">{item.maxQuantity}</td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        value={item.quantityReturned}
                        onChange={(e) =>
                          updateLineItem(
                            index,
                            'quantityReturned',
                            Math.min(
                              Math.max(1, parseInt(e.target.value) || 1),
                              item.maxQuantity
                            )
                          )
                        }
                        min="1"
                        max={item.maxQuantity}
                        disabled={!item.selected}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-4 text-sm">{item.taxPercent}%</td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {formatCurrency(lineTotals.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Refund:</span>
            <span>{formatCurrency(totals.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Any additional information about the return..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.back())}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Return Request
        </button>
      </div>
    </form>
  );
}
