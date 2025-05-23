
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useInvoices, InvoiceItem } from "@/contexts/InvoiceContext";

import { CustomerForm, CustomerFormData } from "./CustomerForm";
import { ProductsSection, ProductQuantity } from "./ProductsSection";
import { NotesSection } from "./NotesSection";
import { InvoiceSummary } from "./InvoiceSummary";
import { ActionButtons } from "./ActionButtons";

const InvoiceForm = () => {
  const { user } = useAuth();
  const { products, updateProduct } = useInventory();
  const { addInvoice, calculateTotals } = useInvoices();
  const navigate = useNavigate();
  
  // Customer form state
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    customerName: "",
    customerEmail: "",
    customerMobile: "",
    status: "pending",
    paymentMode: "cash",
    discountPercent: 0
  });
  
  // Products state
  const [selectedProducts, setSelectedProducts] = useState<ProductQuantity[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  // Notes state
  const [notes, setNotes] = useState("");
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate invoice totals when items or discount changes
  useEffect(() => {
    const items = invoiceItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    setInvoiceItems(items);
  }, [selectedProducts]);
  
  const handleCustomerDataChange = (data: Partial<CustomerFormData>) => {
    setCustomerData(prev => ({ ...prev, ...data }));
  };
  
  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1 }]);
  };
  
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], productId };
    setSelectedProducts(updatedProducts);
    
    // Update invoice items
    const updatedItems = [...invoiceItems];
    
    // If item exists, update it
    const existingItemIndex = updatedItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1 && existingItemIndex !== index) {
      // Product already exists in another row, remove this row
      updatedProducts.splice(index, 1);
      setSelectedProducts(updatedProducts);
      return;
    }
    
    // Calculate GST amount
    const gstAmount = (product.sellingPrice * updatedProducts[index].quantity * product.gstRate) / 100;
    
    updatedItems[index] = {
      productId,
      productName: product.name,
      hsn: product.hsn,
      quantity: updatedProducts[index].quantity,
      unitPrice: product.sellingPrice,
      gstRate: product.gstRate,
      gstAmount: gstAmount,
      total: updatedProducts[index].quantity * product.sellingPrice
    };
    
    setInvoiceItems(updatedItems);
  };
  
  const handleQuantityChange = (index: number, quantity: number) => {
    const product = products.find(p => p.id === selectedProducts[index].productId);
    if (!product) return;
    
    if (quantity > product.quantity) {
      setErrors({
        ...errors,
        [`quantity-${index}`]: `Only ${product.quantity} items available in stock`
      });
      return;
    } else {
      const newErrors = { ...errors };
      delete newErrors[`quantity-${index}`];
      setErrors(newErrors);
    }
    
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], quantity };
    setSelectedProducts(updatedProducts);
    
    // Update invoice items
    const updatedItems = [...invoiceItems];
    
    // Calculate GST amount
    const gstAmount = (product.sellingPrice * quantity * product.gstRate) / 100;
    
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      gstAmount,
      total: quantity * updatedItems[index].unitPrice
    };
    
    setInvoiceItems(updatedItems);
  };
  
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
    
    const updatedItems = [...invoiceItems];
    updatedItems.splice(index, 1);
    setInvoiceItems(updatedItems);
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }
    
    if (!customerData.customerEmail.trim()) {
      newErrors.customerEmail = "Customer email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }
    
    if (customerData.customerMobile && !/^\d{10}$/.test(customerData.customerMobile)) {
      newErrors.customerMobile = "Please enter a valid 10-digit mobile number";
    }
    
    if (selectedProducts.length === 0) {
      newErrors.products = "At least one product must be selected";
    }
    
    // Check for duplicate products
    const productIds = selectedProducts.map(p => p.productId);
    const uniqueProductIds = new Set(productIds);
    if (productIds.length !== uniqueProductIds.size) {
      newErrors.products = "Duplicate products found. Please remove duplicates.";
    }
    
    // Check if any product is not selected
    if (selectedProducts.some(p => !p.productId)) {
      newErrors.products = "Please select a product for all rows";
    }
    
    // Check if any quantity is invalid
    if (selectedProducts.some(p => p.quantity <= 0)) {
      newErrors.products = "Quantity must be greater than zero for all products";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const items = invoiceItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    
    const { subtotal, discountAmount, cgst, sgst, total } = calculateTotals(items, customerData.discountPercent);
    
    // Create new invoice
    const invoice = {
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerMobile: customerData.customerMobile,
      items,
      subtotal,
      discountPercent: customerData.discountPercent,
      discountAmount,
      cgst,
      sgst,
      total,
      status: customerData.status,
      paymentMode: customerData.paymentMode,
      notes,
      createdBy: {
        id: user?.id || '',
        name: user?.name || ''
      }
    };
    
    // Update product quantities in inventory
    invoiceItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct(product.id, {
          quantity: product.quantity - item.quantity
        });
      }
    });
    
    addInvoice(invoice);
    navigate('/invoices');
  };
  
  const totals = calculateTotals(invoiceItems, customerData.discountPercent);

  return (
    <div className="space-y-6">
      <CustomerForm 
        data={customerData}
        onChange={handleCustomerDataChange}
        errors={errors}
      />
      
      <ProductsSection
        products={products}
        selectedProducts={selectedProducts}
        invoiceItems={invoiceItems}
        errors={errors}
        onProductChange={handleProductChange}
        onQuantityChange={handleQuantityChange}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />
      
      <NotesSection
        notes={notes}
        onChange={setNotes}
      />
      
      <InvoiceSummary
        subtotal={totals.subtotal}
        discountPercent={customerData.discountPercent}
        discountAmount={totals.discountAmount}
        cgst={totals.cgst}
        sgst={totals.sgst}
        total={totals.total}
      />
      
      <ActionButtons onSubmit={handleSubmit} />
    </div>
  );
};

export default InvoiceForm;
