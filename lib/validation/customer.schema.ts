import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  businessName: z.string().min(2, 'Business name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone is required'),
  billingAddress: z.string().min(3, 'Billing address is required'),
  shippingAddress: z.string().min(3, 'Shipping address is required'),
  gstin: z.string().optional(),
  creditLimit: z.number().min(0, 'Credit limit must be >= 0'),
  outstandingBalance: z.number().min(0, 'Outstanding balance must be >= 0'),
  customerType: z.enum(['retailer', 'wholesaler', 'distributor']),
  isActive: z.boolean().optional(),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
