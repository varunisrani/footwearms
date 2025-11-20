import { StorageService } from '../services/storage.service';
import type { Payment } from '../types/database.types';

const paymentService = new StorageService<Payment>('payments');

export function usePayments() {
  const getPayments = () => paymentService.getAll();

  return {
    payments: getPayments(),
    getPayments,
    getPayment: (id: number) => paymentService.getById(id),
    addPayment: (payment: Omit<Payment, 'id'>) => paymentService.create(payment),
    updatePayment: (id: number, payment: Partial<Payment>) =>
      paymentService.update(id, payment),
    deletePayment: (id: number) => paymentService.delete(id),

    getPaymentsByReference: (type: Payment['referenceType'], referenceId: number) =>
      paymentService.find(
        (p) => p.referenceType === type && p.referenceId === referenceId
      ),
    getPaymentsByMethod: (method: Payment['paymentMethod']) =>
      paymentService.find((p) => p.paymentMethod === method),
    getPaymentsByDateRange: (startDate: string, endDate: string) =>
      paymentService.find(
        (p) => p.paymentDate >= startDate && p.paymentDate <= endDate
      ),

    // Calculations
    getTotalPayments: () =>
      paymentService.getAll().reduce((sum, p) => sum + p.amount, 0),
    getTotalPaymentsByMethod: (method: Payment['paymentMethod']) =>
      paymentService
        .find((p) => p.paymentMethod === method)
        .reduce((sum, p) => sum + p.amount, 0),
  };
}
