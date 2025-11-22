import { StorageService } from '../services/storage.service';
import type { Invoice } from '../types/database.types';

const invoiceService = new StorageService<Invoice>('invoices');

export function useInvoices() {
  const getInvoices = () => invoiceService.getAll();

  return {
    invoices: getInvoices(),
    getInvoices,
    getInvoice: (id: number) => invoiceService.getById(id),
    addInvoice: (invoice: Omit<Invoice, 'id'>) => invoiceService.create(invoice),
    updateInvoice: (id: number, invoice: Partial<Invoice>) =>
      invoiceService.update(id, invoice),
    deleteInvoice: (id: number) => invoiceService.delete(id),

    getInvoicesBySale: (saleId: number) =>
      invoiceService.find((inv) => inv.saleId === saleId),
    getInvoicesByCustomer: (customerId: number) =>
      invoiceService.find((inv) => inv.customerId === customerId),
    getInvoicesByStatus: (status: Invoice['status']) =>
      invoiceService.find((inv) => inv.status === status),
    getOverdueInvoices: () => {
      const today = new Date().toISOString().split('T')[0];
      return invoiceService.find(
        (inv) => inv.dueDate < today && inv.status !== 'paid'
      );
    },

    // Calculations
    getTotalOutstanding: () =>
      invoiceService
        .getAll()
        .reduce((sum, inv) => sum + inv.balanceAmount, 0),
    getAgingReport: () => {
      const today = new Date();
      const invoices = invoiceService.getAll();
      return {
        current: invoices.filter((inv) => {
          const dueDate = new Date(inv.dueDate);
          const daysDiff = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDiff <= 0 && inv.balanceAmount > 0;
        }),
        days30: invoices.filter((inv) => {
          const dueDate = new Date(inv.dueDate);
          const daysDiff = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDiff > 0 && daysDiff <= 30 && inv.balanceAmount > 0;
        }),
        days60: invoices.filter((inv) => {
          const dueDate = new Date(inv.dueDate);
          const daysDiff = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDiff > 30 && daysDiff <= 60 && inv.balanceAmount > 0;
        }),
        days90Plus: invoices.filter((inv) => {
          const dueDate = new Date(inv.dueDate);
          const daysDiff = Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysDiff > 60 && inv.balanceAmount > 0;
        }),
      };
    },
  };
}
