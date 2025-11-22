'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInvoices } from '@/lib/hooks/use-invoices';
import { useSales } from '@/lib/hooks/use-sales';
import { useCustomers } from '@/lib/hooks/use-customers';
import { generateDocumentNumber } from '@/lib/services/storage.service';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = searchParams.get('saleId');

  const { addInvoice } = useInvoices();
  const { sales, loadSales, getSale } = useSales();
  const { customers, loadCustomers } = useCustomers();

  const [formData, setFormData] = useState({
    invoiceNumber: generateDocumentNumber('INV'),
    saleId: saleId ? parseInt(saleId) : 0,
    customerId: 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Net 30',
    notes: '',
  });

  useEffect(() => {
    loadSales();
    loadCustomers();
  }, [loadSales, loadCustomers]);

  useEffect(() => {
    if (formData.saleId > 0) {
      const sale = getSale(formData.saleId);
      if (sale) {
        setFormData((prev) => ({
          ...prev,
          customerId: sale.customerId,
        }));
      }
    }
  }, [formData.saleId, getSale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.saleId === 0) {
      toast.error('Please select a sale order');
      return;
    }

    const sale = getSale(formData.saleId);
    if (!sale) {
      toast.error('Sale not found');
      return;
    }

    const now = new Date().toISOString();
    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      saleId: formData.saleId,
      customerId: sale.customerId,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      subtotal: sale.subtotal,
      taxAmount: sale.taxAmount,
      discountAmount: sale.discountAmount,
      totalAmount: sale.totalAmount,
      paidAmount: 0,
      balanceAmount: sale.totalAmount,
      status: 'unpaid' as const,
      paymentTerms: formData.paymentTerms,
      notes: formData.notes,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const newInvoice = addInvoice(invoiceData);
      toast.success('Invoice created successfully!');
      router.push(`/billing/invoices/${newInvoice.id}`);
    } catch (error) {
      toast.error('Failed to create invoice');
      console.error(error);
    }
  };

  const availableSales = sales.filter((s) =>
    s.status === 'delivered' ||
    s.status === 'confirmed' ||
    s.status === 'processing' ||
    s.status === 'shipped'
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="mt-1 text-sm text-gray-600">
          Generate an invoice from a sales order
        </p>
        {availableSales.length === 0 && sales.length > 0 && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              No sales orders available for invoicing. Sales must have status: Confirmed, Processing, Shipped, or Delivered.
              You have {sales.length} total sales. Please update the status of your sales orders first.
            </p>
          </div>
        )}
        {sales.length === 0 && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              No sales orders found. Please create a sales order first before generating an invoice.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number *
              </label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales Order *
              </label>
              <select
                required
                value={formData.saleId}
                onChange={(e) => setFormData({ ...formData, saleId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="0">Select Sales Order</option>
                {availableSales.map((sale) => {
                  const customer = customers.find((c) => c.id === sale.customerId);
                  return (
                    <option key={sale.id} value={sale.id}>
                      {sale.saleNumber} - {customer?.name} (₹{sale.totalAmount.toFixed(2)})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                required
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Net 30, Net 60"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
