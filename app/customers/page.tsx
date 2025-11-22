'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCustomers } from '@/lib/hooks/use-customers';
import { CustomersTable } from '@/components/tables/customers-table';

export default function CustomersPage() {
  const { customers, loadCustomers, deleteCustomer } = useCustomers();

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your customer database
            </p>
          </div>
          <Link
            href="/customers/new"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <span>+</span>
            Add Customer
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Customers</div>
          <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active Customers</div>
          <div className="text-2xl font-bold text-green-600">
            {customers.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Retailers</div>
          <div className="text-2xl font-bold text-blue-600">
            {customers.filter((c) => c.customerType === 'retailer').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Wholesalers</div>
          <div className="text-2xl font-bold text-purple-600">
            {customers.filter((c) => c.customerType === 'wholesaler').length}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <CustomersTable customers={customers} onDelete={deleteCustomer} />
    </div>
  );
}
