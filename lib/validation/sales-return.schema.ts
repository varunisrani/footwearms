import { z } from 'zod';

export const salesReturnSchema = z.object({
  returnNumber: z.string().min(1, 'Return number is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  reason: z.string().min(1, 'Reason is required'),
  refundMethod: z.enum(['cash', 'card', 'upi', 'cheque', 'bank_transfer', 'credit_note']),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']),
  notes: z.string().optional(),
});

export const salesReturnLineSchema = z.object({
  saleItemId: z.number().min(1),
  productId: z.number().min(1),
  maxQuantity: z.number().min(1),
  quantityReturned: z.number().min(1),
  unitPrice: z.number().min(0),
  taxPercent: z.number().min(0).max(100),
  selected: z.boolean(),
});
