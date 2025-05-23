
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventory, Product } from "@/contexts/InventoryContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatIndianRupees } from "@/contexts/InvoiceContext";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { getProduct, deleteProduct } = useInventory();
  const navigate = useNavigate();
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="mb-4">The requested product could not be found.</p>
        <Button onClick={() => navigate('/inventory')}>
          Back to Inventory
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
      navigate('/inventory');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-500">SKU: {product.sku}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/inventory')}
          >
            Back
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/inventory/${productId}/edit`)}>
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={handleDelete}
              >
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 h-fit">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p>{product.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">SKU:</span>
                    <p>{product.sku}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">HSN Code:</span>
                    <p>{product.hsn}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p>{product.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">GST Rate:</span>
                    <p>{product.gstRate}%</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="whitespace-pre-line">{product.description || 'No description provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Pricing & Inventory</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">MRP:</span>
                    <p>{formatIndianRupees(product.mrp)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Selling Price:</span>
                    <p>{formatIndianRupees(product.sellingPrice)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Purchase Price:</span>
                    <p>{formatIndianRupees(product.purchasePrice)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Quantity in Stock:</span>
                    <div className="flex items-center">
                      <p>{product.quantity} {product.unit}</p>
                      {product.quantity <= product.lowStockThreshold && (
                        <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Low Stock Threshold:</span>
                    <p>{product.lowStockThreshold} {product.unit}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created At:</span>
                    <p>{formatDate(product.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p>{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 h-fit">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-md border object-cover"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-100 rounded-md p-6 min-h-[200px]">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
