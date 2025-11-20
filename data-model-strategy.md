# Footwear Wholesale Management System - Complete Data Model & Storage Strategy

## 1. IndexedDB Database Schema

### Database Configuration
```javascript
const DB_NAME = 'FootwearWholesaleDB';
const DB_VERSION = 1;
```

### Object Stores Definition

#### 1.1 Manufacturers Object Store
```javascript
{
  name: 'manufacturers',
  keyPath: 'id',
  autoIncrement: false, // UUID generated
  indexes: [
    { name: 'name', keyPath: 'name', unique: false },
    { name: 'email', keyPath: 'email', unique: true },
    { name: 'phone', keyPath: 'phone', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  name: string,                  // Manufacturer name
  companyName: string,           // Legal company name
  email: string,                 // Primary email
  phone: string,                 // Primary phone
  alternatePhone: string,        // Secondary phone
  address: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  },
  contactPerson: {
    name: string,
    designation: string,
    phone: string,
    email: string
  },
  gst: string,                   // GST/Tax ID
  pan: string,                   // PAN number
  paymentTerms: string,          // e.g., "Net 30", "COD"
  creditLimit: number,           // Credit limit
  currentBalance: number,        // Outstanding balance
  status: string,                // 'active' | 'inactive' | 'blocked'
  notes: string,                 // Additional notes
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: {
    totalPurchases: number,      // Lifetime purchase value
    totalOrders: number,         // Total number of orders
    lastOrderDate: timestamp,
    rating: number               // 1-5 rating
  }
}
```

#### 1.2 Products Object Store
```javascript
{
  name: 'products',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'sku', keyPath: 'sku', unique: true },
    { name: 'name', keyPath: 'name', unique: false },
    { name: 'category', keyPath: 'category', unique: false },
    { name: 'brand', keyPath: 'brand', unique: false },
    { name: 'manufacturerId', keyPath: 'manufacturerId', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  sku: string,                   // Stock Keeping Unit (unique)
  name: string,                  // Product name
  description: string,           // Product description
  category: string,              // 'Men' | 'Women' | 'Kids' | 'Sports' | 'Casual' | 'Formal'
  subCategory: string,           // 'Shoes' | 'Sandals' | 'Boots' | 'Slippers'
  brand: string,                 // Brand name
  manufacturerId: string,        // Foreign key to manufacturers
  manufacturerName: string,      // Denormalized for quick access
  basePrice: number,             // Base wholesale price
  mrp: number,                   // Maximum Retail Price
  images: [
    {
      id: string,
      url: string,               // Base64 or blob URL
      isPrimary: boolean,
      order: number
    }
  ],
  hasVariants: boolean,          // Whether product has variants
  status: string,                // 'active' | 'discontinued' | 'draft'
  tags: string[],                // Searchable tags
  hsn: string,                   // HSN/SAC code for tax
  tax: {
    cgst: number,                // Central GST %
    sgst: number,                // State GST %
    igst: number                 // Integrated GST %
  },
  weight: number,                // In grams
  dimensions: {
    length: number,              // In cm
    width: number,
    height: number
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: {
    totalSold: number,
    totalRevenue: number,
    averageRating: number,
    viewCount: number
  }
}
```

#### 1.3 Product Variants Object Store
```javascript
{
  name: 'productVariants',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'productId', keyPath: 'productId', unique: false },
    { name: 'variantSku', keyPath: 'variantSku', unique: true },
    { name: 'size', keyPath: 'size', unique: false },
    { name: 'color', keyPath: 'color', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'composite', keyPath: ['productId', 'size', 'color'], unique: true }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  productId: string,             // Foreign key to products
  variantSku: string,            // Unique variant SKU
  size: string,                  // '6', '7', '8', '9', '10', etc.
  color: string,                 // 'Black', 'Brown', 'White', etc.
  colorCode: string,             // Hex code for display
  material: string,              // 'Leather', 'Canvas', 'Synthetic'
  purchasePrice: number,         // Wholesale price for this variant
  sellingPrice: number,          // Selling price to retailers
  mrp: number,                   // MRP for this variant
  barcode: string,               // Barcode/QR code
  images: string[],              // Variant-specific images
  status: string,                // 'active' | 'inactive'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 1.4 Inventory Object Store
```javascript
{
  name: 'inventory',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'variantId', keyPath: 'variantId', unique: true },
    { name: 'productId', keyPath: 'productId', unique: false },
    { name: 'location', keyPath: 'location', unique: false },
    { name: 'quantity', keyPath: 'quantity', unique: false },
    { name: 'updatedAt', keyPath: 'updatedAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  productId: string,             // Foreign key to products
  variantId: string,             // Foreign key to productVariants
  location: string,              // 'Main Warehouse' | 'Store 1' | 'Store 2'
  quantity: number,              // Current stock quantity
  reservedQuantity: number,      // Reserved for pending orders
  availableQuantity: number,     // quantity - reservedQuantity
  reorderLevel: number,          // Minimum stock level
  reorderQuantity: number,       // Suggested reorder quantity
  lastRestockDate: timestamp,
  lastSaleDate: timestamp,
  averageMonthlySales: number,   // For forecasting
  status: string,                // 'in_stock' | 'low_stock' | 'out_of_stock'
  updatedAt: timestamp,
  stockHistory: [
    {
      date: timestamp,
      change: number,            // +/- quantity
      type: string,              // 'purchase' | 'sale' | 'return' | 'adjustment'
      reference: string,         // Order/adjustment ID
      notes: string
    }
  ]
}
```

#### 1.5 Purchase Orders Object Store
```javascript
{
  name: 'purchaseOrders',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'poNumber', keyPath: 'poNumber', unique: true },
    { name: 'manufacturerId', keyPath: 'manufacturerId', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'orderDate', keyPath: 'orderDate', unique: false },
    { name: 'expectedDeliveryDate', keyPath: 'expectedDeliveryDate', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  poNumber: string,              // Auto-generated PO number (PO-YYYY-XXXXX)
  manufacturerId: string,        // Foreign key to manufacturers
  manufacturerName: string,      // Denormalized
  orderDate: timestamp,
  expectedDeliveryDate: timestamp,
  actualDeliveryDate: timestamp,
  status: string,                // 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
  items: [
    {
      id: string,
      productId: string,
      variantId: string,
      productName: string,
      variantDetails: string,    // "Size: 8, Color: Black"
      quantity: number,
      receivedQuantity: number,
      unitPrice: number,
      tax: number,               // Tax percentage
      discount: number,          // Discount percentage
      total: number
    }
  ],
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  shippingCost: number,
  totalAmount: number,
  paymentTerms: string,
  deliveryAddress: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  },
  notes: string,
  internalNotes: string,
  attachments: [
    {
      id: string,
      name: string,
      type: string,
      url: string,               // Base64 encoded
      uploadedAt: timestamp
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string,             // For future use
  receivingHistory: [
    {
      date: timestamp,
      receivedBy: string,
      items: [
        {
          variantId: string,
          quantity: number,
          condition: string      // 'good' | 'damaged'
        }
      ],
      notes: string
    }
  ]
}
```

#### 1.6 Customers Object Store
```javascript
{
  name: 'customers',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'customerCode', keyPath: 'customerCode', unique: true },
    { name: 'name', keyPath: 'name', unique: false },
    { name: 'email', keyPath: 'email', unique: true },
    { name: 'phone', keyPath: 'phone', unique: false },
    { name: 'type', keyPath: 'type', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  customerCode: string,          // Auto-generated (CUST-XXXXX)
  name: string,                  // Store/Business name
  legalName: string,             // Legal entity name
  type: string,                  // 'retailer' | 'distributor' | 'online'
  email: string,
  phone: string,
  alternatePhone: string,
  address: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  },
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    sameAsBilling: boolean
  },
  contactPerson: {
    name: string,
    designation: string,
    phone: string,
    email: string
  },
  gst: string,
  pan: string,
  creditLimit: number,
  currentBalance: number,
  paymentTerms: string,          // 'Net 30' | 'Net 60' | 'COD'
  priceLevel: string,            // 'Standard' | 'Premium' | 'VIP'
  discount: number,              // Default discount percentage
  status: string,                // 'active' | 'inactive' | 'blocked'
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: {
    totalOrders: number,
    totalRevenue: number,
    averageOrderValue: number,
    lastOrderDate: timestamp,
    outstandingAmount: number,
    rating: number               // Customer rating
  }
}
```

#### 1.7 Sales Orders Object Store
```javascript
{
  name: 'salesOrders',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'orderNumber', keyPath: 'orderNumber', unique: true },
    { name: 'customerId', keyPath: 'customerId', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'orderDate', keyPath: 'orderDate', unique: false },
    { name: 'deliveryDate', keyPath: 'deliveryDate', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  orderNumber: string,           // Auto-generated (SO-YYYY-XXXXX)
  customerId: string,            // Foreign key to customers
  customerName: string,          // Denormalized
  orderDate: timestamp,
  deliveryDate: timestamp,
  expectedDeliveryDate: timestamp,
  status: string,                // 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  items: [
    {
      id: string,
      productId: string,
      variantId: string,
      productName: string,
      variantDetails: string,
      quantity: number,
      deliveredQuantity: number,
      unitPrice: number,
      tax: number,
      discount: number,
      total: number
    }
  ],
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  shippingCost: number,
  totalAmount: number,
  paymentStatus: string,         // 'pending' | 'partial' | 'paid'
  paidAmount: number,
  balanceAmount: number,
  shippingAddress: {
    street: string,
    city: string,
    state: string,
    country: string,
    zipCode: string
  },
  trackingNumber: string,
  courier: string,
  notes: string,
  internalNotes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  invoiceId: string,             // Linked invoice
  deliveryHistory: [
    {
      date: timestamp,
      status: string,
      location: string,
      notes: string
    }
  ]
}
```

#### 1.8 Invoices Object Store
```javascript
{
  name: 'invoices',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'invoiceNumber', keyPath: 'invoiceNumber', unique: true },
    { name: 'customerId', keyPath: 'customerId', unique: false },
    { name: 'salesOrderId', keyPath: 'salesOrderId', unique: false },
    { name: 'invoiceDate', keyPath: 'invoiceDate', unique: false },
    { name: 'dueDate', keyPath: 'dueDate', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  invoiceNumber: string,         // Auto-generated (INV-YYYY-XXXXX)
  customerId: string,
  customerName: string,
  salesOrderId: string,          // Foreign key to salesOrders
  orderNumber: string,
  invoiceDate: timestamp,
  dueDate: timestamp,
  items: [
    {
      id: string,
      productId: string,
      variantId: string,
      productName: string,
      variantDetails: string,
      hsnCode: string,
      quantity: number,
      unitPrice: number,
      tax: {
        cgst: number,
        sgst: number,
        igst: number,
        total: number
      },
      discount: number,
      total: number
    }
  ],
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  shippingCost: number,
  roundOff: number,
  totalAmount: number,
  amountInWords: string,         // "Five Thousand Only"
  status: string,                // 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled'
  paidAmount: number,
  balanceAmount: number,
  paymentTerms: string,
  bankDetails: {
    bankName: string,
    accountNumber: string,
    ifsc: string,
    branch: string
  },
  notes: string,
  termsAndConditions: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: {
    emailSent: boolean,
    emailSentAt: timestamp,
    printedCount: number,
    lastPrintedAt: timestamp
  }
}
```

#### 1.9 Payments Object Store
```javascript
{
  name: 'payments',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'paymentNumber', keyPath: 'paymentNumber', unique: true },
    { name: 'type', keyPath: 'type', unique: false },
    { name: 'entityId', keyPath: 'entityId', unique: false },
    { name: 'invoiceId', keyPath: 'invoiceId', unique: false },
    { name: 'paymentDate', keyPath: 'paymentDate', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  paymentNumber: string,         // Auto-generated (PAY-YYYY-XXXXX)
  type: string,                  // 'received' | 'paid'
  entityId: string,              // Customer ID or Manufacturer ID
  entityName: string,            // Customer/Manufacturer name
  entityType: string,            // 'customer' | 'manufacturer'
  invoiceId: string,             // Related invoice (if applicable)
  invoiceNumber: string,
  purchaseOrderId: string,       // Related PO (if payment to manufacturer)
  paymentDate: timestamp,
  amount: number,
  paymentMethod: string,         // 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card'
  paymentDetails: {
    chequeNumber: string,
    chequeDate: timestamp,
    bankName: string,
    transactionId: string,
    upiId: string,
    cardLast4: string
  },
  reference: string,             // Payment reference number
  status: string,                // 'pending' | 'cleared' | 'bounced' | 'cancelled'
  notes: string,
  attachments: [
    {
      id: string,
      name: string,
      type: string,
      url: string
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: {
    reconciled: boolean,
    reconciledAt: timestamp,
    reconciledBy: string
  }
}
```

#### 1.10 Stock Adjustments Object Store
```javascript
{
  name: 'stockAdjustments',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'adjustmentNumber', keyPath: 'adjustmentNumber', unique: true },
    { name: 'type', keyPath: 'type', unique: false },
    { name: 'adjustmentDate', keyPath: 'adjustmentDate', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  adjustmentNumber: string,      // Auto-generated (ADJ-YYYY-XXXXX)
  type: string,                  // 'increase' | 'decrease' | 'damage' | 'theft' | 'recount'
  adjustmentDate: timestamp,
  reason: string,
  items: [
    {
      id: string,
      productId: string,
      variantId: string,
      productName: string,
      variantDetails: string,
      currentQuantity: number,
      adjustmentQuantity: number,  // +/- value
      newQuantity: number,
      location: string,
      notes: string
    }
  ],
  totalItems: number,
  totalAdjustment: number,       // Total quantity adjusted
  notes: string,
  approvedBy: string,            // For future use
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 1.11 Returns Object Store
```javascript
{
  name: 'returns',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'returnNumber', keyPath: 'returnNumber', unique: true },
    { name: 'type', keyPath: 'type', unique: false },
    { name: 'orderId', keyPath: 'orderId', unique: false },
    { name: 'returnDate', keyPath: 'returnDate', unique: false },
    { name: 'status', keyPath: 'status', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  returnNumber: string,          // Auto-generated (RET-YYYY-XXXXX)
  type: string,                  // 'sales_return' | 'purchase_return'
  orderId: string,               // Sales Order or Purchase Order ID
  orderNumber: string,
  entityId: string,              // Customer or Manufacturer ID
  entityName: string,
  returnDate: timestamp,
  reason: string,                // 'defective' | 'wrong_item' | 'damaged' | 'customer_request'
  items: [
    {
      id: string,
      productId: string,
      variantId: string,
      productName: string,
      variantDetails: string,
      quantity: number,
      unitPrice: number,
      tax: number,
      total: number,
      condition: string,         // 'resellable' | 'damaged' | 'defective'
      action: string             // 'refund' | 'replace' | 'credit_note'
    }
  ],
  subtotal: number,
  taxAmount: number,
  totalAmount: number,
  refundAmount: number,
  refundMethod: string,          // 'cash' | 'bank_transfer' | 'credit_note'
  status: string,                // 'pending' | 'approved' | 'processed' | 'rejected'
  restockStatus: string,         // 'pending' | 'restocked' | 'discarded'
  notes: string,
  images: string[],              // Evidence photos
  createdAt: timestamp,
  updatedAt: timestamp,
  processedAt: timestamp
}
```

#### 1.12 Settings Object Store
```javascript
{
  name: 'settings',
  keyPath: 'key',
  autoIncrement: false,
  indexes: [
    { name: 'category', keyPath: 'category', unique: false }
  ]
}

// Data Structure
{
  key: string,                   // Unique setting key
  category: string,              // 'business' | 'invoice' | 'inventory' | 'notification'
  value: any,                    // Setting value (can be object, string, number, etc.)
  description: string,
  dataType: string,              // 'string' | 'number' | 'boolean' | 'object'
  updatedAt: timestamp
}

// Example Settings:
{
  key: 'business_info',
  category: 'business',
  value: {
    name: string,
    legalName: string,
    address: object,
    phone: string,
    email: string,
    website: string,
    logo: string,                // Base64 encoded
    gst: string,
    pan: string
  }
}

{
  key: 'invoice_settings',
  category: 'invoice',
  value: {
    prefix: 'INV',
    startingNumber: 1,
    currentNumber: 1234,
    termsAndConditions: string,
    bankDetails: object,
    footerText: string,
    showLogo: boolean,
    showSignature: boolean
  }
}

{
  key: 'inventory_settings',
  category: 'inventory',
  value: {
    defaultReorderLevel: number,
    lowStockThreshold: number,
    enableAutoReorder: boolean,
    defaultLocation: string
  }
}
```

#### 1.13 Audit Log Object Store
```javascript
{
  name: 'auditLogs',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'entityType', keyPath: 'entityType', unique: false },
    { name: 'entityId', keyPath: 'entityId', unique: false },
    { name: 'action', keyPath: 'action', unique: false },
    { name: 'timestamp', keyPath: 'timestamp', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  entityType: string,            // 'product' | 'order' | 'invoice' | etc.
  entityId: string,              // ID of the entity
  action: string,                // 'created' | 'updated' | 'deleted'
  changes: {
    before: object,              // Previous state
    after: object                // New state
  },
  timestamp: timestamp,
  metadata: {
    ip: string,
    userAgent: string
  }
}
```

#### 1.14 Reports Cache Object Store
```javascript
{
  name: 'reportsCache',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [
    { name: 'reportType', keyPath: 'reportType', unique: false },
    { name: 'generatedAt', keyPath: 'generatedAt', unique: false }
  ]
}

// Data Structure
{
  id: string,                    // UUID
  reportType: string,            // 'sales_summary' | 'inventory_valuation' | etc.
  parameters: object,            // Report parameters (date range, filters, etc.)
  data: object,                  // Cached report data
  generatedAt: timestamp,
  expiresAt: timestamp
}
```

---

## 2. Data Relationships and Indexes

### 2.1 Primary Relationships

```
Manufacturers (1) -----> (N) Products
Products (1) -----> (N) Product Variants
Product Variants (1) -----> (1) Inventory
Manufacturers (1) -----> (N) Purchase Orders
Purchase Orders (1) -----> (N) Purchase Order Items (embedded)
Customers (1) -----> (N) Sales Orders
Sales Orders (1) -----> (N) Sales Order Items (embedded)
Sales Orders (1) -----> (1) Invoices
Invoices (1) -----> (N) Payments
Customers (1) -----> (N) Payments (received)
Manufacturers (1) -----> (N) Payments (paid)
Product Variants (N) -----> (N) Stock Adjustments
Sales Orders (1) -----> (N) Returns (sales)
Purchase Orders (1) -----> (N) Returns (purchase)
```

### 2.2 Index Strategy

#### Composite Indexes
```javascript
// Product Variants: Unique combination of product + size + color
{ keyPath: ['productId', 'size', 'color'], unique: true }

// Inventory: Quick lookup by variant + location
{ keyPath: ['variantId', 'location'], unique: false }

// Payments: Entity-wise payment lookup
{ keyPath: ['entityType', 'entityId'], unique: false }

// Audit Logs: Entity-wise audit trail
{ keyPath: ['entityType', 'entityId'], unique: false }
```

#### Date-Based Indexes
```javascript
// For all transaction objects
{ name: 'createdAt', keyPath: 'createdAt', unique: false }
{ name: 'updatedAt', keyPath: 'updatedAt', unique: false }

// For orders
{ name: 'orderDate', keyPath: 'orderDate', unique: false }
{ name: 'deliveryDate', keyPath: 'deliveryDate', unique: false }

// For invoices
{ name: 'invoiceDate', keyPath: 'invoiceDate', unique: false }
{ name: 'dueDate', keyPath: 'dueDate', unique: false }
```

#### Status-Based Indexes
```javascript
// Common status index across all entities
{ name: 'status', keyPath: 'status', unique: false }

// Allows queries like:
// - Get all active products
// - Get all pending invoices
// - Get all confirmed purchase orders
```

### 2.3 Query Optimization Strategies

#### Denormalization
```javascript
// Store frequently accessed related data together
{
  salesOrders: {
    customerId: 'uuid-123',
    customerName: 'ABC Retail Store',  // Denormalized
    // ... avoid joining customers table for every display
  }
}
```

#### Aggregated Metadata
```javascript
// Pre-calculate common aggregations
{
  products: {
    metadata: {
      totalSold: 500,           // Updated on each sale
      totalRevenue: 250000,     // No need to scan all orders
      averageRating: 4.5
    }
  }
}
```

---

## 3. localStorage Structure for Settings/Preferences

### 3.1 Application Preferences
```javascript
// Key: 'app_preferences'
{
  theme: 'light' | 'dark',
  language: 'en',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h' | '12h',
  itemsPerPage: 25,
  defaultView: 'grid' | 'list',
  compactMode: false
}
```

### 3.2 User Interface State
```javascript
// Key: 'ui_state'
{
  sidebarCollapsed: false,
  lastVisitedPage: '/dashboard',
  dashboardLayout: {
    widgets: [
      { id: 'sales-summary', position: 1, visible: true },
      { id: 'stock-alerts', position: 2, visible: true },
      { id: 'recent-orders', position: 3, visible: true }
    ]
  },
  tableColumns: {
    products: ['name', 'sku', 'category', 'price', 'stock', 'status'],
    orders: ['orderNumber', 'customer', 'date', 'amount', 'status']
  },
  sortPreferences: {
    products: { field: 'name', direction: 'asc' },
    orders: { field: 'orderDate', direction: 'desc' }
  }
}
```

### 3.3 Recent Activity
```javascript
// Key: 'recent_activity'
{
  recentlyViewed: {
    products: ['prod-uuid-1', 'prod-uuid-2', 'prod-uuid-3'],
    customers: ['cust-uuid-1', 'cust-uuid-2'],
    orders: ['order-uuid-1', 'order-uuid-2']
  },
  quickAccess: {
    searches: ['Nike shoes size 8', 'ABC Retail'],
    filters: [
      { type: 'product', filter: { category: 'Sports', status: 'active' } }
    ]
  },
  lastSyncedAt: timestamp
}
```

### 3.4 Notification Settings
```javascript
// Key: 'notification_settings'
{
  lowStockAlerts: {
    enabled: true,
    threshold: 10,
    frequency: 'daily'
  },
  backupReminders: {
    enabled: true,
    frequency: 'weekly',
    lastReminderAt: timestamp
  },
  paymentReminders: {
    enabled: true,
    daysBefore: 3
  },
  orderAlerts: {
    newOrders: true,
    deliveryUpdates: true
  }
}
```

### 3.5 Quick Actions Cache
```javascript
// Key: 'quick_actions_cache'
{
  recentProducts: [
    { id: 'uuid', name: 'Nike Air Max', sku: 'NK-001' }
  ],
  recentCustomers: [
    { id: 'uuid', name: 'ABC Retail', code: 'CUST-001' }
  ],
  pendingTasks: [
    { type: 'low_stock', count: 15 },
    { type: 'pending_payments', count: 5 }
  ]
}
```

### 3.6 Backup Metadata
```javascript
// Key: 'backup_metadata'
{
  lastBackupAt: timestamp,
  lastBackupSize: 15728640,  // bytes
  backupLocation: 'local',
  autoBackupEnabled: true,
  backupFrequency: 'weekly',
  backupDay: 'sunday',
  backupReminder: {
    enabled: true,
    nextReminderAt: timestamp
  },
  backupHistory: [
    {
      date: timestamp,
      size: 15000000,
      status: 'success'
    }
  ]
}
```

### 3.7 Print Settings
```javascript
// Key: 'print_settings'
{
  defaultPrinter: 'PDF',
  invoiceTemplate: 'standard',
  paperSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  autoPrint: false,
  showPreview: true
}
```

### 3.8 Export Settings
```javascript
// Key: 'export_settings'
{
  defaultFormat: 'excel',
  includeHeaders: true,
  dateFormat: 'DD/MM/YYYY',
  encoding: 'UTF-8',
  delimiter: ',',
  lastExportPath: '/downloads/'
}
```

### 3.9 Search Preferences
```javascript
// Key: 'search_preferences'
{
  searchHistory: [
    { query: 'Nike', timestamp: timestamp, type: 'product' },
    { query: 'ABC Retail', timestamp: timestamp, type: 'customer' }
  ],
  searchFields: {
    products: ['name', 'sku', 'brand', 'tags'],
    customers: ['name', 'email', 'phone', 'customerCode']
  },
  fuzzySearch: true,
  maxResults: 50
}
```

### 3.10 Dashboard Metrics Cache
```javascript
// Key: 'dashboard_metrics_cache'
{
  cachedAt: timestamp,
  expiresAt: timestamp,
  metrics: {
    todaySales: 50000,
    todayOrders: 15,
    lowStockItems: 12,
    pendingPayments: 8,
    monthlyRevenue: 500000,
    topProducts: [
      { id: 'uuid', name: 'Nike Air', sales: 100 }
    ]
  }
}
```

---

## 4. Data Validation Rules

### 4.1 Common Validation Rules

```javascript
const ValidationRules = {
  // UUID validation
  uuid: {
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    message: 'Invalid UUID format'
  },

  // Email validation
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email address',
    maxLength: 255
  },

  // Phone validation (Indian format)
  phone: {
    pattern: /^[6-9]\d{9}$/,
    message: 'Invalid phone number (10 digits starting with 6-9)',
    minLength: 10,
    maxLength: 10
  },

  // GST number validation (Indian)
  gst: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    message: 'Invalid GST number format',
    length: 15
  },

  // PAN number validation (Indian)
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: 'Invalid PAN number format',
    length: 10
  },

  // PIN/ZIP code
  pincode: {
    pattern: /^[1-9][0-9]{5}$/,
    message: 'Invalid PIN code (6 digits)',
    length: 6
  },

  // Price validation
  price: {
    min: 0,
    max: 9999999.99,
    decimals: 2,
    message: 'Invalid price value'
  },

  // Quantity validation
  quantity: {
    min: 0,
    max: 999999,
    integer: true,
    message: 'Invalid quantity value'
  },

  // Percentage validation
  percentage: {
    min: 0,
    max: 100,
    decimals: 2,
    message: 'Invalid percentage (0-100)'
  },

  // SKU validation
  sku: {
    pattern: /^[A-Z0-9-]{3,20}$/,
    message: 'SKU must be 3-20 characters (A-Z, 0-9, -)',
    minLength: 3,
    maxLength: 20
  }
};
```

### 4.2 Entity-Specific Validation

#### Manufacturer Validation
```javascript
const ManufacturerValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 200
  },
  email: {
    required: true,
    validate: ValidationRules.email
  },
  phone: {
    required: true,
    validate: ValidationRules.phone
  },
  gst: {
    required: false,
    validate: ValidationRules.gst
  },
  creditLimit: {
    required: false,
    validate: ValidationRules.price,
    default: 0
  },
  status: {
    required: true,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  }
};
```

#### Product Validation
```javascript
const ProductValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 200,
    trim: true
  },
  sku: {
    required: true,
    unique: true,
    validate: ValidationRules.sku
  },
  category: {
    required: true,
    enum: ['Men', 'Women', 'Kids', 'Sports', 'Casual', 'Formal']
  },
  subCategory: {
    required: true,
    enum: ['Shoes', 'Sandals', 'Boots', 'Slippers', 'Sneakers']
  },
  manufacturerId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'manufacturers'
  },
  basePrice: {
    required: true,
    validate: ValidationRules.price,
    min: 1
  },
  mrp: {
    required: true,
    validate: ValidationRules.price,
    min: 1,
    customValidation: (value, data) => {
      return value >= data.basePrice;
    },
    message: 'MRP must be greater than or equal to base price'
  },
  tax: {
    cgst: { validate: ValidationRules.percentage },
    sgst: { validate: ValidationRules.percentage },
    igst: { validate: ValidationRules.percentage }
  },
  status: {
    required: true,
    enum: ['active', 'discontinued', 'draft'],
    default: 'active'
  }
};
```

#### Product Variant Validation
```javascript
const ProductVariantValidation = {
  productId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'products'
  },
  variantSku: {
    required: true,
    unique: true,
    validate: ValidationRules.sku
  },
  size: {
    required: true,
    enum: ['5', '6', '7', '8', '9', '10', '11', '12', 'S', 'M', 'L', 'XL', 'XXL']
  },
  color: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  purchasePrice: {
    required: true,
    validate: ValidationRules.price,
    min: 1
  },
  sellingPrice: {
    required: true,
    validate: ValidationRules.price,
    min: 1,
    customValidation: (value, data) => {
      return value >= data.purchasePrice;
    },
    message: 'Selling price must be greater than or equal to purchase price'
  },
  uniqueComposite: {
    fields: ['productId', 'size', 'color'],
    message: 'Variant with this size and color already exists for this product'
  }
};
```

#### Inventory Validation
```javascript
const InventoryValidation = {
  variantId: {
    required: true,
    unique: true,
    validate: ValidationRules.uuid,
    foreignKey: 'productVariants'
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  quantity: {
    required: true,
    validate: ValidationRules.quantity,
    min: 0
  },
  reorderLevel: {
    required: false,
    validate: ValidationRules.quantity,
    min: 0,
    default: 10
  },
  reorderQuantity: {
    required: false,
    validate: ValidationRules.quantity,
    min: 0,
    default: 50
  }
};
```

#### Purchase Order Validation
```javascript
const PurchaseOrderValidation = {
  poNumber: {
    required: true,
    unique: true,
    pattern: /^PO-\d{4}-\d{5}$/,
    autoGenerate: true
  },
  manufacturerId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'manufacturers'
  },
  orderDate: {
    required: true,
    type: 'timestamp',
    max: Date.now()
  },
  expectedDeliveryDate: {
    required: true,
    type: 'timestamp',
    customValidation: (value, data) => {
      return value >= data.orderDate;
    },
    message: 'Expected delivery date must be after order date'
  },
  items: {
    required: true,
    minLength: 1,
    maxLength: 500,
    itemValidation: {
      variantId: {
        required: true,
        validate: ValidationRules.uuid
      },
      quantity: {
        required: true,
        validate: ValidationRules.quantity,
        min: 1
      },
      unitPrice: {
        required: true,
        validate: ValidationRules.price,
        min: 0.01
      }
    }
  },
  status: {
    required: true,
    enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'],
    default: 'draft'
  },
  totalAmount: {
    required: true,
    validate: ValidationRules.price,
    autoCalculate: true
  }
};
```

#### Customer Validation
```javascript
const CustomerValidation = {
  customerCode: {
    required: true,
    unique: true,
    pattern: /^CUST-\d{5}$/,
    autoGenerate: true
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 200,
    trim: true
  },
  email: {
    required: true,
    unique: true,
    validate: ValidationRules.email
  },
  phone: {
    required: true,
    validate: ValidationRules.phone
  },
  type: {
    required: true,
    enum: ['retailer', 'distributor', 'online'],
    default: 'retailer'
  },
  creditLimit: {
    required: false,
    validate: ValidationRules.price,
    default: 0
  },
  priceLevel: {
    required: true,
    enum: ['Standard', 'Premium', 'VIP'],
    default: 'Standard'
  },
  status: {
    required: true,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  }
};
```

#### Sales Order Validation
```javascript
const SalesOrderValidation = {
  orderNumber: {
    required: true,
    unique: true,
    pattern: /^SO-\d{4}-\d{5}$/,
    autoGenerate: true
  },
  customerId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'customers'
  },
  orderDate: {
    required: true,
    type: 'timestamp',
    max: Date.now()
  },
  items: {
    required: true,
    minLength: 1,
    maxLength: 500,
    itemValidation: {
      variantId: {
        required: true,
        validate: ValidationRules.uuid,
        stockCheck: true  // Validate stock availability
      },
      quantity: {
        required: true,
        validate: ValidationRules.quantity,
        min: 1,
        stockCheck: true
      },
      unitPrice: {
        required: true,
        validate: ValidationRules.price,
        min: 0.01
      }
    }
  },
  status: {
    required: true,
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'draft'
  },
  paymentStatus: {
    required: true,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  }
};
```

#### Invoice Validation
```javascript
const InvoiceValidation = {
  invoiceNumber: {
    required: true,
    unique: true,
    pattern: /^INV-\d{4}-\d{5}$/,
    autoGenerate: true
  },
  customerId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'customers'
  },
  salesOrderId: {
    required: true,
    validate: ValidationRules.uuid,
    foreignKey: 'salesOrders'
  },
  invoiceDate: {
    required: true,
    type: 'timestamp',
    max: Date.now()
  },
  dueDate: {
    required: true,
    type: 'timestamp',
    customValidation: (value, data) => {
      return value >= data.invoiceDate;
    },
    message: 'Due date must be after invoice date'
  },
  status: {
    required: true,
    enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'],
    default: 'draft'
  }
};
```

#### Payment Validation
```javascript
const PaymentValidation = {
  paymentNumber: {
    required: true,
    unique: true,
    pattern: /^PAY-\d{4}-\d{5}$/,
    autoGenerate: true
  },
  type: {
    required: true,
    enum: ['received', 'paid']
  },
  entityId: {
    required: true,
    validate: ValidationRules.uuid
  },
  entityType: {
    required: true,
    enum: ['customer', 'manufacturer']
  },
  amount: {
    required: true,
    validate: ValidationRules.price,
    min: 0.01
  },
  paymentMethod: {
    required: true,
    enum: ['cash', 'cheque', 'bank_transfer', 'upi', 'card']
  },
  paymentDate: {
    required: true,
    type: 'timestamp',
    max: Date.now()
  },
  status: {
    required: true,
    enum: ['pending', 'cleared', 'bounced', 'cancelled'],
    default: 'pending'
  }
};
```

### 4.3 Business Logic Validation

```javascript
const BusinessLogicValidation = {
  // Stock availability check
  checkStockAvailability: (variantId, quantity, location = null) => {
    const inventory = getInventoryByVariant(variantId, location);
    return inventory.availableQuantity >= quantity;
  },

  // Credit limit check
  checkCreditLimit: (customerId, orderAmount) => {
    const customer = getCustomerById(customerId);
    const currentBalance = customer.currentBalance || 0;
    const creditLimit = customer.creditLimit || 0;
    return (currentBalance + orderAmount) <= creditLimit;
  },

  // Duplicate SKU check
  checkDuplicateSku: async (sku, excludeId = null) => {
    const existing = await findBySku(sku);
    if (existing && existing.id !== excludeId) {
      throw new Error('SKU already exists');
    }
  },

  // Price validation (MRP >= Selling Price >= Purchase Price)
  validatePriceHierarchy: (purchasePrice, sellingPrice, mrp) => {
    if (sellingPrice < purchasePrice) {
      throw new Error('Selling price cannot be less than purchase price');
    }
    if (mrp < sellingPrice) {
      throw new Error('MRP cannot be less than selling price');
    }
    return true;
  },

  // Payment validation
  validatePaymentAmount: (invoiceId, paymentAmount) => {
    const invoice = getInvoiceById(invoiceId);
    const totalPaid = getTotalPaidAmount(invoiceId);
    if ((totalPaid + paymentAmount) > invoice.totalAmount) {
      throw new Error('Payment amount exceeds invoice balance');
    }
    return true;
  },

  // Return validation
  validateReturnQuantity: (orderId, itemId, returnQuantity) => {
    const order = getOrderById(orderId);
    const item = order.items.find(i => i.id === itemId);
    const previousReturns = getTotalReturned(orderId, itemId);
    if ((previousReturns + returnQuantity) > item.quantity) {
      throw new Error('Return quantity exceeds ordered quantity');
    }
    return true;
  },

  // Invoice status update based on payments
  updateInvoiceStatus: (invoiceId) => {
    const invoice = getInvoiceById(invoiceId);
    const totalPaid = getTotalPaidAmount(invoiceId);

    if (totalPaid === 0) {
      invoice.status = 'sent';
    } else if (totalPaid < invoice.totalAmount) {
      invoice.status = 'partial';
    } else if (totalPaid >= invoice.totalAmount) {
      invoice.status = 'paid';
    }

    if (invoice.status !== 'paid' && Date.now() > invoice.dueDate) {
      invoice.status = 'overdue';
    }
  },

  // Order status validation (state machine)
  validateOrderStatusTransition: (currentStatus, newStatus) => {
    const allowedTransitions = {
      'draft': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'returned'],
      'delivered': ['returned'],
      'cancelled': [],
      'returned': []
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
    return true;
  }
};
```

---

## 5. Backup/Restore Data Structure (JSON Format)

### 5.1 Backup File Structure

```javascript
{
  version: '1.0.0',              // Backup format version
  appVersion: '1.2.3',           // Application version
  exportedAt: timestamp,
  exportedBy: 'system',
  metadata: {
    totalRecords: 15234,
    totalSize: 15728640,         // bytes
    compressionUsed: false,
    encryptionUsed: false,
    checksum: 'sha256-hash',     // For integrity verification
    database: {
      name: 'FootwearWholesaleDB',
      version: 1
    }
  },
  data: {
    manufacturers: [
      { /* manufacturer object */ },
      { /* manufacturer object */ }
    ],
    products: [
      { /* product object */ },
      { /* product object */ }
    ],
    productVariants: [
      { /* variant object */ },
      { /* variant object */ }
    ],
    inventory: [
      { /* inventory object */ },
      { /* inventory object */ }
    ],
    purchaseOrders: [
      { /* purchase order object */ },
      { /* purchase order object */ }
    ],
    customers: [
      { /* customer object */ },
      { /* customer object */ }
    ],
    salesOrders: [
      { /* sales order object */ },
      { /* sales order object */ }
    ],
    invoices: [
      { /* invoice object */ },
      { /* invoice object */ }
    ],
    payments: [
      { /* payment object */ },
      { /* payment object */ }
    ],
    stockAdjustments: [
      { /* adjustment object */ },
      { /* adjustment object */ }
    ],
    returns: [
      { /* return object */ },
      { /* return object */ }
    ],
    settings: [
      { /* setting object */ },
      { /* setting object */ }
    ],
    auditLogs: [
      { /* audit log object */ },
      { /* audit log object */ }
    ]
  },
  localStorage: {
    app_preferences: { /* preferences object */ },
    ui_state: { /* UI state object */ },
    recent_activity: { /* recent activity object */ },
    notification_settings: { /* notification settings */ },
    backup_metadata: { /* backup metadata */ },
    print_settings: { /* print settings */ },
    export_settings: { /* export settings */ },
    search_preferences: { /* search preferences */ },
    dashboard_metrics_cache: { /* dashboard metrics */ }
  }
}
```

### 5.2 Backup Types

#### Full Backup
```javascript
{
  type: 'full',
  includeData: true,
  includeSettings: true,
  includeLocalStorage: true,
  includeAuditLogs: true,
  includeCache: false,          // Exclude cached data
  dateRange: null               // All data
}
```

#### Incremental Backup
```javascript
{
  type: 'incremental',
  includeData: true,
  includeSettings: true,
  includeLocalStorage: true,
  includeAuditLogs: true,
  sinceDate: timestamp,         // Only data modified after this date
  baseBackupId: 'backup-uuid'   // Reference to last full backup
}
```

#### Selective Backup
```javascript
{
  type: 'selective',
  includeData: true,
  includeSettings: false,
  includeLocalStorage: false,
  includeAuditLogs: false,
  dateRange: {
    from: timestamp,
    to: timestamp
  },
  entities: ['products', 'inventory', 'salesOrders']  // Only specific entities
}
```

### 5.3 Backup Validation

```javascript
const BackupValidation = {
  // Validate backup file structure
  validateBackupStructure: (backup) => {
    const required = ['version', 'exportedAt', 'metadata', 'data'];
    for (const field of required) {
      if (!backup[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    return true;
  },

  // Verify checksum
  verifyChecksum: (backup) => {
    const calculatedChecksum = calculateChecksum(backup.data);
    if (calculatedChecksum !== backup.metadata.checksum) {
      throw new Error('Backup file is corrupted (checksum mismatch)');
    }
    return true;
  },

  // Check version compatibility
  checkVersionCompatibility: (backupVersion, appVersion) => {
    const backupMajor = parseInt(backupVersion.split('.')[0]);
    const appMajor = parseInt(appVersion.split('.')[0]);

    if (backupMajor > appMajor) {
      throw new Error('Backup was created with a newer version of the application');
    }
    return true;
  },

  // Validate data integrity
  validateDataIntegrity: (backup) => {
    const errors = [];

    // Check foreign key relationships
    backup.data.products.forEach(product => {
      const manufacturerExists = backup.data.manufacturers.some(
        m => m.id === product.manufacturerId
      );
      if (!manufacturerExists) {
        errors.push(`Product ${product.id} references non-existent manufacturer ${product.manufacturerId}`);
      }
    });

    // Check variant-product relationships
    backup.data.productVariants.forEach(variant => {
      const productExists = backup.data.products.some(
        p => p.id === variant.productId
      );
      if (!productExists) {
        errors.push(`Variant ${variant.id} references non-existent product ${variant.productId}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Data integrity issues found:\n${errors.join('\n')}`);
    }
    return true;
  }
};
```

### 5.4 Restore Process

```javascript
const RestoreProcess = {
  // Step 1: Validate backup file
  step1_validate: async (backupFile) => {
    const backup = JSON.parse(backupFile);
    BackupValidation.validateBackupStructure(backup);
    BackupValidation.verifyChecksum(backup);
    BackupValidation.checkVersionCompatibility(backup.version, APP_VERSION);
    BackupValidation.validateDataIntegrity(backup);
    return backup;
  },

  // Step 2: Clear existing data (optional)
  step2_clearExisting: async (clearOptions) => {
    if (clearOptions.clearAll) {
      await clearAllData();
    } else if (clearOptions.mergeData) {
      // Keep existing data, merge with backup
    }
  },

  // Step 3: Restore IndexedDB data
  step3_restoreIndexedDB: async (backupData) => {
    const stores = Object.keys(backupData);

    for (const storeName of stores) {
      const records = backupData[storeName];

      for (const record of records) {
        await db[storeName].put(record);
      }

      // Update progress
      updateRestoreProgress(storeName, records.length);
    }
  },

  // Step 4: Restore localStorage
  step4_restoreLocalStorage: (localStorageData) => {
    Object.entries(localStorageData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  },

  // Step 5: Rebuild indexes
  step5_rebuildIndexes: async () => {
    await rebuildAllIndexes();
  },

  // Step 6: Verify restoration
  step6_verify: async (backup) => {
    const stats = await getDatabaseStats();

    if (stats.totalRecords !== backup.metadata.totalRecords) {
      throw new Error('Restoration verification failed: record count mismatch');
    }

    return true;
  },

  // Complete restore workflow
  restore: async (backupFile, options = {}) => {
    try {
      // Step 1: Validate
      const backup = await RestoreProcess.step1_validate(backupFile);

      // Step 2: Clear existing (if requested)
      await RestoreProcess.step2_clearExisting(options);

      // Step 3: Restore IndexedDB
      await RestoreProcess.step3_restoreIndexedDB(backup.data);

      // Step 4: Restore localStorage
      RestoreProcess.step4_restoreLocalStorage(backup.localStorage);

      // Step 5: Rebuild indexes
      await RestoreProcess.step5_rebuildIndexes();

      // Step 6: Verify
      await RestoreProcess.step6_verify(backup);

      return {
        success: true,
        message: 'Data restored successfully',
        recordsRestored: backup.metadata.totalRecords
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  }
};
```

### 5.5 Automated Backup Strategy

```javascript
const AutoBackupScheduler = {
  // Schedule automatic backups
  schedule: () => {
    const settings = getBackupSettings();

    if (settings.autoBackupEnabled) {
      switch (settings.backupFrequency) {
        case 'daily':
          scheduleDaily(settings.backupTime);
          break;
        case 'weekly':
          scheduleWeekly(settings.backupDay, settings.backupTime);
          break;
        case 'monthly':
          scheduleMonthly(settings.backupDate, settings.backupTime);
          break;
      }
    }
  },

  // Trigger backup
  triggerBackup: async (type = 'full') => {
    try {
      const backup = await createBackup(type);
      const filename = `backup-${type}-${Date.now()}.json`;

      // Download backup file
      downloadBackup(backup, filename);

      // Update backup history
      updateBackupHistory({
        date: Date.now(),
        type: type,
        size: JSON.stringify(backup).length,
        status: 'success',
        filename: filename
      });

      // Optional: Upload to cloud storage
      if (settings.cloudBackupEnabled) {
        await uploadToCloud(backup, filename);
      }

      return { success: true, filename };
    } catch (error) {
      updateBackupHistory({
        date: Date.now(),
        type: type,
        status: 'failed',
        error: error.message
      });

      return { success: false, error };
    }
  },

  // Backup reminder notifications
  checkAndNotify: () => {
    const lastBackup = getLastBackupDate();
    const daysSinceBackup = Math.floor((Date.now() - lastBackup) / (1000 * 60 * 60 * 24));

    if (daysSinceBackup >= 7) {
      showNotification({
        title: 'Backup Reminder',
        message: `It's been ${daysSinceBackup} days since your last backup. Please backup your data.`,
        type: 'warning',
        action: 'backup'
      });
    }
  }
};
```

---

## 6. Migration Strategy for Schema Updates

### 6.1 Version Management

```javascript
const SchemaVersions = {
  1: {
    stores: [
      'manufacturers', 'products', 'productVariants', 'inventory',
      'purchaseOrders', 'customers', 'salesOrders', 'invoices',
      'payments', 'stockAdjustments', 'returns', 'settings',
      'auditLogs', 'reportsCache'
    ],
    createdAt: '2025-01-01'
  },
  2: {
    stores: [
      // ... all from v1
      'notifications',  // New store
      'categories'      // New store
    ],
    migrations: ['add_notifications_store', 'add_categories_store', 'migrate_product_categories'],
    createdAt: '2025-06-01'
  },
  3: {
    stores: [
      // ... all from v2
      'suppliers'       // Rename manufacturers to suppliers
    ],
    migrations: ['rename_manufacturers_to_suppliers', 'update_foreign_keys'],
    createdAt: '2026-01-01'
  }
};
```

### 6.2 Migration Scripts

```javascript
const Migrations = {
  // Migration: Add new object store
  add_notifications_store: {
    version: 2,
    up: async (db, transaction) => {
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', {
          keyPath: 'id',
          autoIncrement: false
        });

        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('read', 'read', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    },
    down: async (db, transaction) => {
      if (db.objectStoreNames.contains('notifications')) {
        db.deleteObjectStore('notifications');
      }
    }
  },

  // Migration: Add new field to existing records
  add_email_field_to_customers: {
    version: 2,
    up: async (db, transaction) => {
      const store = transaction.objectStore('customers');
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const customer = cursor.value;
          if (!customer.email) {
            customer.email = '';
            cursor.update(customer);
          }
          cursor.continue();
        }
      };
    },
    down: async (db, transaction) => {
      const store = transaction.objectStore('customers');
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const customer = cursor.value;
          delete customer.email;
          cursor.update(customer);
          cursor.continue();
        }
      };
    }
  },

  // Migration: Rename object store
  rename_manufacturers_to_suppliers: {
    version: 3,
    up: async (db, transaction) => {
      // Create new store
      const newStore = db.createObjectStore('suppliers', {
        keyPath: 'id',
        autoIncrement: false
      });

      // Copy indexes
      const oldStore = transaction.objectStore('manufacturers');
      const indexNames = oldStore.indexNames;
      for (let i = 0; i < indexNames.length; i++) {
        const indexName = indexNames[i];
        const index = oldStore.index(indexName);
        newStore.createIndex(indexName, index.keyPath, {
          unique: index.unique,
          multiEntry: index.multiEntry
        });
      }

      // Copy data
      const request = oldStore.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          newStore.add(cursor.value);
          cursor.continue();
        }
      };

      // Delete old store (will happen in next version bump)
      // db.deleteObjectStore('manufacturers');
    },
    down: async (db, transaction) => {
      // Reverse migration
      const newStore = db.createObjectStore('manufacturers', {
        keyPath: 'id',
        autoIncrement: false
      });

      const oldStore = transaction.objectStore('suppliers');
      // ... copy back
    }
  },

  // Migration: Update foreign key references
  update_foreign_keys: {
    version: 3,
    up: async (db, transaction) => {
      const stores = ['products', 'purchaseOrders'];

      for (const storeName of stores) {
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            const record = cursor.value;

            // Rename field
            if (record.manufacturerId) {
              record.supplierId = record.manufacturerId;
              delete record.manufacturerId;
            }
            if (record.manufacturerName) {
              record.supplierName = record.manufacturerName;
              delete record.manufacturerName;
            }

            cursor.update(record);
            cursor.continue();
          }
        };
      }
    }
  },

  // Migration: Add new index
  add_composite_index: {
    version: 2,
    up: async (db, transaction) => {
      const store = transaction.objectStore('productVariants');
      if (!store.indexNames.contains('composite')) {
        store.createIndex('composite', ['productId', 'size', 'color'], {
          unique: true
        });
      }
    },
    down: async (db, transaction) => {
      const store = transaction.objectStore('productVariants');
      if (store.indexNames.contains('composite')) {
        store.deleteIndex('composite');
      }
    }
  },

  // Migration: Data transformation
  migrate_product_categories: {
    version: 2,
    up: async (db, transaction) => {
      const productsStore = transaction.objectStore('products');
      const categoriesStore = transaction.objectStore('categories');

      // Create categories from existing product categories
      const categoriesSet = new Set();
      const productsRequest = productsStore.openCursor();

      productsRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const product = cursor.value;
          categoriesSet.add(product.category);
          cursor.continue();
        } else {
          // After collecting all categories, create category records
          categoriesSet.forEach(categoryName => {
            categoriesStore.add({
              id: generateUUID(),
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
              status: 'active',
              createdAt: Date.now()
            });
          });
        }
      };
    }
  }
};
```

### 6.3 Migration Runner

```javascript
const MigrationRunner = {
  // Get current database version
  getCurrentVersion: async () => {
    const db = await openDatabase();
    return db.version;
  },

  // Get pending migrations
  getPendingMigrations: (currentVersion, targetVersion) => {
    const pending = [];

    for (let version = currentVersion + 1; version <= targetVersion; version++) {
      const versionMigrations = Object.values(Migrations).filter(
        m => m.version === version
      );
      pending.push(...versionMigrations);
    }

    return pending;
  },

  // Run migrations
  runMigrations: async (targetVersion) => {
    const currentVersion = await MigrationRunner.getCurrentVersion();

    if (currentVersion >= targetVersion) {
      console.log('Database is up to date');
      return;
    }

    const pending = MigrationRunner.getPendingMigrations(currentVersion, targetVersion);

    console.log(`Running ${pending.length} migrations...`);

    // Close existing connection
    await closeDatabase();

    // Open database with new version
    const request = indexedDB.open(DB_NAME, targetVersion);

    request.onupgradeneeded = async (event) => {
      const db = event.target.result;
      const transaction = event.target.transaction;

      // Run each migration
      for (const migration of pending) {
        console.log(`Running migration: ${migration.version}`);
        try {
          await migration.up(db, transaction);
          console.log(`Migration ${migration.version} completed`);
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error);
          throw error;
        }
      }
    };

    request.onsuccess = () => {
      console.log('All migrations completed successfully');
    };

    request.onerror = (event) => {
      console.error('Migration failed:', event.target.error);
    };
  },

  // Rollback migrations
  rollback: async (targetVersion) => {
    const currentVersion = await MigrationRunner.getCurrentVersion();

    if (currentVersion <= targetVersion) {
      console.log('Nothing to rollback');
      return;
    }

    const migrations = Object.values(Migrations)
      .filter(m => m.version > targetVersion && m.version <= currentVersion)
      .reverse();  // Run in reverse order

    console.log(`Rolling back ${migrations.length} migrations...`);

    for (const migration of migrations) {
      if (migration.down) {
        console.log(`Rolling back migration: ${migration.version}`);
        await migration.down();
      }
    }

    console.log('Rollback completed');
  }
};
```

### 6.4 Migration Best Practices

```javascript
const MigrationBestPractices = {
  // 1. Always backup before migration
  preBackup: async () => {
    const backup = await createBackup('full');
    const filename = `pre-migration-backup-${Date.now()}.json`;
    downloadBackup(backup, filename);
    return filename;
  },

  // 2. Test migrations on sample data
  testMigration: async (migration) => {
    // Create test database
    const testDB = await createTestDatabase();

    // Populate with sample data
    await populateSampleData(testDB);

    // Run migration
    try {
      await migration.up(testDB);
      console.log('Migration test passed');
      return true;
    } catch (error) {
      console.error('Migration test failed:', error);
      return false;
    } finally {
      await deleteTestDatabase();
    }
  },

  // 3. Version compatibility check
  checkCompatibility: (backupVersion, currentVersion) => {
    const backupMajor = parseInt(backupVersion.split('.')[0]);
    const currentMajor = parseInt(currentVersion.split('.')[0]);

    return backupMajor === currentMajor;
  },

  // 4. Migration progress tracking
  trackProgress: (migrationName, progress) => {
    const event = new CustomEvent('migration-progress', {
      detail: {
        migration: migrationName,
        progress: progress,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  },

  // 5. Atomic migrations (all or nothing)
  atomicMigration: async (migrations) => {
    const backup = await MigrationBestPractices.preBackup();

    try {
      for (const migration of migrations) {
        await migration.up();
      }
      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Migration failed, rolling back...');
      await RestoreProcess.restore(backup);
      throw error;
    }
  }
};
```

### 6.5 Schema Version Detection

```javascript
const SchemaVersionDetection = {
  // Detect schema version from database
  detectVersion: async () => {
    const db = await openDatabase();
    const version = db.version;
    const stores = Array.from(db.objectStoreNames);

    // Match against known schema versions
    for (const [versionNumber, schema] of Object.entries(SchemaVersions)) {
      if (schema.stores.every(store => stores.includes(store))) {
        return parseInt(versionNumber);
      }
    }

    return null;  // Unknown version
  },

  // Detect version from backup file
  detectBackupVersion: (backup) => {
    if (backup.version) {
      return backup.version;
    }

    // Infer version from structure
    const stores = Object.keys(backup.data);

    for (const [versionNumber, schema] of Object.entries(SchemaVersions)) {
      if (schema.stores.every(store => stores.includes(store))) {
        return parseInt(versionNumber);
      }
    }

    return 1;  // Default to version 1
  },

  // Check if migration is needed
  needsMigration: async () => {
    const currentVersion = await SchemaVersionDetection.detectVersion();
    const latestVersion = Math.max(...Object.keys(SchemaVersions).map(Number));

    return currentVersion < latestVersion;
  }
};
```

---

## 7. Database Initialization

```javascript
const DatabaseInitializer = {
  // Initialize IndexedDB
  initialize: async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const transaction = event.target.transaction;

        // Create all object stores
        DatabaseInitializer.createObjectStores(db, transaction);
      };
    });
  },

  // Create all object stores
  createObjectStores: (db, transaction) => {
    // Manufacturers
    if (!db.objectStoreNames.contains('manufacturers')) {
      const manufacturersStore = db.createObjectStore('manufacturers', {
        keyPath: 'id',
        autoIncrement: false
      });
      manufacturersStore.createIndex('name', 'name', { unique: false });
      manufacturersStore.createIndex('email', 'email', { unique: true });
      manufacturersStore.createIndex('phone', 'phone', { unique: false });
      manufacturersStore.createIndex('status', 'status', { unique: false });
      manufacturersStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Products
    if (!db.objectStoreNames.contains('products')) {
      const productsStore = db.createObjectStore('products', {
        keyPath: 'id',
        autoIncrement: false
      });
      productsStore.createIndex('sku', 'sku', { unique: true });
      productsStore.createIndex('name', 'name', { unique: false });
      productsStore.createIndex('category', 'category', { unique: false });
      productsStore.createIndex('brand', 'brand', { unique: false });
      productsStore.createIndex('manufacturerId', 'manufacturerId', { unique: false });
      productsStore.createIndex('status', 'status', { unique: false });
      productsStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // ... Create all other stores similarly
  },

  // Seed initial data
  seedInitialData: async (db) => {
    // Add default settings
    const settingsStore = db.transaction('settings', 'readwrite').objectStore('settings');

    const defaultSettings = [
      {
        key: 'business_info',
        category: 'business',
        value: {
          name: 'My Footwear Business',
          email: '',
          phone: '',
          address: {}
        },
        description: 'Business information',
        dataType: 'object',
        updatedAt: Date.now()
      },
      {
        key: 'invoice_settings',
        category: 'invoice',
        value: {
          prefix: 'INV',
          startingNumber: 1,
          currentNumber: 1
        },
        description: 'Invoice settings',
        dataType: 'object',
        updatedAt: Date.now()
      }
      // ... add more default settings
    ];

    for (const setting of defaultSettings) {
      await settingsStore.add(setting);
    }
  }
};
```

---

## 8. Performance Optimization Strategies

### 8.1 Indexing Strategy
```javascript
// Use compound indexes for common queries
// Example: Find products by manufacturer and status
productsStore.createIndex('manufacturer_status', ['manufacturerId', 'status']);

// Query:
const index = store.index('manufacturer_status');
const request = index.getAll([manufacturerId, 'active']);
```

### 8.2 Batch Operations
```javascript
const batchInsert = async (storeName, records) => {
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  for (const record of records) {
    store.add(record);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};
```

### 8.3 Pagination
```javascript
const getPaginatedResults = async (storeName, pageSize, pageNumber) => {
  const store = db.transaction(storeName).objectStore(store Name);
  const offset = pageSize * (pageNumber - 1);
  let count = 0;
  const results = [];

  return new Promise((resolve, reject) => {
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        if (count >= offset && count < offset + pageSize) {
          results.push(cursor.value);
        }
        count++;

        if (count < offset + pageSize) {
          cursor.continue();
        } else {
          resolve(results);
        }
      } else {
        resolve(results);
      }
    };

    request.onerror = () => reject(request.error);
  });
};
```

### 8.4 Caching Strategy
```javascript
// Cache frequently accessed data in memory
const DataCache = {
  cache: new Map(),
  ttl: 5 * 60 * 1000,  // 5 minutes

  set: (key, value) => {
    DataCache.cache.set(key, {
      value,
      expiry: Date.now() + DataCache.ttl
    });
  },

  get: (key) => {
    const cached = DataCache.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    DataCache.cache.delete(key);
    return null;
  },

  clear: () => {
    DataCache.cache.clear();
  }
};
```

---

## Summary

This comprehensive data model and storage strategy provides:

1. **Complete IndexedDB Schema**: 14 object stores covering all business entities with proper indexes for efficient queries

2. **Robust Data Relationships**: Well-defined foreign keys, denormalization for performance, and composite indexes for complex queries

3. **localStorage Structure**: Organized settings and preferences for UI state, user preferences, and cached data

4. **Comprehensive Validation**: Entity-level and business logic validation rules to ensure data integrity

5. **Backup/Restore System**: Full, incremental, and selective backup options with integrity verification

6. **Migration Strategy**: Version-controlled schema migrations with rollback capability

7. **Performance Optimization**: Indexing strategies, batch operations, pagination, and caching

The system is designed to:
- Support ~10,000 products with variants
- Handle ~50,000 transactions/year
- Store ~1,000 images
- Maintain 5 years of data
- Work offline with zero infrastructure cost
- Provide easy backup and restore capabilities
- Allow seamless schema migrations for future updates
