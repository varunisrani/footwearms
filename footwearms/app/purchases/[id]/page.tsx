'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PurchaseForm } from '@/components/forms/purchase-form';
import { useAppStore } from '@/lib/stores/app-store';
import { Purchase } from '@/lib/types/database.types';

export default function EditPurchasePage({ params }: { params: { id: string } }) {
  const { purchases, loadPurchases } = useAppStore();
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  useEffect(() => {
    const purchaseId = parseInt(params.id);
    const foundPurchase = purchases.find(p => p.id === purchaseId);
    if (foundPurchase) {
      setPurchase(foundPurchase);
    }
  }, [purchases, params.id]);

  if (!purchase) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading purchase order...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/purchases"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Purchase Orders
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Purchase Order</h1>
        <p className="text-gray-600 mt-1">Update purchase order information</p>
      </div>

      {/* Form */}
      <PurchaseForm purchase={purchase} isEdit={true} />
    </div>
  );
}
