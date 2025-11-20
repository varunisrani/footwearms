'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/forms/product-form';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  );
}
