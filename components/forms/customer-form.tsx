'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Customer } from '@/lib/types/database.types';
import { customerSchema, type CustomerSchema } from '@/lib/validation/customer.schema';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Omit<Customer, 'id'>) => void;
  onCancel?: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          businessName: customer.businessName,
          contactPerson: customer.contactPerson,
          email: customer.email,
          phone: customer.phone,
          billingAddress: customer.billingAddress,
          shippingAddress: customer.shippingAddress,
          gstin: customer.gstin || '',
          creditLimit: customer.creditLimit,
          outstandingBalance: customer.outstandingBalance,
          customerType: customer.customerType,
          isActive: customer.isActive,
        }
      : {
          name: '',
          businessName: '',
          contactPerson: '',
          email: '',
          phone: '',
          billingAddress: '',
          shippingAddress: '',
          gstin: '',
          creditLimit: 0,
          outstandingBalance: 0,
          customerType: 'retailer',
          isActive: true,
        },
  });

  const formValues = watch();

  const handleSubmitForm = (data: CustomerSchema) => {
    const now = new Date().toISOString();
    onSubmit({
      ...data,
      createdAt: customer?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const copyBillingToShipping = () => {
    setValue('shippingAddress', formValues.billingAddress);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              {...register('businessName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.businessName && (
              <p className="text-xs text-red-600 mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person *
            </label>
            <input
              type="text"
              required
              {...register('contactPerson')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contactPerson && (
              <p className="text-xs text-red-600 mt-1">{errors.contactPerson.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type *
            </label>
            <select
              required
              {...register('customerType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="retailer">Retailer</option>
              <option value="wholesaler">Wholesaler</option>
              <option value="distributor">Distributor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              required
              {...register('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GSTIN
            </label>
            <input
              type="text"
              {...register('gstin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Address *
            </label>
            <textarea
              required
              rows={3}
              {...register('billingAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.billingAddress && (
              <p className="text-xs text-red-600 mt-1">{errors.billingAddress.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Shipping Address *
              </label>
              <button
                type="button"
                onClick={copyBillingToShipping}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy from Billing
              </button>
            </div>
            <textarea
              required
              rows={3}
              {...register('shippingAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.shippingAddress && (
              <p className="text-xs text-red-600 mt-1">{errors.shippingAddress.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Limit (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register('creditLimit', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.creditLimit && (
              <p className="text-xs text-red-600 mt-1">{errors.creditLimit.message}</p>
            )}
          </div>

          {customer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outstanding Balance (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('outstandingBalance', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.outstandingBalance && (
                <p className="text-xs text-red-600 mt-1">{errors.outstandingBalance.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active Customer
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {customer ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
}
