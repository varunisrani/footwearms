'use client';

import { useRouter } from 'next/navigation';
import { useCustomers } from '@/lib/hooks/use-customers';
import { CustomerForm } from '@/components/forms/customer-form';
import toast from 'react-hot-toast';

export default function NewCustomerPage() {
  const router = useRouter();
  const { addCustomer } = useCustomers();

  const handleSubmit = (data: any) => {
    try {
      addCustomer(data);
      toast.success('Customer added successfully!');
      router.push('/customers');
    } catch (error) {
      toast.error('Failed to add customer');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new customer record
        </p>
      </div>

      <CustomerForm onSubmit={handleSubmit} />
    </div>
  );
}
