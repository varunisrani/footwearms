'use client';

import { useState, useEffect } from 'react';
import { settingsService, backupService, getStorageInfo } from '@/lib/services/storage.service';
import type { AppSettings } from '@/lib/types/database.types';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils/format';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(settingsService.get());
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0, percentage: 0 });

  useEffect(() => {
    setSettings(settingsService.get());
    setStorageInfo(getStorageInfo());
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      settingsService.update(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    }
  };

  const handleBackup = () => {
    try {
      backupService.downloadBackup();
      toast.success('Backup downloaded successfully!');
    } catch (error) {
      toast.error('Failed to create backup');
      console.error(error);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (backupService.import(content)) {
        toast.success('Data restored successfully!');
        window.location.reload();
      } else {
        toast.error('Failed to restore data. Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
      if (confirm('This will delete all products, customers, sales, and purchases. Are you ABSOLUTELY sure?')) {
        backupService.clearAll();
        toast.success('All data cleared');
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure your application settings and manage data
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Business Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <input
                  type="tel"
                  value={settings.businessPhone}
                  onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={settings.businessGstin}
                  onChange={(e) => setSettings({ ...settings, businessGstin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <textarea
                rows={3}
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Business Information
              </button>
            </div>
          </form>
        </div>

        {/* Application Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settings.currencySymbol}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rows Per Page
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={settings.rowsPerPage}
                  onChange={(e) => setSettings({ ...settings, rowsPerPage: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as AppSettings['theme'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Application Settings
              </button>
            </div>
          </form>
        </div>

        {/* Storage Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Storage Information</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-medium">
                  {(storageInfo.used / 1024).toFixed(2)} KB of{' '}
                  {(storageInfo.total / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    storageInfo.percentage > 80
                      ? 'bg-red-600'
                      : storageInfo.percentage > 60
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {storageInfo.percentage.toFixed(2)}% used
              </p>
            </div>

            {storageInfo.percentage > 80 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="text-sm font-medium">Storage Warning</p>
                <p className="text-sm mt-1">
                  Your storage is running low. Consider backing up and archiving old data.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Backup & Restore</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Create Backup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download a complete backup of all your data as a JSON file.
              </p>
              <button
                onClick={handleBackup}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download Backup
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Restore from Backup</h3>
              <p className="text-sm text-gray-600 mb-3">
                Restore your data from a previously downloaded backup file.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-3">
                Clear all data from the application. This action cannot be undone!
              </p>
              <button
                onClick={handleClearData}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
