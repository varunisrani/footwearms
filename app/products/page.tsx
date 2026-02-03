'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Layers,
  Boxes,
  Tag,
  Factory,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency } from '@/lib/utils/format';
import toast from 'react-hot-toast';

type HallFilter = 'all' | 'active' | 'low-stock' | 'inactive';

type StatCard = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
};

const FILTER_META: Record<HallFilter, { label: string; description: string }> = {
  all: { label: 'All styles', description: 'Everything in the hall' },
  active: { label: 'On display', description: 'Currently selling' },
  'low-stock': { label: 'Low stock', description: 'Needs replenishment' },
  inactive: { label: 'Archived', description: 'Off the floor' },
};

const StatsSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm">
    <div className="h-4 w-24 rounded bg-gray-200" />
    <div className="mt-5 h-8 w-32 rounded bg-gray-200" />
    <div className="mt-3 h-3 w-32 rounded bg-gray-100" />
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="animate-pulse rounded-xl border border-gray-100 bg-white/70 p-4">
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

export default function ProductsPage() {
  const { products, manufacturers, loadProducts, loadManufacturers, deleteProduct } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<HallFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadProducts();
    loadManufacturers();
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [loadProducts, loadManufacturers]);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  const getManufacturerName = (manufacturerId: number) => {
    const manufacturer = manufacturers.find((m) => m.id === manufacturerId);
    return manufacturer?.name || 'Unknown';
  };

  const activeProducts = useMemo(() => products.filter((product) => product.isActive).length, [products]);
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.currentStock <= product.minStockLevel),
    [products]
  );
  const inactiveProducts = useMemo(() => products.filter((product) => !product.isActive), [products]);
  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.currentStock, 0), [products]);
  const brandCount = useMemo(() => {
    const brands = new Set(
      products
        .map((product) => product.brand.trim())
        .filter((brand) => Boolean(brand))
    );
    return brands.size;
  }, [products]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!normalizedSearch) return true;
        return (
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.sku.toLowerCase().includes(normalizedSearch) ||
          product.brand.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((product) => {
        switch (activeFilter) {
          case 'active':
            return product.isActive;
          case 'inactive':
            return !product.isActive;
          case 'low-stock':
            return product.currentStock <= product.minStockLevel;
          default:
            return true;
        }
      });
  }, [products, normalizedSearch, activeFilter]);

  const hallSpotlight = useMemo(() => filteredProducts.slice(0, 3), [filteredProducts]);

  const hallFilters = useMemo(
    () => [
      { id: 'all' as const, count: products.length },
      { id: 'active' as const, count: activeProducts },
      { id: 'low-stock' as const, count: lowStockProducts.length },
      { id: 'inactive' as const, count: inactiveProducts.length },
    ],
    [products.length, activeProducts, lowStockProducts.length, inactiveProducts.length]
  );

  const stats = useMemo<StatCard[]>(
    () => [
      {
        label: 'Styles on display',
        value: products.length.toLocaleString(),
        helper: `${activeProducts} active in the hall`,
        icon: Layers,
        gradient: 'from-sky-50 via-white to-white',
        iconBg: 'bg-sky-100 text-sky-600',
      },
      {
        label: 'Inventory on hand',
        value: totalStock.toLocaleString(),
        helper: 'Pairs ready to ship',
        icon: Boxes,
        gradient: 'from-emerald-50 via-white to-white',
        iconBg: 'bg-emerald-100 text-emerald-600',
      },
      {
        label: 'Low stock alerts',
        value: lowStockProducts.length.toLocaleString(),
        helper: 'Monitor replenishment',
        icon: Tag,
        gradient: 'from-rose-50 via-white to-white',
        iconBg: 'bg-rose-100 text-rose-600',
      },
      {
        label: 'Partner brands',
        value: brandCount.toLocaleString(),
        helper: `${manufacturers.length} manufacturers`,
        icon: Factory,
        gradient: 'from-violet-50 via-white to-white',
        iconBg: 'bg-violet-100 text-violet-600',
      },
    ],
    [
      products.length,
      activeProducts,
      totalStock,
      lowStockProducts.length,
      brandCount,
      manufacturers.length,
    ]
  );

  const emptyState = filteredProducts.length === 0 && !isLoading;
  const searchIsDirty = Boolean(normalizedSearch) || activeFilter !== 'all';

  return (
    <div className="space-y-5 md:space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <CardContent className="relative z-10 px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Showroom Hall</p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">Curate your footwear product hall</h1>
              <p className="mt-3 max-w-2xl text-base text-white/80">
                Blend merchandising, availability, and storytelling to offer buyers the most compelling view of
                your collection.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                  <Layers className="h-4 w-4" />
                  {products.length} styles curated
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                  <Tag className="h-4 w-4" />
                  {lowStockProducts.length} need attention
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/products/new">
                <Button
                  className="w-full bg-gradient-to-r from-white via-white to-slate-100 text-blue-700 shadow-lg shadow-blue-900/20 hover:from-slate-50 hover:to-white sm:w-auto"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add a new style
                </Button>
              </Link>
              <Link href="/inventory/alerts">
                <Button
                  variant="ghost"
                  className="w-full border border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  Review low stock
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <StatsSkeleton key={index} />)
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-80`} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="mt-2 text-sm text-gray-500">{stat.helper}</p>
                    </div>
                    <span
                      className={`rounded-2xl p-3 text-sm shadow-inner shadow-white/40 transition group-hover:scale-110 ${stat.iconBg}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                </div>
              );
            })}
      </div>

      <Card className="border-gray-100 shadow-lg">
        <CardHeader className="gap-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Product hall inventory</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Search, filter, and spotlight every style you showcase to buyers.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  aria-label="Search products"
                  placeholder="Search by SKU, name, brand..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="rounded-full border-gray-200 bg-white/80 pl-11 pr-4 text-sm shadow-inner shadow-gray-100 focus:ring-blue-500"
                />
              </div>
              {searchIsDirty && (
                <Button
                  variant="ghost"
                  className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 sm:w-auto"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Filter className="h-4 w-4 text-gray-400" />
              Viewing: {FILTER_META[activeFilter].label}
              <span className="text-gray-400">• {FILTER_META[activeFilter].description}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {hallFilters.map((filter) => {
                const isActive = filter.id === activeFilter;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {FILTER_META[filter.id].label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {hallSpotlight.length > 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-gray-50 via-white to-white p-5 shadow-inner shadow-gray-100">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Spotlight</p>
                  <p className="text-base text-gray-500">First impression cards for your hall entrance</p>
                </div>
                <span className="text-sm text-gray-500">
                  Showing {hallSpotlight.length} of {filteredProducts.length} results
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {hallSpotlight.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm ring-1 ring-transparent transition hover:-translate-y-1 hover:shadow-xl hover:ring-blue-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {product.category}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                      <Badge variant={product.isActive ? 'success' : 'default'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-gray-900">{formatCurrency(product.sellingPrice)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                        <Factory className="h-3.5 w-3.5" />
                        {getManufacturerName(product.manufacturerId)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                          product.currentStock <= product.minStockLevel
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        Stock {product.currentStock}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-sm text-gray-500">
                      <span className="font-mono text-xs uppercase tracking-wide text-gray-400">SKU {product.sku}</span>
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                      >
                        Edit style
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <TableSkeleton />
          ) : emptyState ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No styles match your filters</h3>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Try updating your filters or adding a new product to keep the hall vibrant.
              </p>
              <Link href="/products/new" className="mt-6">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add a product
                </Button>
              </Link>
            </div>
          ) : (
            <ResponsiveTable
              data={filteredProducts}
              tableView={
                <Table className="rounded-2xl border border-gray-100 shadow-sm">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Style</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="transition-all hover:-translate-y-0.5">
                        <TableCell className="font-mono text-xs text-gray-500">{product.sku}</TableCell>
                        <TableCell className="font-semibold text-gray-900">{product.name}</TableCell>
                        <TableCell className="text-gray-600">{product.brand}</TableCell>
                        <TableCell>
                          <Badge variant="info" className="bg-blue-50 text-blue-700">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{getManufacturerName(product.manufacturerId)}</TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${
                              product.currentStock <= product.minStockLevel ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {product.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatCurrency(product.sellingPrice)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'success' : 'default'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/products/${product.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:bg-rose-50"
                              aria-label={`Delete ${product.name}`}
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              mobileCardRender={(product) => (
                <Card className="rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">SKU {product.sku}</p>
                      <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="info" className="bg-blue-50 text-blue-700">
                          {product.category}
                        </Badge>
                        <Badge variant={product.isActive ? 'success' : 'default'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-gray-900">{formatCurrency(product.sellingPrice)}</p>
                      <p
                        className={`text-xs ${product.currentStock <= product.minStockLevel ? 'text-rose-600' : 'text-gray-500'}`}
                      >
                        Stock {product.currentStock}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-dashed border-gray-200 pt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-gray-400" />
                      {getManufacturerName(product.manufacturerId)}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700">
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
