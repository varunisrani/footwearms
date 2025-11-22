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

  // Mobile modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<LineItem>({
    productId: 0,
    quantity: 1,
    unitPrice: 0,
    discountPercent: 0,
    taxPercent: 18,
  });

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

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setCurrentItem({ ...lineItems[index] });
    setShowItemModal(true);
  };

  const handleSaveItem = () => {
    if (currentItem.productId === 0) {
      alert('Please select a product');
      return;
    }

    if (editingIndex !== null) {
      // Update existing item
      const updated = [...lineItems];
      updated[editingIndex] = currentItem;
      setLineItems(updated);
    } else {
      // Add new item
      setLineItems([...lineItems, currentItem]);
    }

    // Reset modal state
    setShowItemModal(false);
    setEditingIndex(null);
    setCurrentItem({
      productId: 0,
      quantity: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 18,
    });
  };

  const handleProductChange = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCurrentItem({
        ...currentItem,
        productId,
        unitPrice: product.sellingPrice,
      });
    } else {
      setCurrentItem({ ...currentItem, productId });
    }
  };

  const calculateItemTotal = () => {
    const subtotal = currentItem.quantity * currentItem.unitPrice;
    const discountAmount = (subtotal * currentItem.discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * currentItem.taxPercent) / 100;
    return afterDiscount + taxAmount;
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
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
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
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setCurrentItem({
                productId: 0,
                quantity: 1,
                unitPrice: 0,
                discountPercent: 0,
                taxPercent: 18,
              });
              setShowItemModal(true);
            }}
            className="md:hidden px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={addLineItem}
            className="hidden md:block px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            + Add Item
          </button>
        </div>

        {/* Desktop: Table View */}
        <div className="hidden md:block overflow-x-auto">
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
        </div>

        {/* Mobile: Card View */}
        <div className="md:hidden space-y-3">
          {lineItems.map((item, index) => {
            const product = products.find((p) => p.id === item.productId);
            const lineTotal = calculateLineTotal(item);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {product?.name || 'Unknown Product'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product?.sku || 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-red-600 p-1 hover:bg-red-50 rounded"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Quantity:</span>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Unit Price:</span>
                    <p className="font-medium">{formatCurrency(item.unitPrice)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Discount:</span>
                    <p className="font-medium">{item.discountPercent}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Tax:</span>
                    <p className="font-medium">{item.taxPercent}%</p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="font-bold text-base">{formatCurrency(lineTotal.total)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleEditItem(index)}
                  className="w-full mt-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  Edit Item
                </button>
              </div>
            );
          })}
        </div>

        {lineItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items added. Click "Add Item" to begin.
          </div>
        )}
      </div>

      {/* Totals */}
      {lineItems.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-right font-medium">{formatCurrency(totals.subtotal)}</span>

              <span className="text-gray-600">Discount:</span>
              <span className="text-right font-medium text-red-600">-{formatCurrency(totals.discountAmount)}</span>

              <span className="text-gray-600">Tax:</span>
              <span className="text-right font-medium">{formatCurrency(totals.taxAmount)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 grid grid-cols-2">
              <span className="font-semibold text-base md:text-lg">Total:</span>
              <span className="text-right font-bold text-lg md:text-xl text-blue-600">
                {formatCurrency(totals.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {sale ? 'Update Sale' : 'Create Sale'}
        </button>
      </div>

      {/* Mobile Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingIndex !== null ? 'Edit Item' : 'Add Item'}
              </h2>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  value={currentItem.productId}
                  onChange={(e) => handleProductChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="0">Select Product</option>
                  {products.filter((p) => p.isActive).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={currentItem.discountPercent}
                    onChange={(e) => setCurrentItem({ ...currentItem, discountPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={currentItem.taxPercent}
                    onChange={(e) => setCurrentItem({ ...currentItem, taxPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Item Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(calculateItemTotal())}</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
