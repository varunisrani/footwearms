'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSales } from '@/lib/hooks/use-sales';
import { useSalesReturns } from '@/lib/hooks/use-sales-returns';
import { useAppStore } from '@/lib/stores/app-store';
import { SalesReturnForm } from '@/components/forms/sales-return-form';
import toast from 'react-hot-toast';
import type { SalesReturn, SalesReturnItem } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

export default function NewSalesReturnPage() {
  const params = useParams();
  const router = useRouter();
  const saleId = parseInt(params.id as string);

  const { getSale, getSaleItems } = useSales();
  const { addSalesReturn, addSalesReturnItem } = useSalesReturns();
  const { products, loadProducts, getProduct, updateProduct } = useAppStore();

  const sale = getSale(saleId);
  const saleItems = getSaleItems(saleId);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSubmit = (
    salesReturn: Omit<SalesReturn, 'id'>,
    items: Omit<SalesReturnItem, 'id' | 'returnId'>[]
  ) => {
    try {
      // Create the sales return
      const newReturn = addSalesReturn(salesReturn);

      // Add return items and restore inventory
      items.forEach((item) => {
        addSalesReturnItem({
          ...item,
          returnId: newReturn.id,
        });

        // Restore inventory if return is approved or pending
        if (salesReturn.status === 'approved' || salesReturn.status === 'pending') {
          const product = getProduct(item.productId);
          if (product) {
            updateProduct(item.productId, {
              currentStock: product.currentStock + item.quantityReturned,
              updatedAt: new Date().toISOString(),
            });
          }
        }
      });

      toast.success('Sales return created successfully!');
      router.push(`/sales/${saleId}`);
    } catch (error) {
      toast.error('Failed to create sales return');
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

  if (saleItems.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No items found for this sale
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Sales Return</h1>
            <p className="mt-1 text-sm text-gray-600">
              Sale: {sale.saleNumber}
            </p>
          </div>
          <Link
            href={`/sales/${saleId}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Sale
          </Link>
        </div>
      </div>

      {/* Form */}
      <SalesReturnForm
        sale={sale}
        saleItems={saleItems}
        products={products}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
