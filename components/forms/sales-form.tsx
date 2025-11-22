'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Sale, SaleItem, Customer, Product } from '@/lib/types/database.types';
import { generateDocumentNumber } from '@/lib/services/storage.service';
import { formatCurrency } from '@/lib/utils/format';

interface SalesFormProps {
  sale?: Sale;
  saleItems?: SaleItem[];
  customers: Customer[];
  products: Product[];
  onSubmit: (sale: Omit<Sale, 'id'>, items: Omit<SaleItem, 'id' | 'saleId'>[]) => void;
  onCancel?: () => void;
}

interface LineItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
}

export function SalesForm({
  sale,
  saleItems = [],
  customers,
  products,
  onSubmit,
  onCancel,
}: SalesFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    saleNumber: sale?.saleNumber || generateDocumentNumber('SO'),
    customerId: sale?.customerId || 0,
    saleDate: sale?.saleDate || new Date().toISOString().split('T')[0],
    deliveryDate: sale?.deliveryDate || '',
    status: sale?.status || 'draft' as const,
    notes: sale?.notes || '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(
    saleItems.length > 0
      ? saleItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          taxPercent: item.taxPercent,
        }))
      : []
  );

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { productId: 0, quantity: 1, unitPrice: 0, discountPercent: 0, taxPercent: 18 },
    ]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-fill unit price when product is selected
    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        updated[index].unitPrice = product.sellingPrice;
      }
    }

    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateLineTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = (subtotal * item.discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * item.taxPercent) / 100;
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total: afterDiscount + taxAmount,
    };
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    lineItems.forEach((item) => {
      const calc = calculateLineTotal(item);
      subtotal += calc.subtotal;
      discountAmount += calc.discountAmount;
      taxAmount += calc.taxAmount;
    });

    const totalAmount = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, totalAmount };
  };

  const totals = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.customerId === 0) {
      alert('Please select a customer');
      return;
    }

    if (lineItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (lineItems.some((item) => item.productId === 0)) {
      alert('Please select a product for all line items');
      return;
    }

    // Check stock availability
    for (const item of lineItems) {
      const product = products.find((p) => p.id === item.productId);
      if (product && product.currentStock < item.quantity) {
        alert(`Insufficient stock for ${product.name}. Available: ${product.currentStock}`);
        return;
      }
    }

    const now = new Date().toISOString();
    const saleData: Omit<Sale, 'id'> = {
      saleNumber: formData.saleNumber,
      customerId: formData.customerId,
      saleDate: formData.saleDate,
      deliveryDate: formData.deliveryDate || undefined,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      paidAmount: 0,
      balanceAmount: totals.totalAmount,
      status: formData.status,
      notes: formData.notes,
      createdAt: sale?.createdAt || now,
      updatedAt: now,
    };

    const itemsData: Omit<SaleItem, 'id' | 'saleId'>[] = lineItems.map((item) => {
      const calc = calculateLineTotal(item);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent,
        discountAmount: calc.discountAmount,
        taxPercent: item.taxPercent,
        taxAmount: calc.taxAmount,
        totalAmount: calc.total,
        createdAt: now,
      };
    });

    onSubmit(saleData, itemsData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sale Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Number *
            </label>
            <input
              type="text"
              required
              value={formData.saleNumber}
              onChange={(e) => setFormData({ ...formData, saleNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="0">Select Customer</option>
              {customers.filter((c) => c.isActive).map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.businessName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Date *
            </label>
            <input
              type="date"
              required
              value={formData.saleDate}
              onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date
            </label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Sale['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Optional notes..."
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            type="button"
            onClick={addLineItem}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount %
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Tax %
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lineItems.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                const lineTotal = calculateLineTotal(item);
                return (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <select
                        required
                        value={item.productId}
                        onChange={(e) =>
                          updateLineItem(index, 'productId', parseInt(e.target.value))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      >
                        <option value="0">Select Product</option>
                        {products.filter((p) => p.isActive).map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.currentStock})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        required
                        min="1"
                        max={product?.currentStock || 999999}
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discountPercent}
                        onChange={(e) =>
                          updateLineItem(index, 'discountPercent', parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.taxPercent}
                        onChange={(e) =>
                          updateLineItem(index, 'taxPercent', parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-3 py-2 text-sm font-medium">
                      {formatCurrency(lineTotal.total)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {lineItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items added. Click "Add Item" to begin.
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      {lineItems.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="max-w-md ml-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Discount:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(totals.discountAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax:</span>
              <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(totals.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {sale ? 'Update Sale' : 'Create Sale'}
        </button>
      </div>
    </form>
  );
}
