
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

const ProductForm: React.FC<ProductFormProps> = ({ editMode = false, productId }) => {
  const { addProduct, updateProduct, getProduct } = useInventory();
  const navigate = useNavigate();
  
  const existingProduct = editMode && productId ? getProduct(productId) : null;
  
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: existingProduct?.name || "",
    sku: existingProduct?.sku || "",
    price: existingProduct?.price || 0,
    quantity: existingProduct?.quantity || 0,
    category: existingProduct?.category || "Electronics",
    description: existingProduct?.description || "",
    lowStockThreshold: existingProduct?.lowStockThreshold || 5,
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
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
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
    
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than zero";
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
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
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleNumberChange}
            placeholder="Enter product price"
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
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
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={handleCategoryChange}
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
