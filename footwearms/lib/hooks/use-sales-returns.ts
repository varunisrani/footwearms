import { StorageService } from '../services/storage.service';
import type { SalesReturn, SalesReturnItem } from '../types/database.types';

const salesReturnService = new StorageService<SalesReturn>('salesReturns');
const salesReturnItemService = new StorageService<SalesReturnItem>('salesReturnItems');

export function useSalesReturns() {
  const salesReturns = salesReturnService.getAll();

  return {
    salesReturns,

    // Sales return operations
    getSalesReturn: (id: number) => salesReturnService.getById(id),
    getSalesReturnsBySale: (saleId: number) =>
      salesReturnService.find((r) => r.saleId === saleId),
    getSalesReturnsByCustomer: (customerId: number) =>
      salesReturnService.find((r) => r.customerId === customerId),
    getSalesReturnsByStatus: (status: SalesReturn['status']) =>
      salesReturnService.find((r) => r.status === status),
    addSalesReturn: (salesReturn: Omit<SalesReturn, 'id'>) =>
      salesReturnService.create(salesReturn),
    updateSalesReturn: (id: number, salesReturn: Partial<SalesReturn>) =>
      salesReturnService.update(id, salesReturn),
    deleteSalesReturn: (id: number) => salesReturnService.delete(id),

    // Sales return items operations
    getSalesReturnItems: (returnId: number) =>
      salesReturnItemService.find((item) => item.returnId === returnId),
    addSalesReturnItem: (item: Omit<SalesReturnItem, 'id'>) =>
      salesReturnItemService.create(item),
    updateSalesReturnItem: (id: number, item: Partial<SalesReturnItem>) =>
      salesReturnItemService.update(id, item),
    deleteSalesReturnItem: (id: number) => salesReturnItemService.delete(id),

    // Calculations
    getTotalReturns: () =>
      salesReturns.reduce((sum, ret) => sum + ret.totalAmount, 0),
    getPendingReturns: () =>
      salesReturns.filter((r) => r.status === 'pending').length,
  };
}
