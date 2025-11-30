'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/types/database.types';
import { formatCurrency } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import {
  deriveInitialRating,
  getProductColors,
  getProductGallery,
  getProductSizes,
} from './product-helpers';

interface ProductQuickViewProps {
  product: Product | null;
  manufacturerName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({
  product,
  manufacturerName,
  isOpen,
  onClose,
}: ProductQuickViewProps) {
  const gallery = useMemo(() => (product ? getProductGallery(product) : []), [product]);
  const colors = useMemo(() => (product ? getProductColors(product) : []), [product]);
  const sizes = useMemo(() => (product ? getProductSizes(product) : []), [product]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  if (!product) {
    return null;
  }

  const discountPercent =
    product.mrp > 0
      ? Math.max(
          0,
          Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
        )
      : 0;

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!gallery.length) return;
    setActiveImage((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? gallery.length - 1 : prev - 1;
      }
      return prev === gallery.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} size="xl">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gray-100">
          {gallery.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${product.name} ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                index === activeImage ? 'opacity-100 scale-100' : 'scale-105 opacity-0'
              }`}
            />
          ))}
          <div className="relative z-10 h-[320px] w-full" />

          {gallery.length > 1 && (
            <>
              <button
                onClick={() => handleNavigate('prev')}
                className="glass-button absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleNavigate('next')}
                className="glass-button absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-1 text-white">
                {gallery.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === activeImage ? 'w-6 bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{product.brand}</p>
            {manufacturerName && (
              <p className="text-xs text-gray-500">Manufacturer: {manufacturerName}</p>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(product.sellingPrice)}
            </p>
            {discountPercent > 0 && (
              <>
                <p className="text-gray-400 line-through">{formatCurrency(product.mrp)}</p>
                <Badge variant="danger">{discountPercent}% Off</Badge>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4 text-amber-400" />
            <span>{deriveInitialRating(product)}.0 community rating</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
            <span>{product.currentStock} units available</span>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
          )}

          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Available colors</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color.name}
                  className="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-1 text-sm text-gray-600"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase text-gray-500">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-xl border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-700"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400">SKU</p>
              <p className="font-semibold text-gray-900">{product.sku}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-semibold text-gray-900">{product.category}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400">Base price</p>
              <p className="font-semibold text-gray-900">{formatCurrency(product.basePrice)}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="text-xs text-gray-400">MRP</p>
              <p className="font-semibold text-gray-900">{formatCurrency(product.mrp)}</p>
            </div>
          </div>
        </div>
      </div>

      <ModalFooter className="mt-6">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button>Add to cart</Button>
      </ModalFooter>
    </Modal>
  );
}
