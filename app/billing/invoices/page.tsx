'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useInvoices } from '@/lib/hooks/use-invoices';
import { useCustomers } from '@/lib/hooks/use-customers';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function InvoicesPage() {
  const { invoices, getInvoices, getTotalOutstanding, getOverdueInvoices } = useInvoices();
  const { customers, loadCustomers } = useCustomers();

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const overdueInvoices = getOverdueInvoices();

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage invoices and track payments
            </p>
          </div>
          <Link
            href="/billing/invoices/new"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <span>+</span>
            New Invoice
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Invoices</div>
          <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Outstanding</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(getTotalOutstanding())}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Overdue</div>
          <div className="text-2xl font-bold text-orange-600">
            {overdueInvoices.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Paid Invoices</div>
          <div className="text-2xl font-bold text-green-600">
            {invoices.filter((i) => i.status === 'paid').length}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCustomerName(invoice.customerId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${invoice.balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(invoice.balanceAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/billing/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {invoice.balanceAmount > 0 && (
                          <Link
                            href={`/billing/payments/record?invoiceId=${invoice.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Record Payment
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
