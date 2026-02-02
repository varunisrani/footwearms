import { z } from 'zod';

export const saleHeaderSchema = z.object({
  saleNumber: z.string().min(1, 'Sale number is required'),
  customerId: z.number().min(1, 'Customer is required'),
  saleDate: z.string().min(1, 'Sale date is required'),
  deliveryDate: z.string().optional(),
  status: z.enum(['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional(),
});

export const saleLineItemSchema = z.object({
  productId: z.number().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be >= 0'),
  discountPercent: z.number().min(0).max(100),
  taxPercent: z.number().min(0).max(100),
});

export const saleFormSchema = z.object({
  header: saleHeaderSchema,
  items: z.array(saleLineItemSchema).min(1, 'At least one item is required'),
});
