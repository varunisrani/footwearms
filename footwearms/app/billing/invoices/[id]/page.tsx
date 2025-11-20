'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoices } from '@/lib/hooks/use-invoices';
import { useSales } from '@/lib/hooks/use-sales';
import { useCustomers } from '@/lib/hooks/use-customers';
import { useAppStore } from '@/lib/stores/app-store';
import { usePayments } from '@/lib/hooks/use-payments';
import { settingsService } from '@/lib/services/storage.service';
import { PDFGeneratorService } from '@/lib/services/pdf-generator.service';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = parseInt(params.id as string);

  const { getInvoice } = useInvoices();
  const { getSale, getSaleItems, loadSales } = useSales();
  const { customers, loadCustomers, getCustomer } = useCustomers();
  const { products, loadProducts } = useAppStore();
  const { getPaymentsByReference } = usePayments();

  const [invoice, setInvoice] = useState(getInvoice(invoiceId));
  const [sale, setSale] = useState(invoice ? getSale(invoice.saleId) : null);
  const [saleItems, setSaleItems] = useState(invoice && sale ? getSaleItems(sale.id) : []);
  const [customer, setCustomer] = useState(invoice ? getCustomer(invoice.customerId) : null);
  const [payments, setPayments] = useState(getPaymentsByReference('invoice', invoiceId));

  useEffect(() => {
    loadSales();
    loadCustomers();
    loadProducts();
  }, [loadSales, loadCustomers, loadProducts]);

  useEffect(() => {
    const inv = getInvoice(invoiceId);
    setInvoice(inv);
    if (inv) {
      const s = getSale(inv.saleId);
      setSale(s);
      if (s) {
        setSaleItems(getSaleItems(s.id));
      }
      setCustomer(getCustomer(inv.customerId));
      setPayments(getPaymentsByReference('invoice', invoiceId));
    }
  }, [invoiceId]);

  const handleDownloadPDF = () => {
    if (!invoice || !sale || !customer) {
      toast.error('Missing invoice data');
      return;
    }

    try {
      const settings = settingsService.get();
      const pdfService = new PDFGeneratorService();
      pdfService.generateInvoicePDF(invoice, sale, saleItems, customer, products, settings);
      pdfService.download(`Invoice_${invoice.invoiceNumber}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  if (!invoice || !sale || !customer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invoice not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Generated from Sale Order: {sale.saleNumber}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download PDF
            </button>
            {invoice.balanceAmount > 0 && (
              <Link
                href={`/billing/payments/record?invoiceId=${invoiceId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Record Payment
              </Link>
            )}
            <Link
              href="/billing/invoices"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Invoice Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Invoice Date</dt>
              <dd className="text-sm font-medium">{formatDate(invoice.invoiceDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Due Date</dt>
              <dd className="text-sm font-medium">{formatDate(invoice.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Payment Terms</dt>
              <dd className="text-sm font-medium">{invoice.paymentTerms}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Status</dt>
              <dd>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'overdue'
                      ? 'bg-red-100 text-red-800'
                      : invoice.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {invoice.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Name</dt>
              <dd className="text-sm font-medium">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Business</dt>
              <dd className="text-sm font-medium">{customer.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Phone</dt>
              <dd className="text-sm font-medium">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Email</dt>
              <dd className="text-sm font-medium">{customer.email}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium">{formatCurrency(invoice.subtotal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Discount</dt>
              <dd className="text-sm font-medium text-red-600">
                -{formatCurrency(invoice.discountAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Tax</dt>
              <dd className="text-sm font-medium">{formatCurrency(invoice.taxAmount)}</dd>
            </div>
            <div className="border-t pt-2">
              <dt className="text-sm text-gray-600">Total Amount</dt>
              <dd className="text-lg font-bold">{formatCurrency(invoice.totalAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Paid</dt>
              <dd className="text-sm font-medium text-green-600">
                {formatCurrency(invoice.paidAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Balance Due</dt>
              <dd className="text-sm font-medium text-red-600">
                {formatCurrency(invoice.balanceAmount)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {saleItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {product?.name || 'Unknown Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(item.discountAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(item.taxAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(item.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No payments recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.paymentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {payment.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.transactionRef || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
