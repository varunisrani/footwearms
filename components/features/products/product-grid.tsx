'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filter, Layers3, Sparkles } from 'lucide-react';
import { Product, Manufacturer } from '@/lib/types/database.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { ProductCard } from './product-card';
import { ProductQuickView } from './product-quick-view';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductShowcaseProps {
  products: Product[];
  manufacturers: Manufacturer[];
  isLoading: boolean;
}

export function ProductShowcase({ products, manufacturers, isLoading }: ProductShowcaseProps) {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<'featured' | 'price_low' | 'price_high' | 'stock_low'>(
    'featured'
  );
  const [isFiltering, setIsFiltering] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category))).filter(Boolean);
    return ['all', ...unique];
  }, [products]);

  const manufacturerLookup = useMemo(() => {
    const lookup = new Map<number, string>();
    manufacturers.forEach((manufacturer) => lookup.set(manufacturer.id, manufacturer.name));
    return lookup;
  }, [manufacturers]);

  useEffect(() => {
    if (isLoading) return;
    setIsFiltering(true);
    const timeout = setTimeout(() => setIsFiltering(false), 400);
    return () => clearTimeout(timeout);
  }, [category, sort, searchTerm, isLoading]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (category !== 'all') {
      result = result.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sort === 'price_high') return b.sellingPrice - a.sellingPrice;
      if (sort === 'price_low') return a.sellingPrice - b.sellingPrice;
      if (sort === 'stock_low') return a.currentStock - b.currentStock;

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [products, category, searchTerm, sort]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Product experience</p>
              <h2 className="text-xl font-semibold text-gray-900">
                Curated grid with motion & insights
              </h2>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-3">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, SKU, or brand..."
              className="flex-1 rounded-2xl border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900"
            />

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as 'featured' | 'price_low' | 'price_high' | 'stock_low')
              }
              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="featured">Trending</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="stock_low">Stock: Low First</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <Filter className="h-4 w-4" />
            Categories
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCategory(option)}
                className={cn(
                  'rounded-2xl border border-transparent px-3 py-1.5 text-sm font-medium capitalize transition-all duration-200',
                  category === option
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:border-gray-300 hover:bg-white'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <ProductSkeletonGrid />
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Layers3 className="mx-auto mb-4 h-10 w-10 text-gray-300" />
          <p className="text-base font-semibold text-gray-900">No products match this filter</p>
          <p className="mt-1 text-sm text-gray-500">Try a different category or search term.</p>
          <Button className="mt-6 rounded-2xl" onClick={() => setCategory('all')}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'masonry-grid transition duration-300',
            isFiltering && 'filter-wave'
          )}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              manufacturerName={manufacturerLookup.get(product.manufacturerId)}
              onQuickView={setQuickViewProduct}
              delay={index * 80}
            />
          ))}
        </div>
      )}

      <ProductQuickView
        product={quickViewProduct}
        manufacturerName={
          quickViewProduct ? manufacturerLookup.get(quickViewProduct.manufacturerId) : undefined
        }
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="masonry-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="masonry-item rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <Skeleton className="h-60 w-full rounded-2xl" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
