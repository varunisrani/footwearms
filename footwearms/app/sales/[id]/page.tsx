'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSales } from '@/lib/hooks/use-sales';
import { useCustomers } from '@/lib/hooks/use-customers';
import { useAppStore } from '@/lib/stores/app-store';
import { SalesForm } from '@/components/forms/sales-form';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';
import type { Sale, SaleItem } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const saleId = parseInt(params.id as string);
  const isEditing = searchParams.get('edit') === 'true';

  const { getSale, getSaleItems, updateSale, updateSaleItem, deleteSaleItem, addSaleItem, loadSales } = useSales();
  const { customers, loadCustomers, getCustomer } = useCustomers();
  const { products, loadProducts, getProduct, updateProduct } = useAppStore();

  const [sale, setSale] = useState(getSale(saleId));
  const [saleItems, setSaleItems] = useState(getSaleItems(saleId));

  useEffect(() => {
    loadSales();
    loadCustomers();
    loadProducts();
  }, [loadSales, loadCustomers, loadProducts]);

  useEffect(() => {
    setSale(getSale(saleId));
    setSaleItems(getSaleItems(saleId));
  }, [saleId]);

  const handleUpdate = (saleData: Omit<Sale, 'id'>, itemsData: Omit<SaleItem, 'id' | 'saleId'>[]) => {
    try {
      // Restore stock for old items
      saleItems.forEach((oldItem) => {
        const product = getProduct(oldItem.productId);
        if (product) {
          updateProduct(oldItem.productId, {
            currentStock: product.currentStock + oldItem.quantity,
            updatedAt: new Date().toISOString(),
          });
        }
      });

      // Delete old items
      saleItems.forEach((item) => {
        deleteSaleItem(item.id);
      });

      // Update sale
      updateSale(saleId, saleData);

      // Add new items and reduce stock
      itemsData.forEach((item) => {
        addSaleItem({
          ...item,
          saleId,
        });

        const product = getProduct(item.productId);
        if (product) {
          updateProduct(item.productId, {
            currentStock: product.currentStock - item.quantity,
            updatedAt: new Date().toISOString(),
          });
        }
      });

      toast.success('Sale updated successfully!');
      router.push(`/sales/${saleId}`);
    } catch (error) {
      toast.error('Failed to update sale');
      console.error(error);
    }
  };

  if (!sale) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Sale not found
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Sale</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update sale information
          </p>
        </div>

        <SalesForm
          sale={sale}
          saleItems={saleItems}
          customers={customers}
          products={products}
          onSubmit={handleUpdate}
        />
      </div>
    );
  }

  const customer = getCustomer(sale.customerId);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sale.saleNumber}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Customer: {customer?.name || 'Unknown'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/billing/invoices/new?saleId=${saleId}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Generate Invoice
            </Link>
            <Link
              href={`/sales/${saleId}?edit=true`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              href="/sales"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Sale Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sale Details</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Sale Date</dt>
              <dd className="text-sm font-medium">{formatDate(sale.saleDate)}</dd>
            </div>
            {sale.deliveryDate && (
              <div>
                <dt className="text-sm text-gray-600">Delivery Date</dt>
                <dd className="text-sm font-medium">{formatDate(sale.deliveryDate)}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-gray-600">Status</dt>
              <dd>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                    sale.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : sale.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {sale.status}
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
              <dd className="text-sm font-medium">{customer?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Business</dt>
              <dd className="text-sm font-medium">{customer?.businessName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Phone</dt>
              <dd className="text-sm font-medium">{customer?.phone}</dd>
            </div>
            <div>
              <Link
                href={`/customers/${customer?.id}`}
                className="text-sm text-blue-600 hover:text-blue-900"
              >
                View Customer Details →
              </Link>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium">{formatCurrency(sale.subtotal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Discount</dt>
              <dd className="text-sm font-medium text-red-600">
                -{formatCurrency(sale.discountAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Tax</dt>
              <dd className="text-sm font-medium">{formatCurrency(sale.taxAmount)}</dd>
            </div>
            <div className="border-t pt-2">
              <dt className="text-sm text-gray-600">Total Amount</dt>
              <dd className="text-lg font-bold">{formatCurrency(sale.totalAmount)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Paid</dt>
              <dd className="text-sm font-medium text-green-600">
                {formatCurrency(sale.paidAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Balance Due</dt>
              <dd className="text-sm font-medium text-red-600">
                {formatCurrency(sale.balanceAmount)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sale Items */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Items</h2>
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
                const product = getProduct(item.productId);
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
                      {formatCurrency(item.discountAmount)} ({item.discountPercent}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(item.taxAmount)} ({item.taxPercent}%)
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

      {/* Notes */}
      {sale.notes && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{sale.notes}</p>
        </div>
      )}
    </div>
  );
}
