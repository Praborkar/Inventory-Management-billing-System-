
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './InventoryContext';

export interface InvoiceItem {
  productId: string;
  productName: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  gstAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  cgst: number;
  sgst: number;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  paymentMode: 'cash' | 'upi' | 'card' | 'netbanking';
  notes?: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  recentInvoices: Invoice[];
  calculateTotals: (items: InvoiceItem[], discountPercent: number) => {
    subtotal: number;
    discountAmount: number;
    cgst: number;
    sgst: number;
    total: number;
  };
  formatIndianRupees: (amount: number) => string;
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

// Format number in Indian currency format
export const formatIndianRupees = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

// Mock initial invoices
const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerName: 'Raj Sharma',
    customerEmail: 'raj@example.com',
    customerMobile: '9876543210',
    items: [
      {
        productId: '1',
        productName: 'Laptop',
        hsn: '8471',
        quantity: 1,
        unitPrice: 45999.99,
        gstRate: 18,
        gstAmount: 8280.00,
        total: 45999.99
      },
      {
        productId: '2',
        productName: 'Wireless Mouse',
        hsn: '8471',
        quantity: 1,
        unitPrice: 1299.99,
        gstRate: 18,
        gstAmount: 234.00,
        total: 1299.99
      }
    ],
    subtotal: 47299.98,
    discountPercent: 0,
    discountAmount: 0,
    cgst: 4257.00,
    sgst: 4257.00,
    total: 55813.98,
    status: 'paid',
    paymentMode: 'card',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdBy: {
      id: '1',
      name: 'Admin User'
    }
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customerName: 'Priya Patel',
    customerEmail: 'priya@example.com',
    customerMobile: '8765432109',
    items: [
      {
        productId: '3',
        productName: 'Monitor 24"',
        hsn: '8528',
        quantity: 2,
        unitPrice: 9999.99,
        gstRate: 18,
        gstAmount: 3600.00,
        total: 19999.98
      }
    ],
    subtotal: 19999.98,
    discountPercent: 10,
    discountAmount: 2000.00,
    cgst: 1620.00,
    sgst: 1620.00,
    total: 21239.98,
    status: 'pending',
    paymentMode: 'upi',
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    createdBy: {
      id: '2',
      name: 'Staff User'
    }
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    customerName: 'Ananya Joshi',
    customerEmail: 'ananya@example.com',
    customerMobile: '7654321098',
    items: [
      {
        productId: '4',
        productName: 'Headphones',
        hsn: '8518',
        quantity: 1,
        unitPrice: 4999.99,
        gstRate: 18,
        gstAmount: 900.00,
        total: 4999.99
      },
      {
        productId: '5',
        productName: 'USB Cable',
        hsn: '8544',
        quantity: 2,
        unitPrice: 499.99,
        gstRate: 12,
        gstAmount: 120.00,
        total: 999.98
      }
    ],
    subtotal: 5999.97,
    discountPercent: 0,
    discountAmount: 0,
    cgst: 510.00,
    sgst: 510.00,
    total: 7019.97,
    status: 'paid',
    paymentMode: 'cash',
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
    
    // Calculate GST (assuming equal split between CGST and SGST)
    const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const cgst = totalGst / 2;
    const sgst = totalGst / 2;
    
    const total = taxableAmount + totalGst;
    
    return {
      subtotal,
      discountAmount,
      cgst,
      sgst,
      total
    };
  };
  
  const generateInvoiceNumber = () => {
    const prefix = 'INV-';
    const lastInvoice = invoices
      .map(inv => {
        if (inv.invoiceNumber && inv.invoiceNumber.startsWith(prefix)) {
          const num = parseInt(inv.invoiceNumber.substring(prefix.length), 10);
          return isNaN(num) ? 0 : num;
        }
        return 0;
      })
      .reduce((max, num) => Math.max(max, num), 0);
    
    return `${prefix}${String(lastInvoice + 1).padStart(3, '0')}`;
  };
  
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: generateInvoiceNumber(),
      createdAt: now
    };
    
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Invoice created",
      description: `Invoice #${newInvoice.invoiceNumber} has been created`
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
      description: `Invoice #${updatedFields.invoiceNumber || id} has been updated`
    });
  };
  
  const deleteInvoice = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    
    toast({
      title: "Invoice deleted",
      description: invoice ? `Invoice #${invoice.invoiceNumber} has been deleted` : "Invoice has been deleted"
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
      formatIndianRupees,
      loading
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};
