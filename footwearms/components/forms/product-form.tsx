'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/stores/app-store';
import { Product } from '@/lib/types/database.types';
import { generateSKU } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

interface ProductFormData {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  manufacturerId: string;
  basePrice: string;
  sellingPrice: string;
  mrp: string;
  currentStock: string;
  minStockLevel: string;
  isActive: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { manufacturers, addProduct, updateProduct, loadManufacturers } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    defaultValues: product
      ? {
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description || '',
          manufacturerId: product.manufacturerId.toString(),
          basePrice: product.basePrice.toString(),
          sellingPrice: product.sellingPrice.toString(),
          mrp: product.mrp.toString(),
          currentStock: product.currentStock.toString(),
          minStockLevel: product.minStockLevel.toString(),
          isActive: product.isActive,
        }
      : {
          sku: generateSKU('PRD'),
          isActive: true,
        },
  });

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      sku: data.sku,
      name: data.name,
      brand: data.brand,
      category: data.category,
      description: data.description,
      manufacturerId: parseInt(data.manufacturerId),
      basePrice: parseFloat(data.basePrice),
      sellingPrice: parseFloat(data.sellingPrice),
      mrp: parseFloat(data.mrp),
      currentStock: parseInt(data.currentStock),
      minStockLevel: parseInt(data.minStockLevel),
      isActive: data.isActive,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEdit && product) {
      updateProduct(product.id, productData);
      toast.success('Product updated successfully');
    } else {
      addProduct(productData);
      toast.success('Product added successfully');
    }

    router.push('/products');
  };

  const manufacturerOptions = manufacturers.map((m) => ({
    value: m.id.toString(),
    label: m.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU"
              {...register('sku', { required: 'SKU is required' })}
              error={errors.sku?.message}
              required
            />
            <Input
              label="Product Name"
              {...register('name', { required: 'Product name is required' })}
              error={errors.name?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand"
              {...register('brand', { required: 'Brand is required' })}
              error={errors.brand?.message}
              required
            />
            <Input
              label="Category"
              {...register('category', { required: 'Category is required' })}
              error={errors.category?.message}
              placeholder="e.g., Running Shoes, Formal Shoes"
              required
            />
          </div>

          <Select
            label="Manufacturer"
            {...register('manufacturerId', { required: 'Manufacturer is required' })}
            options={manufacturerOptions}
            error={errors.manufacturerId?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Product description..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Base Price (Cost)"
              type="number"
              step="0.01"
              {...register('basePrice', { required: 'Base price is required' })}
              error={errors.basePrice?.message}
              required
            />
            <Input
              label="Selling Price"
              type="number"
              step="0.01"
              {...register('sellingPrice', { required: 'Selling price is required' })}
              error={errors.sellingPrice?.message}
              required
            />
            <Input
              label="MRP"
              type="number"
              step="0.01"
              {...register('mrp', { required: 'MRP is required' })}
              error={errors.mrp?.message}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Stock"
              type="number"
              {...register('currentStock', { required: 'Current stock is required' })}
              error={errors.currentStock?.message}
              helperText="Current quantity in stock"
              required
            />
            <Input
              label="Minimum Stock Level"
              type="number"
              {...register('minStockLevel', { required: 'Minimum stock level is required' })}
              error={errors.minStockLevel?.message}
              helperText="Alert when stock falls below this level"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (product is available for sale)
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/products')}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
