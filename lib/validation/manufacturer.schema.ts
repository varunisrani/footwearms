import { z } from 'zod';

export const manufacturerSchema = z.object({
  name: z.string().min(2, 'Manufacturer name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone is required'),
  address: z.string().min(3, 'Address is required'),
  gstin: z.string().optional(),
  creditLimit: z.string().min(1, 'Credit limit is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const credit = Number(data.creditLimit);
  if (Number.isNaN(credit) || credit < 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['creditLimit'], message: 'Credit limit must be >= 0' });
  }
});

export type ManufacturerSchema = z.infer<typeof manufacturerSchema>;
