'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSales } from '@/lib/hooks/use-sales';
import { useCustomers } from '@/lib/hooks/use-customers';
import { useAppStore } from '@/lib/stores/app-store';
import { SalesForm } from '@/components/forms/sales-form';
import toast from 'react-hot-toast';
import type { Sale, SaleItem } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

function NewSaleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const { addSale, addSaleItem } = useSales();
  const { customers, loadCustomers } = useCustomers();
  const { products, loadProducts, updateProduct } = useAppStore();

  useEffect(() => {
    loadCustomers();
    loadProducts();
  }, [loadCustomers, loadProducts]);

  const handleSubmit = (saleData: Omit<Sale, 'id'>, itemsData: Omit<SaleItem, 'id' | 'saleId'>[]) => {
    try {
      // Create sale
      const newSale = addSale(saleData);

      // Add sale items
      itemsData.forEach((item) => {
        addSaleItem({
          ...item,
          saleId: newSale.id,
        });

        // Reduce product stock
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          updateProduct(item.productId, {
            currentStock: product.currentStock - item.quantity,
            updatedAt: new Date().toISOString(),
          });
        }
      });

      // Update customer outstanding balance
      const customer = customers.find((c) => c.id === saleData.customerId);
      if (customer) {
        // This would be done via customer update hook
      }

      toast.success('Sale created successfully!');
      router.push(`/sales/${newSale.id}`);
    } catch (error) {
      toast.error('Failed to create sale');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Sale</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new sales order
        </p>
      </div>

      <SalesForm
        customers={customers}
        products={products}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function NewSalePage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-6xl mx-auto">Loading...</div>}>
      <NewSaleContent />
    </Suspense>
  );
}
