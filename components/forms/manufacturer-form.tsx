'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/stores/app-store';
import { Manufacturer } from '@/lib/types/database.types';
import toast from 'react-hot-toast';

interface ManufacturerFormProps {
  manufacturer?: Manufacturer;
  isEdit?: boolean;
}

interface ManufacturerFormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  creditLimit: string;
  paymentTerms: string;
  notes: string;
  isActive: boolean;
}

export function ManufacturerForm({ manufacturer, isEdit = false }: ManufacturerFormProps) {
  const router = useRouter();
  const { addManufacturer, updateManufacturer } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManufacturerFormData>({
    defaultValues: manufacturer
      ? {
          name: manufacturer.name,
          contactPerson: manufacturer.contactPerson,
          email: manufacturer.email,
          phone: manufacturer.phone,
          address: manufacturer.address,
          gstin: manufacturer.gstin || '',
          creditLimit: manufacturer.creditLimit.toString(),
          paymentTerms: manufacturer.paymentTerms,
          notes: manufacturer.notes || '',
          isActive: manufacturer.isActive,
        }
      : {
          isActive: true,
          paymentTerms: '30 days',
          creditLimit: '0',
        },
  });

  const onSubmit = (data: ManufacturerFormData) => {
    const manufacturerData = {
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      address: data.address,
      gstin: data.gstin,
      creditLimit: parseFloat(data.creditLimit),
      outstandingBalance: manufacturer?.outstandingBalance || 0,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      isActive: data.isActive,
      createdAt: manufacturer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEdit && manufacturer) {
      updateManufacturer(manufacturer.id, manufacturerData);
      toast.success('Manufacturer updated successfully');
    } else {
      addManufacturer(manufacturerData);
      toast.success('Manufacturer added successfully');
    }

    router.push('/manufacturers');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Manufacturer Name"
              {...register('name', { required: 'Manufacturer name is required' })}
              error={errors.name?.message}
              required
            />
            <Input
              label="Contact Person"
              {...register('contactPerson', { required: 'Contact person is required' })}
              error={errors.contactPerson?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              required
            />
            <Input
              label="Phone"
              type="tel"
              {...register('phone', { required: 'Phone is required' })}
              error={errors.phone?.message}
              required
            />
          </div>

          <Input
            label="Address"
            {...register('address', { required: 'Address is required' })}
            error={errors.address?.message}
            required
          />

          <Input
            label="GSTIN (Optional)"
            {...register('gstin')}
            placeholder="GST Identification Number"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Credit Limit"
              type="number"
              step="0.01"
              {...register('creditLimit', { required: 'Credit limit is required' })}
              error={errors.creditLimit?.message}
              helperText="Maximum credit allowed"
              required
            />
            <Input
              label="Payment Terms"
              {...register('paymentTerms', { required: 'Payment terms are required' })}
              error={errors.paymentTerms?.message}
              placeholder="e.g., 30 days, Net 60"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (manufacturer is active for business)
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/manufacturers')}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full md:w-auto">
          {isEdit ? 'Update Manufacturer' : 'Add Manufacturer'}
        </Button>
      </div>
    </form>
  );
}
