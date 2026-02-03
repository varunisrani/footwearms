'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/lib/types/database.types';
import { formatCurrency } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import {
  Check,
  Eye,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react';
import {
  deriveInitialRating,
  getInventorySignal,
  getProductColors,
  getProductGallery,
  getProductSizes,
} from './product-helpers';

interface ProductCardProps {
  product: Product;
  manufacturerName?: string;
  onQuickView: (product: Product) => void;
  delay?: number;
}

export function ProductCard({
  product,
  manufacturerName,
  onQuickView,
  delay = 0,
}: ProductCardProps) {
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const colors = useMemo(() => getProductColors(product), [product]);
  const sizes = useMemo(() => getProductSizes(product), [product]);
  const inventorySignal = useMemo(() => getInventorySignal(product), [product]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? { name: 'Slate', value: '#475569' });
  const [selectedSize, setSelectedSize] = useState(sizes[2] ?? sizes[0] ?? 'US 8');
  const [qty, setQty] = useState(1);
  const [qtyDirection, setQtyDirection] = useState<'up' | 'down' | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [rating, setRating] = useState(deriveInitialRating(product));
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const discountPercent =
    product.mrp > 0
      ? Math.max(
          0,
          Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
        )
      : 0;

  const handleQuantityChange = (next: number) => {
    if (next < 1) return;
    setQtyDirection(next > qty ? 'up' : 'down');
    setQty(next);
    setTimeout(() => setQtyDirection(null), 220);
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 900);
  };

  return (
    <div
      className="masonry-item product-card-appear relative rounded-3xl border border-gray-200/70 bg-white p-4 shadow-[0_15px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        aria-label="Toggle wishlist"
        onClick={() => setIsWishlisted((prev) => !prev)}
        className={cn(
          'absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-gray-500 shadow-sm transition-all duration-300 hover:scale-105 hover:text-rose-500',
          isWishlisted && 'wishlist-pulse text-rose-500'
        )}
      >
        <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
      </button>

      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {gallery.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`${product.name} view ${index + 1}`}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
              activeImage === index
                ? 'opacity-100 scale-100'
                : 'pointer-events-none opacity-0 scale-105'
            )}
          />
        ))}
        <div className="relative z-10 h-64 w-full bg-gradient-to-tr from-white/0 to-white/10" />

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {discountPercent > 0 && (
            <span className="price-flash text-xs font-semibold uppercase tracking-wide text-white">
              {discountPercent}% off
            </span>
          )}
          <Badge variant={inventorySignal.tone} className="text-[11px] font-semibold">
            {inventorySignal.label}
          </Badge>
        </div>

        <button
          onClick={() => onQuickView(product)}
          className="product-quick-view absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 rounded-2xl bg-white/90 py-2 text-sm font-semibold text-gray-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" />
          Quick view
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {gallery.map((image, index) => (
          <button
            key={`thumb-${image}-${index}`}
            onMouseEnter={() => setActiveImage(index)}
            onFocus={() => setActiveImage(index)}
            className={cn(
              'h-16 flex-1 overflow-hidden rounded-xl border-2 border-transparent transition-all duration-200',
              activeImage === index && 'border-blue-600 shadow-lg'
            )}
          >
            <img
              src={image}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
              {product.brand}
            </p>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            {manufacturerName && (
              <p className="text-xs text-gray-500">by {manufacturerName}</p>
            )}
          </div>
          <div className="text-right">
            <div className="price-burst text-2xl font-bold text-gray-900">
              {formatCurrency(product.sellingPrice)}
            </div>
            {discountPercent > 0 && (
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(product.mrp)}
              </p>
            )}
          </div>
        </div>

        <StarRating
          rating={rating}
          hoverRating={hoverRating}
          onHover={setHoverRating}
          onSelect={setRating}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={cn(
                'relative h-10 w-10 rounded-2xl border-2 border-transparent transition-all duration-300 hover:translate-y-[-2px]',
                selectedColor.name === color.name && 'border-gray-900 shadow-lg'
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor.name === color.name && (
                <span className="absolute inset-1 rounded-xl border border-white/70" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                'rounded-2xl border border-gray-200 px-3 py-1 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-gray-900 hover:text-gray-900',
                selectedSize === size && 'size-pill-active'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 px-3 py-2">
          <QuantityButton
            ariaLabel="Decrease quantity"
            icon={<Minus className="h-4 w-4" />}
            onClick={() => handleQuantityChange(qty - 1)}
          />
          <div
            className={cn(
              'text-lg font-semibold text-gray-900 transition-transform duration-200',
              qtyDirection === 'up' && 'quantity-bounce-up',
              qtyDirection === 'down' && 'quantity-bounce-down'
            )}
          >
            {qty}
          </div>
          <QuantityButton
            ariaLabel="Increase quantity"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => handleQuantityChange(qty + 1)}
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={cn(
            'relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-blue-200',
            isAddingToCart && 'ring-4 ring-blue-100'
          )}
        >
          <span
            className={cn(
              'mr-2 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/20 text-white transition-all duration-200',
              isAddingToCart && 'scale-110'
            )}
          >
            {isAddingToCart ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </span>
          {isAddingToCart ? 'Added to cart' : 'Add to cart'}

          <span className="pointer-events-none absolute inset-0 animate-[shine_2.5s_ease_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <p>SKU: {product.sku}</p>
        <p>Stock: {product.currentStock}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-blue-600">
        <button
          className="font-semibold transition-colors hover:text-blue-800"
          onClick={() => onQuickView(product)}
        >
          Quick details
        </button>
        <span className="text-gray-400">Tap for preview →</span>
      </div>
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  hoverRating: number | null;
  onHover: (value: number | null) => void;
  onSelect: (value: number) => void;
}

function StarRating({ rating, hoverRating, onHover, onSelect }: StarRatingProps) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const isActive = (hoverRating ?? rating) >= value;
        return (
          <button
            key={value}
            type="button"
            onMouseEnter={() => onHover(value)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(value)}
            className="rounded-full p-1 text-amber-500 transition-transform duration-150 hover:scale-110"
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                isActive ? 'fill-current text-amber-400' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
      <span className="text-xs font-medium text-gray-500">{rating}.0</span>
    </div>
  );
}

interface QuantityButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
}

function QuantityButton({ onClick, icon, ariaLabel }: QuantityButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white"
    >
      {icon}
    </button>
  );
}
