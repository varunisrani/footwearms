import { Product } from '@/lib/types/database.types';

export type ProductColorOption = { name: string; value: string };

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1528701800489-20be3cbe3630?auto=format&fit=crop&w=900&q=80',
];

const COLOR_PRESETS: Record<string, ProductColorOption[]> = {
  casual: [
    { name: 'Slate', value: '#475569' },
    { name: 'Sand', value: '#e7c9a9' },
    { name: 'Ocean', value: '#2563eb' },
  ],
  sports: [
    { name: 'Neon', value: '#a7f3d0' },
    { name: 'Volt', value: '#bef264' },
    { name: 'Peak', value: '#f97316' },
  ],
  formal: [
    { name: 'Onyx', value: '#0f172a' },
    { name: 'Chestnut', value: '#7c2d12' },
    { name: 'Pearl', value: '#f8fafc' },
  ],
  boots: [
    { name: 'Earth', value: '#78350f' },
    { name: 'Forest', value: '#065f46' },
    { name: 'Stone', value: '#94a3b8' },
  ],
};

const SIZE_PRESETS: Record<string, string[]> = {
  default: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
  sports: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
  boots: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
};

export function getProductGallery(product: Product): string[] {
  if (product.imageUrl) {
    return [
      product.imageUrl,
      `${product.imageUrl}?auto=format&fit=crop&w=900&q=75`,
      `${product.imageUrl}?auto=format&fit=crop&w=900&q=60`,
    ];
  }

  const seed = product.id % FALLBACK_IMAGES.length;
  return Array.from({ length: 3 }, (_, idx) => {
    const imageIndex = (seed + idx) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[imageIndex];
  });
}

export function getProductColors(product: Product) {
  const category = product.category?.toLowerCase() || '';
  if (category.includes('sport') || category.includes('run')) return COLOR_PRESETS.sports;
  if (category.includes('boot')) return COLOR_PRESETS.boots;
  if (category.includes('formal')) return COLOR_PRESETS.formal;
  return COLOR_PRESETS.casual;
}

export function getProductSizes(product: Product) {
  const category = product.category?.toLowerCase() || '';
  if (category.includes('sport') || category.includes('run')) return SIZE_PRESETS.sports;
  if (category.includes('boot')) return SIZE_PRESETS.boots;
  return SIZE_PRESETS.default;
}

export function deriveInitialRating(product: Product) {
  return ((product.id % 3) + 3) as 3 | 4 | 5;
}

export function getInventorySignal(product: Product) {
  if (product.currentStock <= product.minStockLevel) {
    return { tone: 'danger' as const, label: 'Low stock' };
  }
  if (product.currentStock < product.minStockLevel * 1.5) {
    return { tone: 'warning' as const, label: 'Monitor stock' };
  }
  return { tone: 'success' as const, label: 'In stock' };
}
