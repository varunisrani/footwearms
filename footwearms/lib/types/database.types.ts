// Database Type Definitions for localStorage-based storage

export interface Manufacturer {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  creditLimit: number;
  outstandingBalance: number;
  paymentTerms: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  manufacturerId: number;
  basePrice: number;
  sellingPrice: number;
  mrp: number;
  minStockLevel: number;
  currentStock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  size: string;
  color: string;
  additionalPrice: number;
  currentStock: number;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  gstin?: string;
  creditLimit: number;
  outstandingBalance: number;
  customerType: 'retailer' | 'distributor' | 'wholesaler';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: number;
  purchaseNumber: string;
  manufacturerId: number;
  purchaseDate: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'partial' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: number;
  purchaseId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalAmount: number;
  createdAt: string;
}

export interface Sale {
  id: number;
  saleNumber: string;
  customerId: number;
  saleDate: string;
  deliveryDate?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  saleId: number;
  customerId: number;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  paymentTerms: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  paymentNumber: string;
  referenceType: 'invoice' | 'purchase';
  referenceId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'cheque' | 'bank_transfer';
  transactionRef?: string;
  notes?: string;
  createdAt: string;
}

export interface SalesReturn {
  id: number;
  returnNumber: string;
  saleId: number;
  customerId: number;
  returnDate: string;
  reason: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  refundAmount: number;
  refundMethod: 'cash' | 'card' | 'upi' | 'cheque' | 'bank_transfer' | 'credit_note';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesReturnItem {
  id: number;
  returnId: number;
  saleItemId: number;
  productId: number;
  variantId?: number;
  quantityReturned: number;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
}

export interface StockAdjustment {
  id: number;
  adjustmentNumber: string;
  adjustmentDate: string;
  adjustmentType: 'increase' | 'decrease' | 'correction';
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface StockAdjustmentItem {
  id: number;
  adjustmentId: number;
  productId: number;
  variantId?: number;
  quantityBefore: number;
  quantityAdjusted: number;
  quantityAfter: number;
  createdAt: string;
}

export interface AppSettings {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessGstin: string;
  businessLogo?: string;
  currencySymbol: string;
  dateFormat: string;
  taxRate: number;
  lowStockThreshold: number;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  rowsPerPage: number;
}

// Database structure
export interface Database {
  manufacturers: Manufacturer[];
  products: Product[];
  productVariants: ProductVariant[];
  customers: Customer[];
  purchases: Purchase[];
  purchaseItems: PurchaseItem[];
  sales: Sale[];
  saleItems: SaleItem[];
  salesReturns: SalesReturn[];
  salesReturnItems: SalesReturnItem[];
  invoices: Invoice[];
  payments: Payment[];
  stockAdjustments: StockAdjustment[];
  stockAdjustmentItems: StockAdjustmentItem[];
  settings: AppSettings;
  lastId: {
    manufacturers: number;
    products: number;
    productVariants: number;
    customers: number;
    purchases: number;
    purchaseItems: number;
    sales: number;
    saleItems: number;
    salesReturns: number;
    salesReturnItems: number;
    invoices: number;
    payments: number;
    stockAdjustments: number;
    stockAdjustmentItems: number;
  };
}
