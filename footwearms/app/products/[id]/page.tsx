'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/forms/product-form';
import { useAppStore } from '@/lib/stores/app-store';
import { Product } from '@/lib/types/database.types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { products, loadProducts } = useAppStore();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const productId = parseInt(params.id);
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [products, params.id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      {/* Form */}
      <ProductForm product={product} isEdit={true} />
    </div>
  );
}
