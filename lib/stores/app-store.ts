import { create } from 'zustand';
import { Product, Manufacturer, Customer, Sale, Purchase } from '../types/database.types';
import { StorageService } from '../services/storage.service';

// Create service instances
const productService = new StorageService<Product>('products');
const manufacturerService = new StorageService<Manufacturer>('manufacturers');
const customerService = new StorageService<Customer>('customers');
const saleService = new StorageService<Sale>('sales');
const purchaseService = new StorageService<Purchase>('purchases');

interface AppState {
  // Products
  products: Product[];
  loadProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;

  // Manufacturers
  manufacturers: Manufacturer[];
  loadManufacturers: () => void;
  addManufacturer: (manufacturer: Omit<Manufacturer, 'id'>) => Manufacturer;
  updateManufacturer: (id: number, manufacturer: Partial<Manufacturer>) => void;
  deleteManufacturer: (id: number) => void;
  getManufacturer: (id: number) => Manufacturer | undefined;

  // Customers
  customers: Customer[];
  loadCustomers: () => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: number, customer: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  getCustomer: (id: number) => Customer | undefined;

  // Sales
  sales: Sale[];
  loadSales: () => void;
  addSale: (sale: Omit<Sale, 'id'>) => Sale;
  updateSale: (id: number, sale: Partial<Sale>) => void;
  deleteSale: (id: number) => void;

  // Purchases
  purchases: Purchase[];
  loadPurchases: () => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => Purchase;
  updatePurchase: (id: number, purchase: Partial<Purchase>) => void;
  deletePurchase: (id: number) => void;

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Products
  products: [],
  loadProducts: () => {
    const products = productService.getAll();
    set({ products });
  },
  addProduct: (product) => {
    const newProduct = productService.create(product);
    set((state) => ({ products: [...state.products, newProduct] }));
    return newProduct;
  },
  updateProduct: (id, product) => {
    productService.update(id, product);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    }));
  },
  deleteProduct: (id) => {
    productService.delete(id);
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
  getProduct: (id) => {
    return get().products.find((p) => p.id === id);
  },

  // Manufacturers
  manufacturers: [],
  loadManufacturers: () => {
    const manufacturers = manufacturerService.getAll();
    set({ manufacturers });
  },
  addManufacturer: (manufacturer) => {
    const newManufacturer = manufacturerService.create(manufacturer);
    set((state) => ({ manufacturers: [...state.manufacturers, newManufacturer] }));
    return newManufacturer;
  },
  updateManufacturer: (id, manufacturer) => {
    manufacturerService.update(id, manufacturer);
    set((state) => ({
      manufacturers: state.manufacturers.map((m) => (m.id === id ? { ...m, ...manufacturer } : m)),
    }));
  },
  deleteManufacturer: (id) => {
    manufacturerService.delete(id);
    set((state) => ({
      manufacturers: state.manufacturers.filter((m) => m.id !== id),
    }));
  },
  getManufacturer: (id) => {
    return get().manufacturers.find((m) => m.id === id);
  },

  // Customers
  customers: [],
  loadCustomers: () => {
    const customers = customerService.getAll();
    set({ customers });
  },
  addCustomer: (customer) => {
    const newCustomer = customerService.create(customer);
    set((state) => ({ customers: [...state.customers, newCustomer] }));
    return newCustomer;
  },
  updateCustomer: (id, customer) => {
    customerService.update(id, customer);
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...customer } : c)),
    }));
  },
  deleteCustomer: (id) => {
    customerService.delete(id);
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
  },
  getCustomer: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  // Sales
  sales: [],
  loadSales: () => {
    const sales = saleService.getAll();
    set({ sales });
  },
  addSale: (sale) => {
    const newSale = saleService.create(sale);
    set((state) => ({ sales: [...state.sales, newSale] }));
    return newSale;
  },
  updateSale: (id, sale) => {
    saleService.update(id, sale);
    set((state) => ({
      sales: state.sales.map((s) => (s.id === id ? { ...s, ...sale } : s)),
    }));
  },
  deleteSale: (id) => {
    saleService.delete(id);
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    }));
  },

  // Purchases
  purchases: [],
  loadPurchases: () => {
    const purchases = purchaseService.getAll();
    set({ purchases });
  },
  addPurchase: (purchase) => {
    const newPurchase = purchaseService.create(purchase);
    set((state) => ({ purchases: [...state.purchases, newPurchase] }));
    return newPurchase;
  },
  updatePurchase: (id, purchase) => {
    purchaseService.update(id, purchase);
    set((state) => ({
      purchases: state.purchases.map((p) => (p.id === id ? { ...p, ...purchase } : p)),
    }));
  },
  deletePurchase: (id) => {
    purchaseService.delete(id);
    set((state) => ({
      purchases: state.purchases.filter((p) => p.id !== id),
    }));
  },

  // UI State
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
