'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ManufacturerForm } from '@/components/forms/manufacturer-form';
import { useAppStore } from '@/lib/stores/app-store';
import { Manufacturer } from '@/lib/types/database.types';

export default function EditManufacturerPage({ params }: { params: { id: string } }) {
  const { manufacturers, loadManufacturers } = useAppStore();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  useEffect(() => {
    const manufacturerId = parseInt(params.id);
    const foundManufacturer = manufacturers.find(m => m.id === manufacturerId);
    if (foundManufacturer) {
      setManufacturer(foundManufacturer);
    }
  }, [manufacturers, params.id]);

  if (!manufacturer) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading manufacturer...</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Manufacturer</h1>
        <p className="text-gray-600 mt-1">Update manufacturer information</p>
      </div>

      {/* Form */}
      <ManufacturerForm manufacturer={manufacturer} isEdit={true} />
    </div>
  );
}
