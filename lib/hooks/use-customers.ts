import { useAppStore } from '../stores/app-store';
import type { Customer } from '../types/database.types';

export function useCustomers() {
  const {
    customers,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
  } = useAppStore();

  return {
    customers,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    getActiveCustomers: () => customers.filter((c) => c.isActive),
    getCustomersByType: (type: Customer['customerType']) =>
      customers.filter((c) => c.customerType === type && c.isActive),
    searchCustomers: (query: string) => {
      const q = query.toLowerCase();
      return customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.businessName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    },
  };
}
