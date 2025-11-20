# Footwear Wholesale Management System - Implementation Plan

## Executive Summary

This plan outlines the complete implementation of a browser-based footwear wholesale management system using Next.js 16, React 19, Tailwind CSS 4, and IndexedDB for local storage. The system will be authentication-free, designed for single-user/single-location businesses.

**Timeline:** 8 weeks (4 phases)
**Current Stack:** Next.js 16.0.3, React 19.2.0, Tailwind CSS 4
**Storage:** IndexedDB + localStorage (100% browser-based)
**Target Capacity:** 10,000+ products, 50,000+ transactions/year

---

## Table of Contents

1. [Technology Stack & Dependencies](#1-technology-stack--dependencies)
2. [Project Architecture](#2-project-architecture)
3. [Database Schema & Storage Strategy](#3-database-schema--storage-strategy)
4. [UI/UX Component Architecture](#4-uiux-component-architecture)
5. [Implementation Roadmap](#5-implementation-roadmap)
6. [Testing Strategy](#6-testing-strategy)
7. [Risk Mitigation](#7-risk-mitigation)
8. [MVP Definition](#8-mvp-definition)

---

## 1. Technology Stack & Dependencies

### Core Dependencies (Install First)

```bash
npm install dexie dexie-react-hooks zustand immer
npm install jspdf jspdf-autotable html2canvas
npm install xlsx file-saver
npm install chart.js react-chartjs-2
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react date-fns react-hot-toast
npm install @tanstack/react-table @tanstack/react-virtual
npm install clsx tailwind-merge
```

### Dev Dependencies

```bash
npm install -D @types/file-saver prettier prettier-plugin-tailwindcss
```

### Technology Justification

| Technology | Purpose | Why |
|------------|---------|-----|
| **Dexie.js** | IndexedDB wrapper | TypeScript support, live queries, migrations |
| **Zustand** | State management | Lightweight, simple API, localStorage persist |
| **Chart.js** | Data visualization | Mature, feature-rich, customizable |
| **jsPDF** | PDF generation | Client-side PDF creation for invoices/reports |
| **SheetJS (xlsx)** | Excel export | Industry standard for spreadsheet generation |
| **React Hook Form** | Form management | Performance, validation, minimal re-renders |
| **Zod** | Schema validation | Type-safe validation, TypeScript integration |
| **TanStack Table** | Data tables | Headless, flexible, virtual scrolling support |

---

## 2. Project Architecture

### Directory Structure

```
footwearms/
├── app/                                    # Next.js app directory
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Dashboard (homepage)
│   ├── globals.css                        # Global styles
│   │
│   ├── dashboard/
│   │   └── page.tsx                       # Dashboard module
│   │
│   ├── manufacturers/
│   │   ├── page.tsx                       # List manufacturers
│   │   ├── new/page.tsx                   # Add manufacturer
│   │   └── [id]/
│   │       ├── page.tsx                   # View/Edit manufacturer
│   │       └── purchases/page.tsx         # Purchase history
│   │
│   ├── products/
│   │   ├── page.tsx                       # Product catalog
│   │   ├── new/page.tsx                   # Add product
│   │   └── [id]/
│   │       ├── page.tsx                   # View/Edit product
│   │       └── inventory/page.tsx         # Product inventory
│   │
│   ├── purchases/
│   │   ├── page.tsx                       # Purchase orders list
│   │   ├── new/page.tsx                   # Create PO
│   │   └── [id]/
│   │       ├── page.tsx                   # View/Edit PO
│   │       └── receive/page.tsx           # Receive goods
│   │
│   ├── inventory/
│   │   ├── page.tsx                       # Inventory overview
│   │   ├── adjustments/
│   │   │   ├── page.tsx                   # Adjustments list
│   │   │   └── new/page.tsx               # New adjustment
│   │   ├── transfers/
│   │   │   ├── page.tsx                   # Transfers list
│   │   │   └── new/page.tsx               # New transfer
│   │   └── alerts/page.tsx                # Low stock alerts
│   │
│   ├── sales/
│   │   ├── page.tsx                       # Sales orders list
│   │   ├── new/page.tsx                   # Create sale
│   │   └── [id]/
│   │       ├── page.tsx                   # View/Edit sale
│   │       └── returns/page.tsx           # Process returns
│   │
│   ├── customers/
│   │   ├── page.tsx                       # Customer list
│   │   ├── new/page.tsx                   # Add customer
│   │   └── [id]/
│   │       ├── page.tsx                   # View/Edit customer
│   │       └── orders/page.tsx            # Customer orders
│   │
│   ├── billing/
│   │   ├── page.tsx                       # Billing dashboard
│   │   ├── invoices/
│   │   │   ├── page.tsx                   # Invoice list
│   │   │   ├── new/page.tsx               # Generate invoice
│   │   │   └── [id]/page.tsx              # View/Edit invoice
│   │   └── payments/
│   │       ├── page.tsx                   # Payment tracking
│   │       └── record/page.tsx            # Record payment
│   │
│   ├── reports/
│   │   ├── page.tsx                       # Reports dashboard
│   │   ├── sales/page.tsx                 # Sales reports
│   │   ├── purchases/page.tsx             # Purchase reports
│   │   ├── inventory/page.tsx             # Inventory reports
│   │   └── financial/page.tsx             # Financial reports
│   │
│   ├── settings/
│   │   ├── page.tsx                       # Settings home
│   │   ├── general/page.tsx               # General settings
│   │   ├── display/page.tsx               # Display preferences
│   │   └── backup/page.tsx                # Backup/Restore
│   │
│   └── api/                               # Optional API routes
│       ├── export/
│       │   ├── pdf/route.ts               # PDF export
│       │   └── excel/route.ts             # Excel export
│       └── backup/
│           ├── download/route.ts          # Backup download
│           └── restore/route.ts           # Restore backup
│
├── components/
│   ├── ui/                                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── header.tsx                     # Top navigation
│   │   ├── sidebar.tsx                    # Side navigation
│   │   ├── breadcrumbs.tsx                # Breadcrumb nav
│   │   └── page-header.tsx                # Page title/actions
│   │
│   ├── charts/
│   │   ├── line-chart.tsx                 # Chart.js Line
│   │   ├── bar-chart.tsx                  # Chart.js Bar
│   │   ├── pie-chart.tsx                  # Chart.js Pie
│   │   └── dashboard-chart.tsx            # Dashboard wrapper
│   │
│   ├── forms/
│   │   ├── manufacturer-form.tsx
│   │   ├── product-form.tsx
│   │   ├── purchase-form.tsx
│   │   ├── sales-form.tsx
│   │   ├── customer-form.tsx
│   │   └── invoice-form.tsx
│   │
│   ├── tables/
│   │   ├── data-table.tsx                 # Generic table
│   │   ├── manufacturers-table.tsx
│   │   ├── products-table.tsx
│   │   ├── purchases-table.tsx
│   │   └── sales-table.tsx
│   │
│   └── features/
│       ├── dashboard/
│       │   ├── stats-card.tsx
│       │   ├── recent-transactions.tsx
│       │   └── stock-alerts.tsx
│       │
│       ├── inventory/
│       │   ├── stock-level-indicator.tsx
│       │   └── low-stock-alert.tsx
│       │
│       └── reports/
│           ├── report-filters.tsx
│           └── export-buttons.tsx
│
├── lib/
│   ├── db/
│   │   ├── index.ts                       # Dexie instance
│   │   ├── schema.ts                      # Database schema
│   │   ├── migrations.ts                  # DB migrations
│   │   └── seed.ts                        # Seed data
│   │
│   ├── stores/
│   │   ├── app-store.ts                   # Global state (Zustand)
│   │   ├── ui-store.ts                    # UI state
│   │   └── settings-store.ts              # Settings state
│   │
│   ├── hooks/
│   │   ├── use-manufacturers.ts           # Manufacturer hooks
│   │   ├── use-products.ts                # Product hooks
│   │   ├── use-purchases.ts               # Purchase hooks
│   │   ├── use-sales.ts                   # Sales hooks
│   │   ├── use-inventory.ts               # Inventory hooks
│   │   └── use-customers.ts               # Customer hooks
│   │
│   ├── services/
│   │   ├── backup.service.ts              # Backup/restore
│   │   ├── export.service.ts              # Export functionality
│   │   ├── pdf-generator.service.ts       # PDF generation
│   │   ├── excel-generator.service.ts     # Excel generation
│   │   └── report-generator.service.ts    # Report generation
│   │
│   ├── utils/
│   │   ├── format.ts                      # Formatting utilities
│   │   ├── validation.ts                  # Validation utilities
│   │   ├── calculations.ts                # Business calculations
│   │   └── cn.ts                          # className utility
│   │
│   └── types/
│       ├── database.types.ts              # Database types
│       ├── models.types.ts                # Business model types
│       └── api.types.ts                   # API types
│
├── config/
│   ├── constants.ts                       # App constants
│   └── business-rules.ts                  # Business logic constants
│
└── public/
    ├── images/
    │   └── placeholder.png                # Default product image
    └── manifest.json                      # PWA manifest
```

---

## 3. Database Schema & Storage Strategy

### IndexedDB Schema (Dexie)

```typescript
// lib/db/schema.ts

import Dexie, { Table } from 'dexie';

// Type Definitions
export interface Manufacturer {
  id?: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id?: number;
  sku: string;                              // Unique SKU
  name: string;
  brand: string;
  category: string;
  description?: string;
  manufacturerId: number;
  basePrice: number;                        // Cost price
  sellingPrice: number;                     // Retail price
  mrp: number;                              // Maximum retail price
  minStockLevel: number;                    // Reorder point
  imageUrl?: string;                        // Base64 or URL
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id?: number;
  productId: number;
  sku: string;                              // Unique variant SKU
  size: string;
  color: string;
  additionalPrice: number;                  // Price difference from base
  currentStock: number;
  createdAt: Date;
}

export interface Inventory {
  id?: number;
  productId: number;
  variantId?: number;
  quantity: number;
  location?: string;
  lastStockUpdate: Date;
  reorderLevel: number;
}

export interface Purchase {
  id?: number;
  purchaseNumber: string;                   // Auto-generated PO-YYYY-XXXX
  manufacturerId: number;
  purchaseDate: Date;
  expectedDeliveryDate?: Date;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'partial' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id?: number;
  purchaseId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalAmount: number;
  createdAt: Date;
}

export interface Customer {
  id?: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id?: number;
  saleNumber: string;                       // Auto-generated SO-YYYY-XXXX
  customerId: number;
  saleDate: Date;
  deliveryDate?: Date;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id?: number;
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
  createdAt: Date;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;                    // Auto-generated INV-YYYY-XXXX
  saleId: number;
  customerId: number;
  invoiceDate: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  paymentTerms: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id?: number;
  paymentNumber: string;                    // Auto-generated PAY-YYYY-XXXX
  referenceType: 'invoice' | 'purchase';
  referenceId: number;
  paymentDate: Date;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'cheque' | 'bank_transfer';
  transactionRef?: string;
  notes?: string;
  createdAt: Date;
}

export interface StockAdjustment {
  id?: number;
  adjustmentNumber: string;                 // Auto-generated ADJ-YYYY-XXXX
  adjustmentDate: Date;
  adjustmentType: 'increase' | 'decrease' | 'correction';
  reason: string;
  notes?: string;
  createdAt: Date;
}

export interface StockAdjustmentItem {
  id?: number;
  adjustmentId: number;
  productId: number;
  variantId?: number;
  quantityBefore: number;
  quantityAdjusted: number;
  quantityAfter: number;
  createdAt: Date;
}

export interface AppSettings {
  id?: number;
  settingKey: string;
  settingValue: string;
  updatedAt: Date;
}

// Dexie Database Class
export class FootwearDB extends Dexie {
  manufacturers!: Table<Manufacturer>;
  products!: Table<Product>;
  productVariants!: Table<ProductVariant>;
  inventory!: Table<Inventory>;
  purchases!: Table<Purchase>;
  purchaseItems!: Table<PurchaseItem>;
  customers!: Table<Customer>;
  sales!: Table<Sale>;
  saleItems!: Table<SaleItem>;
  invoices!: Table<Invoice>;
  payments!: Table<Payment>;
  stockAdjustments!: Table<StockAdjustment>;
  stockAdjustmentItems!: Table<StockAdjustmentItem>;
  appSettings!: Table<AppSettings>;

  constructor() {
    super('FootwearWholesaleDB');

    this.version(1).stores({
      manufacturers: '++id, name, email, phone, isActive, createdAt',
      products: '++id, &sku, name, manufacturerId, category, brand, isActive, createdAt',
      productVariants: '++id, &sku, productId, size, color, createdAt',
      inventory: '++id, productId, variantId, [productId+variantId], quantity',
      purchases: '++id, &purchaseNumber, manufacturerId, purchaseDate, status, createdAt',
      purchaseItems: '++id, purchaseId, productId, variantId, createdAt',
      customers: '++id, name, businessName, email, phone, isActive, createdAt',
      sales: '++id, &saleNumber, customerId, saleDate, status, createdAt',
      saleItems: '++id, saleId, productId, variantId, createdAt',
      invoices: '++id, &invoiceNumber, saleId, customerId, invoiceDate, dueDate, status, createdAt',
      payments: '++id, &paymentNumber, referenceType, referenceId, paymentDate, createdAt',
      stockAdjustments: '++id, &adjustmentNumber, adjustmentDate, createdAt',
      stockAdjustmentItems: '++id, adjustmentId, productId, variantId, createdAt',
      appSettings: '++id, &settingKey, updatedAt'
    });
  }
}

export const db = new FootwearDB();
```

### localStorage Schema

```typescript
// lib/stores/settings-store.ts

interface LocalStorageSchema {
  // Display preferences
  'app:theme': 'light' | 'dark' | 'system';
  'app:sidebar-collapsed': boolean;
  'app:table-density': 'compact' | 'normal' | 'comfortable';

  // Recent activity
  'app:recent-views': Array<{
    type: string;
    id: number;
    name: string;
    timestamp: number;
  }>;

  // Backup reminder
  'app:last-backup-date': string;
  'app:backup-reminder-enabled': boolean;
  'app:backup-frequency-days': number;

  // Business settings
  'business:name': string;
  'business:address': string;
  'business:phone': string;
  'business:email': string;
  'business:gstin': string;
  'business:logo': string; // Base64

  // Display settings
  'display:currency-symbol': string;
  'display:date-format': string;
  'display:rows-per-page': number;
}
```

---

## 4. UI/UX Component Architecture

### Tailwind Design System

```javascript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

### Core Component Library

**Priority Components to Build:**

1. **Data Display**
   - `DataTable` - Sortable, filterable table with pagination
   - `Card` - Container component
   - `Badge` - Status indicators
   - `EmptyState` - No data placeholder

2. **Forms**
   - `Input` - Text, number, email, phone
   - `Select` - Dropdown with search
   - `DatePicker` - Date selection
   - `FileUpload` - Image upload
   - `FormGroup` - Form field wrapper

3. **Navigation**
   - `Sidebar` - Main navigation
   - `TopNavbar` - Header with actions
   - `Breadcrumb` - Page navigation
   - `Tabs` - Section switching

4. **Feedback**
   - `Alert` - Notifications
   - `Toast` - Pop-up messages
   - `Modal` - Dialogs
   - `Loading` - Spinner/skeleton

5. **Charts** (Chart.js wrappers)
   - `LineChart` - Trends
   - `BarChart` - Comparisons
   - `PieChart` - Distribution
   - `DoughnutChart` - Categories

### Responsive Design Breakpoints

```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Tablet landscape
  xl: '1280px',   // Desktop
  '2xl': '1536px' // Large desktop
};

// Usage:
// hidden md:block -> Hidden on mobile, visible on tablet+
// grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

---

## 5. Implementation Roadmap

### PHASE 1: Core Setup (Week 1-2)

#### Week 1: Foundation

**Day 1-2: Project Configuration**
```bash
# Install dependencies
npm install dexie dexie-react-hooks zustand lucide-react date-fns clsx tailwind-merge

# Configure Next.js
# Update next.config.ts for static export if needed
```

Tasks:
- ✅ Set up project structure
- ✅ Configure Tailwind theme
- ✅ Install core dependencies
- ✅ Create folder structure

**Day 3: IndexedDB Setup**
- Create database schema (`lib/db/schema.ts`)
- Initialize Dexie instance
- Create CRUD helper functions
- Test database operations

**Day 4-5: Core UI Components**
- Build Button component (variants: primary, secondary, danger)
- Build Input component (text, number, select)
- Build Card component
- Build Modal/Dialog component
- Build Alert/Toast notification system

#### Week 2: Dashboard & Products

**Day 1-3: Dashboard Module**
- Create dashboard layout
- Build summary cards component (total products, sales, alerts)
- Create recent transactions list
- Build stock alerts panel
- Add quick action buttons

**Day 4-5: Product Management**
- Create product listing page (table view)
- Build product form (name, SKU, category, pricing)
- Implement product CRUD operations
- Add search and filter functionality

**Deliverables:**
- ✅ Working database with seed data
- ✅ Functional dashboard with metrics
- ✅ Product management (add, edit, delete, list)
- ✅ Core UI component library

---

### PHASE 2: Inventory System (Week 3-4)

#### Week 3: Manufacturers & Purchases

**Day 1: Manufacturer Management**
- Create manufacturer listing page
- Build manufacturer form
- Implement manufacturer CRUD operations

**Day 2-4: Purchase Order System**
- Create purchase order listing page
- Build PO creation form
  - Header: PO number, manufacturer, date
  - Line items: product selection, quantity, unit cost
  - Auto-calculate totals
- Implement PO workflow (draft, ordered, received)

**Day 5: Goods Receipt**
- Build goods receipt interface
- Implement receive functionality
- Auto-update inventory on receipt

#### Week 4: Inventory Control

**Day 1-2: Inventory Tracking**
- Create inventory dashboard
- Show current stock levels
- Build stock adjustment form
- Implement adjustment logging

**Day 3: Stock Alerts**
- Create alert system
- Low stock threshold configuration
- Alert notification center

**Day 4-5: Inventory Reports**
- Stock valuation report
- Stock movement report
- Export to Excel functionality

**Deliverables:**
- ✅ Complete purchase workflow (PO → Receipt → Inventory)
- ✅ Inventory tracking and adjustments
- ✅ Stock alerts system
- ✅ Basic inventory reports

---

### PHASE 3: Sales Module (Week 5-6)

#### Week 5: Customers & Sales Orders

**Day 1: Customer Management**
- Create customer listing page
- Build customer form
- Implement customer CRUD operations

**Day 2-4: Sales Order System**
- Create sales order listing page
- Build SO creation form
  - Customer selection
  - Product line items with stock check
  - Discount and tax calculation
  - Total computation
- Implement SO workflow (draft, confirmed, delivered)
- Auto-reduce inventory on confirmation

**Day 5: Sales Returns**
- Build return request form
- Implement return workflow
- Restore inventory on returns

#### Week 6: Billing & Payments

**Day 1-2: Invoice Generation**
- Create invoice template (professional design)
- Implement invoice generation from sales orders
- Add invoice listing and detail pages
- PDF export using jsPDF

**Day 3-4: Payment Tracking**
- Build payment recording interface
- Create payment history view
- Implement payment reconciliation
- Outstanding invoices dashboard
- Aging analysis (30/60/90 days)

**Day 5: Sales Analytics**
- Sales summary dashboard
- Revenue trends chart
- Customer-wise sales analysis

**Deliverables:**
- ✅ Complete sales workflow (SO → Invoice → Payment)
- ✅ Returns and refunds system
- ✅ Professional invoice generation with PDF
- ✅ Payment tracking and aging reports

---

### PHASE 4: Finishing (Week 7-8)

#### Week 7: Reports & Analytics

**Day 1-3: Comprehensive Reports**
- Financial reports (P&L, revenue, expenses)
- Inventory reports (valuation, movement)
- Sales reports (by customer, product, period)
- Purchase reports (by manufacturer, period)
- Customer ledger
- Export to Excel and PDF

**Day 4-5: Data Visualization**
- Install and configure Chart.js
- Create dashboard charts:
  - Sales trend line chart
  - Revenue pie chart
  - Inventory bar chart
  - Top customers chart
- Make charts interactive

#### Week 8: Backup, Settings & Testing

**Day 1-2: Backup & Restore**
- Build one-click backup button (export to JSON)
- Create restore interface (upload JSON)
- Implement auto-backup reminders
- Add backup history tracking

**Day 3: Settings & Configuration**
- Build settings page:
  - Business information
  - Invoice settings
  - Display preferences
  - Backup schedule
  - Storage monitoring

**Day 4-5: Testing & QA**
- Unit testing (database operations, calculations)
- Integration testing (complete workflows)
- Browser compatibility testing
- Performance testing (large datasets)
- Bug fixes

**Deliverables:**
- ✅ Complete reporting module with 15+ reports
- ✅ Data visualization with Chart.js
- ✅ Backup/restore system
- ✅ Settings and configuration
- ✅ Tested and production-ready system

---

## 6. Testing Strategy

### Unit Testing

```typescript
// Example: Test product creation
describe('Product CRUD Operations', () => {
  it('should create a new product', async () => {
    const product = {
      sku: 'TEST-001',
      name: 'Test Product',
      category: 'Running Shoes',
      brand: 'Nike',
      basePrice: 1000,
      sellingPrice: 1500,
      mrp: 2000,
      minStockLevel: 10,
      manufacturerId: 1,
      isActive: true
    };

    const id = await db.products.add(product);
    expect(id).toBeDefined();

    const saved = await db.products.get(id);
    expect(saved?.sku).toBe('TEST-001');
  });
});
```

### Integration Testing

Test complete workflows:
1. **Purchase Flow**: Create PO → Receive goods → Verify inventory increase
2. **Sales Flow**: Create SO → Generate invoice → Record payment → Verify inventory decrease
3. **Return Flow**: Create return → Verify inventory restoration → Verify refund

### Browser Compatibility

Test on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Performance Testing

- **Load Testing**: 10,000 products, 50,000 transactions
- **Query Performance**: Search/filter response time < 1 second
- **Report Generation**: Large reports < 5 seconds
- **Memory Usage**: Monitor for memory leaks

---

## 7. Risk Mitigation

### Risk 1: Storage Quota Exceeded

**Mitigation:**
- Implement storage monitoring dashboard
- Show usage percentage in settings
- Alert at 70% capacity
- Provide data archiving feature
- Compress product images (max 800x800px, WebP format)
- Auto-archive old transactions (> 2 years)

```typescript
// Storage monitoring
async function checkStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    const percentage = (usage! / quota!) * 100;

    if (percentage > 85) {
      showAlert('Storage nearly full! Consider archiving old data.');
    }

    return { used: usage, total: quota, percentage };
  }
}
```

### Risk 2: Browser Data Cleared

**Mitigation:**
- Request persistent storage API
- Implement daily auto-backup reminders
- Prominent backup button in header
- Last backup date indicator
- Cloud backup integration (optional)

```typescript
// Request persistent storage
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const granted = await navigator.storage.persist();
    console.log(`Persistent storage: ${granted}`);
  }
}
```

### Risk 3: Performance with Large Datasets

**Mitigation:**
- Proper IndexedDB indexing
- Pagination (50-100 items per page)
- Virtual scrolling for large lists
- Lazy loading of images
- Background processing with Web Workers
- Query optimization

### Risk 4: Data Corruption

**Mitigation:**
- Data validation before storage
- Use IndexedDB transactions
- Audit trail for all changes
- Regular backup reminders
- Schema versioning and migrations

---

## 8. MVP Definition

### MVP Scope (First 4 Weeks)

**Core Features Only:**

1. ✅ **Product Management**
   - Add/Edit/Delete products
   - Basic product info (no images initially)
   - Simple list view

2. ✅ **Manufacturer Management**
   - Add/Edit manufacturers
   - Contact information

3. ✅ **Purchase Orders**
   - Create PO
   - Receive goods
   - Auto-update inventory

4. ✅ **Inventory Tracking**
   - View stock levels
   - Stock adjustments
   - Low stock alerts

5. ✅ **Sales Orders**
   - Create SO with stock check
   - Reduce inventory on sale
   - Basic customer info

6. ✅ **Basic Dashboard**
   - Summary metrics
   - Recent transactions
   - Quick actions

7. ✅ **Reports**
   - Current stock report
   - Sales summary
   - Export to CSV

8. ✅ **Backup**
   - Manual JSON export
   - Simple restore

### MVP Success Criteria

- User can add 50 products in 30 minutes
- Create and receive PO in 5 minutes
- Create SO and reduce inventory in 3 minutes
- Check inventory in < 10 seconds
- Backup all data with one click

### Post-MVP Features (Week 5-8)

- Professional invoice generation (PDF)
- Payment tracking
- Returns and refunds
- Advanced reporting with charts
- Image management
- Auto-backup reminders
- Settings customization

---

## 9. Development Workflow

### Daily Workflow

```bash
# 1. Start development server
npm run dev

# 2. Make changes

# 3. Test locally
# - Test database operations
# - Test UI components
# - Test complete workflows

# 4. Commit changes
git add .
git commit -m "feat: Add product management module"

# 5. Push to branch
git push -u origin claude/plan-nextjs-footwear-01EJha1V7fWHMjqTZZJrixSK
```

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint + Prettier configured
- All functions typed
- Proper error handling
- Loading states for async operations
- Optimistic UI updates

### Git Commit Convention

```
feat: Add new feature
fix: Bug fix
refactor: Code refactoring
style: UI/styling changes
docs: Documentation
test: Add tests
chore: Build/tooling changes
```

---

## 10. Next Steps

### Immediate Actions (This Week)

1. **Review this plan** ✅
2. **Install dependencies**
   ```bash
   npm install dexie dexie-react-hooks zustand lucide-react date-fns clsx tailwind-merge
   ```
3. **Create database schema** (`lib/db/schema.ts`)
4. **Build core UI components** (`components/ui/`)
5. **Set up Tailwind theme** (`tailwind.config.ts`)

### Week 1 Goals

- ✅ Complete project setup
- ✅ Database schema ready
- ✅ Core UI components built
- ✅ Basic dashboard working

### Success Metrics

**Technical:**
- Zero data loss
- < 2 second load time
- Support 10,000+ products
- < 500MB storage for typical use

**Business:**
- Daily active usage > 80%
- Backup frequency: Weekly minimum
- User satisfaction: > 4/5

---

## 11. Resources & References

### Documentation
- Next.js: https://nextjs.org/docs
- Dexie.js: https://dexie.org/
- Chart.js: https://www.chartjs.org/
- Tailwind CSS: https://tailwindcss.com/

### Design Inspiration
- Tailwind UI: https://tailwindui.com/
- Shadcn UI: https://ui.shadcn.com/

### Tools
- IndexedDB Explorer (Chrome DevTools)
- React DevTools
- VS Code Extensions: ESLint, Prettier, Tailwind IntelliSense

---

## 12. Team & Support

### Roles
- **Developer**: Full-stack (React, TypeScript, IndexedDB)
- **Designer**: UI/UX (part-time)
- **QA**: Testing (week 7-8)

### Communication
- Daily standups (15 minutes)
- Weekly progress reviews
- End-of-phase demos

---

## Conclusion

This implementation plan provides a complete roadmap for building a production-ready Footwear Wholesale Management System in 8 weeks. The phased approach ensures early wins with the MVP while building towards a comprehensive solution.

**Key Success Factors:**
- Clear priorities and dependencies
- Risk mitigation strategies in place
- Realistic timeline with buffer
- Quality-first approach
- User-centric design

Start with Phase 1, Week 1 and build incrementally. Each phase delivers tangible value while setting the foundation for the next.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-20
**Project:** Footwear Wholesale Management System
**Stack:** Next.js 16 + React 19 + Tailwind CSS 4 + IndexedDB
