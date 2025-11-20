'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCustomers } from '@/lib/hooks/use-customers';
import { useSales } from '@/lib/hooks/use-sales';
import { CustomerForm } from '@/components/forms/customer-form';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = parseInt(params.id as string);
  const isEditing = searchParams.get('edit') === 'true';

  const { getCustomer, updateCustomer, loadCustomers } = useCustomers();
  const { getSalesByCustomer, sales, loadSales } = useSales();
  const [customer, setCustomer] = useState(getCustomer(customerId));
  const [customerSales, setCustomerSales] = useState(getSalesByCustomer(customerId));

  useEffect(() => {
    loadCustomers();
    loadSales();
  }, [loadCustomers, loadSales]);

  useEffect(() => {
    setCustomer(getCustomer(customerId));
    setCustomerSales(getSalesByCustomer(customerId));
  }, [customerId, sales]);

  const handleUpdate = (data: any) => {
    try {
      updateCustomer(customerId, data);
      toast.success('Customer updated successfully!');
      router.push(`/customers/${customerId}`);
    } catch (error) {
      toast.error('Failed to update customer');
      console.error(error);
    }
  };

  if (!customer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Customer not found
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update customer information
          </p>
        </div>

        <CustomerForm customer={customer} onSubmit={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="mt-1 text-sm text-gray-600">{customer.businessName}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/sales/new?customerId=${customerId}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              New Sale
            </Link>
            <Link
              href={`/customers/${customerId}?edit=true`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/customers"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Contact Person</dt>
              <dd className="text-sm font-medium">{customer.contactPerson}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Email</dt>
              <dd className="text-sm font-medium">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Phone</dt>
              <dd className="text-sm font-medium">{customer.phone}</dd>
            </div>
            {customer.gstin && (
              <div>
                <dt className="text-sm text-gray-600">GSTIN</dt>
                <dd className="text-sm font-medium">{customer.gstin}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Billing Address</dt>
              <dd className="text-sm font-medium whitespace-pre-line">
                {customer.billingAddress}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Shipping Address</dt>
              <dd className="text-sm font-medium whitespace-pre-line">
                {customer.shippingAddress}
              </dd>
            </div>
          </dl>
        </div>

        {/* Financial Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Financial</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Customer Type</dt>
              <dd className="text-sm font-medium capitalize">{customer.customerType}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Credit Limit</dt>
              <dd className="text-sm font-medium">{formatCurrency(customer.creditLimit)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Outstanding Balance</dt>
              <dd className="text-sm font-medium text-red-600">
                {formatCurrency(customer.outstandingBalance)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Status</dt>
              <dd>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        {customerSales.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No sales yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sale Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerSales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {sale.saleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(sale.saleDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(sale.balanceAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/sales/${sale.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
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
