
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthContext";
import { useInventory, Product } from "@/contexts/InventoryContext";
import { useInvoices, InvoiceItem, formatIndianRupees } from "@/contexts/InvoiceContext";
import { IndianRupee } from "lucide-react";

interface ProductQuantity {
  productId: string;
  quantity: number;
}

const paymentModes = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "netbanking", label: "Net Banking" }
];

const InvoiceForm = () => {
  const { user } = useAuth();
  const { products, updateProduct } = useInventory();
  const { addInvoice, calculateTotals } = useInvoices();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"paid" | "pending">("pending");
  const [paymentMode, setPaymentMode] = useState<string>("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const [selectedProducts, setSelectedProducts] = useState<ProductQuantity[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate invoice totals when items or discount changes
  useEffect(() => {
    const items = invoiceItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    setInvoiceItems(items);
  }, [selectedProducts]);
  
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
  
  const handleDiscountChange = (value: string) => {
    const discount = parseFloat(value);
    if (isNaN(discount) || discount < 0) {
      setDiscountPercent(0);
    } else if (discount > 100) {
      setDiscountPercent(100);
    } else {
      setDiscountPercent(discount);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }
    
    if (!customerEmail.trim()) {
      newErrors.customerEmail = "Customer email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }
    
    if (customerMobile && !/^\d{10}$/.test(customerMobile)) {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const items = invoiceItems.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    
    const { subtotal, discountAmount, cgst, sgst, total } = calculateTotals(items, discountPercent);
    
    // Create new invoice
    const invoice = {
      customerName,
      customerEmail,
      customerMobile,
      items,
      subtotal,
      discountPercent,
      discountAmount,
      cgst,
      sgst,
      total,
      status,
      paymentMode,
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
  
  const totals = calculateTotals(invoiceItems, discountPercent);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Buyer Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter buyer name"
            className={errors.customerName ? "border-red-500" : ""}
          />
          {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerMobile">Mobile Number</Label>
          <Input
            id="customerMobile"
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value)}
            placeholder="Enter mobile number"
            className={errors.customerMobile ? "border-red-500" : ""}
          />
          {errors.customerMobile && <p className="text-sm text-red-500">{errors.customerMobile}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter customer email"
            className={errors.customerEmail ? "border-red-500" : ""}
          />
          {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail}</p>}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "paid" | "pending") => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={paymentMode} onValueChange={(value) => setPaymentMode(value)}>
              <SelectTrigger id="paymentMode">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => handleDiscountChange(e.target.value)}
            placeholder="Enter discount percentage"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Products</Label>
          <Button
            type="button"
            size="sm"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>
        
        {errors.products && <p className="text-sm text-red-500">{errors.products}</p>}
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No products selected
                  </TableCell>
                </TableRow>
              ) : (
                selectedProducts.map((productEntry, index) => {
                  const product = products.find(p => p.id === productEntry.productId);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={productEntry.productId}
                          onValueChange={(value) => handleProductChange(index, value)}
                        >
                          <SelectTrigger id={`product-${index}`} className="w-[200px]">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter(p => p.quantity > 0 || p.id === productEntry.productId) // Show out of stock only if already selected
                              .map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id}
                                  disabled={product.quantity === 0 && product.id !== productEntry.productId}
                                >
                                  {product.name} {product.quantity === 0 ? "(Out of stock)" : ""}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {product?.hsn || "-"}
                      </TableCell>
                      <TableCell>
                        {product ? formatIndianRupees(product.sellingPrice) : "₹0.00"}
                      </TableCell>
                      <TableCell>
                        {product ? `${product.gstRate}%` : "0%"}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={product ? product.quantity : 1}
                          value={productEntry.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                          className={`w-20 ${errors[`quantity-${index}`] ? "border-red-500" : ""}`}
                        />
                        {errors[`quantity-${index}`] && (
                          <p className="text-xs text-red-500">{errors[`quantity-${index}`]}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {invoiceItems[index]?.total ? formatIndianRupees(invoiceItems[index].total) : "₹0.00"}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any additional notes"
          rows={3}
        />
      </div>
      
      <Card className="p-4 bg-gray-50">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatIndianRupees(totals.subtotal)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between">
              <span>Discount ({discountPercent}%):</span>
              <span>-{formatIndianRupees(totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>CGST:</span>
            <span>{formatIndianRupees(totals.cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST:</span>
            <span>{formatIndianRupees(totals.sgst)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatIndianRupees(totals.total)}</span>
          </div>
        </div>
      </Card>
      
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          Create Invoice
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/invoices')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
