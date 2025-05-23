
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/contexts/InventoryContext";
import { InvoiceItem, formatIndianRupees } from "@/contexts/InvoiceContext";

export interface ProductQuantity {
  productId: string;
  quantity: number;
}

interface ProductsSectionProps {
  products: Product[];
  selectedProducts: ProductQuantity[];
  invoiceItems: InvoiceItem[];
  errors: Record<string, string>;
  onProductChange: (index: number, productId: string) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
}

export const ProductsSection = ({
  products,
  selectedProducts,
  invoiceItems,
  errors,
  onProductChange,
  onQuantityChange,
  onAddProduct,
  onRemoveProduct,
}: ProductsSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Products</Label>
        <Button
          type="button"
          size="sm"
          onClick={onAddProduct}
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
                        onValueChange={(value) => onProductChange(index, value)}
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
                        onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 0)}
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
                        onClick={() => onRemoveProduct(index)}
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
  );
};

