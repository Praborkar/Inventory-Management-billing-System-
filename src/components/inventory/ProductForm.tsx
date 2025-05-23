
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory, Product } from "@/contexts/InventoryContext";

interface ProductFormProps {
  editMode?: boolean;
  productId?: string;
}

const categories = [
  "Electronics",
  "Accessories",
  "Audio",
  "Cables",
  "Computer Components",
  "Gaming",
  "Networking",
  "Office Equipment",
  "Software",
  "Storage"
];

const units = [
  "Pcs",
  "Box",
  "Kg",
  "Ltr",
  "Mtr",
  "Pack",
  "Set"
];

const gstRates = [
  {value: 0, label: "0% (Exempt)"},
  {value: 5, label: "5% GST"},
  {value: 12, label: "12% GST"},
  {value: 18, label: "18% GST"},
  {value: 28, label: "28% GST"}
];

const ProductForm: React.FC<ProductFormProps> = ({ editMode = false, productId }) => {
  const { addProduct, updateProduct, getProduct } = useInventory();
  const navigate = useNavigate();
  
  const existingProduct = editMode && productId ? getProduct(productId) : null;
  
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: existingProduct?.name || "",
    sku: existingProduct?.sku || "",
    hsn: existingProduct?.hsn || "",
    mrp: existingProduct?.mrp || 0,
    sellingPrice: existingProduct?.sellingPrice || 0,
    purchasePrice: existingProduct?.purchasePrice || 0,
    quantity: existingProduct?.quantity || 0,
    unit: existingProduct?.unit || "Pcs",
    category: existingProduct?.category || "Electronics",
    description: existingProduct?.description || "",
    lowStockThreshold: existingProduct?.lowStockThreshold || 5,
    gstRate: existingProduct?.gstRate || 18,
    image: existingProduct?.image || ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    // Clear any error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }
    
    if (!formData.hsn.trim()) {
      newErrors.hsn = "HSN code is required";
    }
    
    if (formData.mrp <= 0) {
      newErrors.mrp = "MRP must be greater than zero";
    }
    
    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than zero";
    }
    
    if (formData.purchasePrice <= 0) {
      newErrors.purchasePrice = "Purchase price must be greater than zero";
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.unit) {
      newErrors.unit = "Unit is required";
    }
    
    if (formData.lowStockThreshold < 0) {
      newErrors.lowStockThreshold = "Threshold cannot be negative";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editMode && productId) {
      updateProduct(productId, formData);
      navigate(`/inventory/${productId}`);
    } else {
      addProduct(formData);
      navigate('/inventory');
    }
  };
  
  // Format currency input
  const formatIndianRupees = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter product SKU"
            className={errors.sku ? "border-red-500" : ""}
          />
          {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hsn">HSN Code</Label>
          <Input
            id="hsn"
            name="hsn"
            value={formData.hsn}
            onChange={handleChange}
            placeholder="Enter HSN code"
            className={errors.hsn ? "border-red-500" : ""}
          />
          {errors.hsn && <p className="text-sm text-red-500">{errors.hsn}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mrp">MRP (₹)</Label>
          <Input
            id="mrp"
            name="mrp"
            type="number"
            step="0.01"
            min="0"
            value={formData.mrp}
            onChange={handleNumberChange}
            placeholder="Enter MRP"
            className={errors.mrp ? "border-red-500" : ""}
          />
          {errors.mrp && <p className="text-sm text-red-500">{errors.mrp}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.sellingPrice}
            onChange={handleNumberChange}
            placeholder="Enter selling price"
            className={errors.sellingPrice ? "border-red-500" : ""}
          />
          {errors.sellingPrice && <p className="text-sm text-red-500">{errors.sellingPrice}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.purchasePrice}
            onChange={handleNumberChange}
            placeholder="Enter purchase price"
            className={errors.purchasePrice ? "border-red-500" : ""}
          />
          {errors.purchasePrice && <p className="text-sm text-red-500">{errors.purchasePrice}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleNumberChange}
            placeholder="Enter quantity in stock"
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleSelectChange('unit', value)}
          >
            <SelectTrigger id="unit" className={errors.unit ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gstRate">GST Rate</Label>
          <Select 
            value={formData.gstRate.toString()} 
            onValueChange={(value) => handleSelectChange('gstRate', parseInt(value))}
          >
            <SelectTrigger id="gstRate">
              <SelectValue placeholder="Select GST rate" />
            </SelectTrigger>
            <SelectContent>
              {gstRates.map(rate => (
                <SelectItem key={rate.value} value={rate.value.toString()}>
                  {rate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            value={formData.lowStockThreshold}
            onChange={handleNumberChange}
            placeholder="Enter low stock threshold"
            className={errors.lowStockThreshold ? "border-red-500" : ""}
          />
          {errors.lowStockThreshold && <p className="text-sm text-red-500">{errors.lowStockThreshold}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={4}
        />
      </div>
      
      {/* Image URL field could be replaced with a file upload component in a real application */}
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image || ""}
          onChange={handleChange}
          placeholder="Enter image URL (optional)"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {editMode ? "Update Product" : "Add Product"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/inventory')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
