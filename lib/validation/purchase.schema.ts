import { z } from 'zod';

export const purchaseHeaderSchema = z.object({
  purchaseNumber: z.string().min(1, 'PO number is required'),
  manufacturerId: z.string().min(1, 'Manufacturer is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  expectedDeliveryDate: z.string().optional(),
  status: z.enum(['draft', 'ordered', 'received', 'partial', 'cancelled']),
  notes: z.string().optional(),
});

export const purchaseLineItemSchema = z.object({
  productId: z.number().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost must be >= 0'),
});

export const purchaseFormSchema = z.object({
  header: purchaseHeaderSchema,
  items: z.array(purchaseLineItemSchema).min(1, 'At least one line item is required'),
});
