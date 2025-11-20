import { useAppStore } from '../stores/app-store';
import { StorageService } from '../services/storage.service';
import type { Sale, SaleItem } from '../types/database.types';

const saleItemService = new StorageService<SaleItem>('saleItems');

export function useSales() {
  const { sales, loadSales, addSale, updateSale, deleteSale } = useAppStore();

  return {
    sales,
    loadSales,
    addSale,
    updateSale,
    deleteSale,
    getSale: (id: number) => sales.find((s) => s.id === id),
    getSalesByCustomer: (customerId: number) =>
      sales.filter((s) => s.customerId === customerId),
    getSalesByStatus: (status: Sale['status']) =>
      sales.filter((s) => s.status === status),
    getSalesByDateRange: (startDate: string, endDate: string) =>
      sales.filter((s) => s.saleDate >= startDate && s.saleDate <= endDate),

    // Sale items operations
    getSaleItems: (saleId: number) =>
      saleItemService.find((item) => item.saleId === saleId),
    addSaleItem: (item: Omit<SaleItem, 'id'>) => saleItemService.create(item),
    updateSaleItem: (id: number, item: Partial<SaleItem>) =>
      saleItemService.update(id, item),
    deleteSaleItem: (id: number) => saleItemService.delete(id),

    // Calculations
    getTotalSales: () => sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
    getPendingPayments: () =>
      sales
        .filter((s) => s.balanceAmount > 0)
        .reduce((sum, sale) => sum + sale.balanceAmount, 0),
  };
}
