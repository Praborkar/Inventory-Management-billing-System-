
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './InventoryContext';

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  recentInvoices: Invoice[];
  calculateTotals: (items: InvoiceItem[], discountPercent: number) => {
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
  };
  loading: boolean;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

// Mock initial invoices
const initialInvoices: Invoice[] = [
  {
    id: '1',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      {
        productId: '1',
        productName: 'Laptop',
        quantity: 1,
        unitPrice: 999.99,
        total: 999.99
      },
      {
        productId: '2',
        productName: 'Wireless Mouse',
        quantity: 1,
        unitPrice: 24.99,
        total: 24.99
      }
    ],
    subtotal: 1024.98,
    discountPercent: 0,
    discountAmount: 0,
    tax: 87.12,
    total: 1112.10,
    status: 'paid',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdBy: {
      id: '1',
      name: 'Admin User'
    }
  },
  {
    id: '2',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      {
        productId: '3',
        productName: 'Monitor 24"',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98
      }
    ],
    subtotal: 399.98,
    discountPercent: 10,
    discountAmount: 40.00,
    tax: 30.60,
    total: 390.58,
    status: 'pending',
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    createdBy: {
      id: '2',
      name: 'Cashier User'
    }
  },
  {
    id: '3',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    items: [
      {
        productId: '4',
        productName: 'Headphones',
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99
      },
      {
        productId: '5',
        productName: 'USB Cable',
        quantity: 2,
        unitPrice: 9.99,
        total: 19.98
      }
    ],
    subtotal: 109.97,
    discountPercent: 0,
    discountAmount: 0,
    tax: 9.35,
    total: 119.32,
    status: 'paid',
    createdAt: new Date().toISOString(),
    createdBy: {
      id: '1',
      name: 'Admin User'
    }
  }
];

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    const loadInvoices = () => {
      // Check if we have invoices in localStorage
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      } else {
        // Use mock data for first load
        setInvoices(initialInvoices);
        localStorage.setItem('invoices', JSON.stringify(initialInvoices));
      }
      setLoading(false);
    };
    
    loadInvoices();
  }, []);
  
  // Update localStorage whenever invoices change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
  }, [invoices, loading]);
  
  const calculateTotals = (items: InvoiceItem[], discountPercent: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.085; // 8.5% tax rate
    const total = taxableAmount + tax;
    
    return {
      subtotal,
      discountAmount,
      tax,
      total
    };
  };
  
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now
    };
    
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Invoice created",
      description: `Invoice #${newInvoice.id} has been created`
    });
  };
  
  const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, ...updatedFields }
        : invoice
    ));
    
    toast({
      title: "Invoice updated",
      description: `Invoice #${id} has been updated`
    });
  };
  
  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    
    toast({
      title: "Invoice deleted",
      description: `Invoice #${id} has been deleted`
    });
  };
  
  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };
  
  // Get most recent 5 invoices for the dashboard
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoice,
      recentInvoices,
      calculateTotals,
      loading
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};
