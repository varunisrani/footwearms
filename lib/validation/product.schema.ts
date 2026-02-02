import { z } from 'zod';

export const productSchema = z
  .object({
    sku: z.string().min(3, 'SKU is required'),
    name: z.string().min(2, 'Product name is required'),
    brand: z.string().min(2, 'Brand is required'),
    category: z.string().min(2, 'Category is required'),
    description: z.string().optional(),
    manufacturerId: z.string().min(1, 'Manufacturer is required'),
    basePrice: z.string().min(1, 'Base price is required'),
    sellingPrice: z.string().min(1, 'Selling price is required'),
    mrp: z.string().min(1, 'MRP is required'),
    currentStock: z.string().min(1, 'Current stock is required'),
    minStockLevel: z.string().min(1, 'Minimum stock level is required'),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const base = Number(data.basePrice);
    const sell = Number(data.sellingPrice);
    const mrp = Number(data.mrp);

    if (Number.isNaN(base) || base < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['basePrice'], message: 'Base price must be >= 0' });
    }
    if (Number.isNaN(sell) || sell < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sellingPrice'], message: 'Selling price must be >= 0' });
    }
    if (Number.isNaN(mrp) || mrp < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mrp'], message: 'MRP must be >= 0' });
    }
    if (!Number.isNaN(base) && !Number.isNaN(sell) && sell < base) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sellingPrice'], message: 'Selling price must be >= base price' });
    }
    if (!Number.isNaN(mrp) && !Number.isNaN(sell) && mrp < sell) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mrp'], message: 'MRP must be >= selling price' });
    }

    const current = Number(data.currentStock);
    const minStock = Number(data.minStockLevel);
    if (Number.isNaN(current) || current < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['currentStock'], message: 'Current stock must be >= 0' });
    }
    if (Number.isNaN(minStock) || minStock < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['minStockLevel'], message: 'Minimum stock must be >= 0' });
    }
  });

export type ProductSchema = z.infer<typeof productSchema>;
