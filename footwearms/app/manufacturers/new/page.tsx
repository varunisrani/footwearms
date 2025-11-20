'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ManufacturerForm } from '@/components/forms/manufacturer-form';

export default function NewManufacturerPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/manufacturers"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Manufacturers
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Manufacturer</h1>
        <p className="text-gray-600 mt-1">Create a new manufacturer relationship</p>
      </div>

      {/* Form */}
      <ManufacturerForm />
    </div>
  );
}
