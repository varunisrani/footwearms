'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PurchaseForm } from '@/components/forms/purchase-form';

export default function NewPurchasePage() {
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
        <h1 className="text-3xl font-bold text-gray-900">New Purchase Order</h1>
        <p className="text-gray-600 mt-1">Create a new purchase order for inventory</p>
      </div>

      {/* Form */}
      <PurchaseForm />
    </div>
  );
}
