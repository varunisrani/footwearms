'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSales } from '@/lib/hooks/use-sales';
import { useCustomers } from '@/lib/hooks/use-customers';
import { SalesTable } from '@/components/tables/sales-table';
import { formatCurrency } from '@/lib/utils/format';

export default function SalesPage() {
  const { sales, loadSales, deleteSale, getTotalSales, getPendingPayments } = useSales();
  const { customers, loadCustomers } = useCustomers();

  useEffect(() => {
    loadSales();
    loadCustomers();
  }, [loadSales, loadCustomers]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your sales orders and transactions
            </p>
          </div>
          <Link
            href="/sales/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <span>+</span>
            New Sale
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Sales</div>
          <div className="text-2xl font-bold text-gray-900">{sales.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(getTotalSales())}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pending Payments</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(getPendingPayments())}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold text-blue-600">
            {sales.filter((s) => s.status === 'delivered').length}
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <SalesTable sales={sales} customers={customers} onDelete={deleteSale} />
    </div>
  );
}
