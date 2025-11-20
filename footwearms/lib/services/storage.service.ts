// localStorage-based storage service
import type { Database, AppSettings } from '../types/database.types';

const STORAGE_KEY = 'footwear_db';
const SETTINGS_KEY = 'footwear_settings';

// Initialize default database structure
const defaultDatabase: Database = {
  manufacturers: [],
  products: [],
  productVariants: [],
  customers: [],
  purchases: [],
  purchaseItems: [],
  sales: [],
  saleItems: [],
  salesReturns: [],
  salesReturnItems: [],
  invoices: [],
  payments: [],
  stockAdjustments: [],
  stockAdjustmentItems: [],
  settings: {
    businessName: 'My Footwear Business',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessGstin: '',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    taxRate: 18,
    lowStockThreshold: 10,
    theme: 'system',
    sidebarCollapsed: false,
    rowsPerPage: 50,
  },
  lastId: {
    manufacturers: 0,
    products: 0,
    productVariants: 0,
    customers: 0,
    purchases: 0,
    purchaseItems: 0,
    sales: 0,
    saleItems: 0,
    salesReturns: 0,
    salesReturnItems: 0,
    invoices: 0,
    payments: 0,
    stockAdjustments: 0,
    stockAdjustmentItems: 0,
  },
};

// Initialize database if it doesn't exist
export function initializeDatabase(): Database {
  try {
    if (typeof window === 'undefined') {
      return defaultDatabase;
    }
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatabase));
      return defaultDatabase;
    }
    return JSON.parse(existingData);
  } catch (error) {
    console.error('Error initializing database:', error);
    return defaultDatabase;
  }
}

// Get the entire database
export function getDatabase(): Database {
  try {
    if (typeof window === 'undefined') {
      return defaultDatabase;
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return initializeDatabase();
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return defaultDatabase;
  }
}

// Save the entire database
export function saveDatabase(db: Database): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database:', error);
    throw new Error('Failed to save data. Storage might be full.');
  }
}

// Generic CRUD operations
export class StorageService<T extends { id: number }> {
  constructor(private tableName: keyof Omit<Database, 'settings' | 'lastId'>) {}

  // Get all records
  getAll(): T[] {
    const db = getDatabase();
    return (db[this.tableName] as unknown as T[]) || [];
  }

  // Get by ID
  getById(id: number): T | undefined {
    const records = this.getAll();
    return records.find((record) => record.id === id);
  }

  // Create new record
  create(data: Omit<T, 'id'>): T {
    const db = getDatabase();
    const lastIdKey = this.tableName as keyof Database['lastId'];
    const newId = db.lastId[lastIdKey] + 1;

    const newRecord = {
      ...data,
      id: newId,
    } as T;

    (db[this.tableName] as unknown as T[]).push(newRecord);
    db.lastId[lastIdKey] = newId;
    saveDatabase(db);

    return newRecord;
  }

  // Update existing record
  update(id: number, data: Partial<T>): T | null {
    const db = getDatabase();
    const records = db[this.tableName] as unknown as T[];
    const index = records.findIndex((record) => record.id === id);

    if (index === -1) {
      return null;
    }

    records[index] = {
      ...records[index],
      ...data,
      id, // Ensure ID doesn't change
    };

    saveDatabase(db);
    return records[index];
  }

  // Delete record
  delete(id: number): boolean {
    const db = getDatabase();
    const records = db[this.tableName] as unknown as T[];
    const initialLength = records.length;

    (db[this.tableName] as unknown as T[]) = records.filter((record) => record.id !== id);

    if ((db[this.tableName] as unknown as T[]).length < initialLength) {
      saveDatabase(db);
      return true;
    }

    return false;
  }

  // Find with filter
  find(predicate: (record: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  // Find one
  findOne(predicate: (record: T) => boolean): T | undefined {
    return this.getAll().find(predicate);
  }

  // Count
  count(predicate?: (record: T) => boolean): number {
    const records = this.getAll();
    if (predicate) {
      return records.filter(predicate).length;
    }
    return records.length;
  }
}

// Settings operations
export const settingsService = {
  get(): AppSettings {
    const db = getDatabase();
    return db.settings;
  },

  update(settings: Partial<AppSettings>): AppSettings {
    const db = getDatabase();
    db.settings = {
      ...db.settings,
      ...settings,
    };
    saveDatabase(db);
    return db.settings;
  },
};

// Backup and restore operations
export const backupService = {
  export(): string {
    const db = getDatabase();
    return JSON.stringify(db, null, 2);
  },

  import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as Database;
      // Validate structure
      if (!data.manufacturers || !data.products || !data.lastId) {
        throw new Error('Invalid backup file structure');
      }
      saveDatabase(data);
      return true;
    } catch (error) {
      console.error('Error importing backup:', error);
      return false;
    }
  },

  downloadBackup(): void {
    const data = this.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `footwear-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  clearAll(): void {
    if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      localStorage.removeItem(STORAGE_KEY);
      initializeDatabase();
    }
  },
};

// Auto-generate document numbers
export function generateDocumentNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${year}-${timestamp}-${random}`;
}

// Storage monitoring
export function getStorageInfo(): {
  used: number;
  total: number;
  percentage: number;
} {
  let used = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // localStorage typically has 5-10MB limit, we'll estimate 5MB
  const total = 5 * 1024 * 1024; // 5MB in bytes
  const percentage = (used / total) * 100;

  return { used, total, percentage };
}
