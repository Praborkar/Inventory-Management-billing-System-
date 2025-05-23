
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  sku: string;
  hsn: string;
  mrp: number;
  sellingPrice: number;
  purchasePrice: number;
  quantity: number;
  unit: string;
  category: string;
  description?: string;
  image?: string;
  lowStockThreshold: number;
  gstRate: number;
  createdAt: string;
  updatedAt: string;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  lowStockProducts: Product[];
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Mock initial products data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    sku: 'LPT-001',
    hsn: '8471',
    mrp: 49999.99,
    sellingPrice: 45999.99,
    purchasePrice: 40999.99,
    quantity: 15,
    unit: 'Pcs',
    category: 'Electronics',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    lowStockThreshold: 5,
    gstRate: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WMS-002',
    hsn: '8471',
    mrp: 1499.99,
    sellingPrice: 1299.99,
    purchasePrice: 899.99,
    quantity: 45,
    unit: 'Pcs',
    category: 'Accessories',
    description: 'Ergonomic wireless mouse with long battery life',
    lowStockThreshold: 10,
    gstRate: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Monitor 24"',
    sku: 'MNT-003',
    hsn: '8528',
    mrp: 12999.99,
    sellingPrice: 9999.99,
    purchasePrice: 7999.99,
    quantity: 8,
    unit: 'Pcs',
    category: 'Electronics',
    description: '24-inch LED monitor with HDR support',
    lowStockThreshold: 3,
    gstRate: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Headphones',
    sku: 'HPH-004',
    hsn: '8518',
    mrp: 5999.99,
    sellingPrice: 4999.99,
    purchasePrice: 3499.99,
    quantity: 2,
    unit: 'Pcs',
    category: 'Audio',
    description: 'Noise-cancelling over-ear headphones',
    lowStockThreshold: 5,
    gstRate: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'USB Cable',
    sku: 'USB-005',
    hsn: '8544',
    mrp: 599.99,
    sellingPrice: 499.99,
    purchasePrice: 249.99,
    quantity: 100,
    unit: 'Pcs',
    category: 'Cables',
    description: '6ft USB-C to USB-A cable',
    lowStockThreshold: 20,
    gstRate: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const loadProducts = () => {
      // Check if we have products in localStorage
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Use mock data for first load
        setProducts(initialProducts);
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }
      setLoading(false);
    };
    
    loadProducts();
  }, []);
  
  // Update localStorage whenever products change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, loading]);
  
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    
    setProducts([...products, newProduct]);
    toast({
      title: "Product added",
      description: `${product.name} has been added to the inventory`
    });
  };
  
  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, ...updatedFields, updatedAt: new Date().toISOString() }
        : product
    ));
    
    toast({
      title: "Product updated",
      description: "The product has been successfully updated"
    });
  };
  
  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: product ? `${product.name} has been removed` : "Product has been removed"
    });
  };
  
  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };
  
  const lowStockProducts = products.filter(
    product => product.quantity <= product.lowStockThreshold
  );
  
  return (
    <InventoryContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      lowStockProducts,
      loading
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
