'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePayments } from '@/lib/hooks/use-payments';
import { useInvoices } from '@/lib/hooks/use-invoices';
import { useCustomers } from '@/lib/hooks/use-customers';
import { generateDocumentNumber } from '@/lib/services/storage.service';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

function RecordPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');

  const { addPayment } = usePayments();
  const { getInvoice, updateInvoice } = useInvoices();
  const { getCustomer } = useCustomers();

  const [invoice, setInvoice] = useState(invoiceId ? getInvoice(parseInt(invoiceId)) : null);
  const [customer, setCustomer] = useState(invoice ? getCustomer(invoice.customerId) : null);

  const [formData, setFormData] = useState({
    paymentNumber: generateDocumentNumber('PAY'),
    amount: invoice?.balanceAmount || 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as const,
    transactionRef: '',
    notes: '',
  });

  useEffect(() => {
    if (invoiceId) {
      const inv = getInvoice(parseInt(invoiceId));
      setInvoice(inv);
      if (inv) {
        setCustomer(getCustomer(inv.customerId));
        setFormData((prev) => ({
          ...prev,
          amount: inv.balanceAmount,
        }));
      }
    }
  }, [invoiceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice) {
      toast.error('Invoice not found');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('Payment amount must be greater than zero');
      return;
    }

    if (formData.amount > invoice.balanceAmount) {
      toast.error('Payment amount exceeds balance due');
      return;
    }

    try {
      const now = new Date().toISOString();

      // Create payment record
      addPayment({
        paymentNumber: formData.paymentNumber,
        referenceType: 'invoice',
        referenceId: invoice.id,
        paymentDate: formData.paymentDate,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        transactionRef: formData.transactionRef,
        notes: formData.notes,
        createdAt: now,
      });

      // Update invoice
      const newPaidAmount = invoice.paidAmount + formData.amount;
      const newBalanceAmount = invoice.totalAmount - newPaidAmount;
      const newStatus =
        newBalanceAmount === 0
          ? 'paid'
          : newBalanceAmount < invoice.totalAmount
          ? 'partial'
          : 'unpaid';

      updateInvoice(invoice.id, {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: newStatus,
        updatedAt: now,
      });

      toast.success('Payment recorded successfully!');
      router.push(`/billing/invoices/${invoice.id}`);
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    }
  };

  if (!invoice || !customer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invoice not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
        <p className="mt-1 text-sm text-gray-600">
          Record a payment for invoice {invoice.invoiceNumber}
        </p>
      </div>

      {/* Invoice Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Customer</div>
            <div className="font-medium">{customer.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="font-medium">{formatCurrency(invoice.totalAmount)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Balance Due</div>
            <div className="font-medium text-red-600">{formatCurrency(invoice.balanceAmount)}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Number *
              </label>
              <input
                type="text"
                required
                value={formData.paymentNumber}
                onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="0.01"
                max={invoice.balanceAmount}
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrency(invoice.balanceAmount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method *
              </label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Reference
              </label>
              <input
                type="text"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cheque number, transaction ID, etc."
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RecordPaymentPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-4xl mx-auto">Loading...</div>}>
      <RecordPaymentContent />
    </Suspense>
  );
}
