'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/stores/app-store';
import { formatCurrency, formatPhone } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export default function ManufacturersPage() {
  const { manufacturers, loadManufacturers, deleteManufacturer } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadManufacturers();
  }, [loadManufacturers]);

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteManufacturer(id);
      toast.success('Manufacturer deleted successfully');
    }
  };

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manufacturers</h1>
          <p className="text-gray-600 mt-1">Manage your manufacturer relationships</p>
        </div>
        <Link href="/manufacturers/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Manufacturer
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Total Manufacturers</div>
            <div className="text-2xl font-bold mt-2 text-black">{manufacturers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Active</div>
            <div className="text-2xl font-bold mt-2 text-black">{manufacturers.filter(m => m.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-black">Total Outstanding</div>
            <div className="text-2xl font-bold mt-2 text-black">
              {formatCurrency(manufacturers.reduce((sum, m) => sum + m.outstandingBalance, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manufacturers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manufacturer List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search manufacturers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredManufacturers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No manufacturers found</p>
              <Link href="/manufacturers/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first manufacturer
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManufacturers.map((manufacturer) => (
                  <TableRow key={manufacturer.id}>
                    <TableCell className="font-medium">{manufacturer.name}</TableCell>
                    <TableCell>{manufacturer.contactPerson}</TableCell>
                    <TableCell>{manufacturer.email}</TableCell>
                    <TableCell>{formatPhone(manufacturer.phone)}</TableCell>
                    <TableCell>
                      <span className={manufacturer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(manufacturer.outstandingBalance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={manufacturer.isActive ? 'success' : 'default'}>
                        {manufacturer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/manufacturers/${manufacturer.id}/purchases`}>
                          <Button variant="ghost" size="sm" title="View Purchase History">
                            <span className="text-xs">📦</span>
                          </Button>
                        </Link>
                        <Link href={`/manufacturers/${manufacturer.id}`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(manufacturer.id, manufacturer.name)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
