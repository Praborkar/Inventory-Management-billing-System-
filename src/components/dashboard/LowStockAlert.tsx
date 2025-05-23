
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/contexts/InventoryContext";
import { formatIndianRupees } from "@/contexts/InvoiceContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function LowStockAlert() {
  const { products } = useInventory();
  
  // Filter products that are low in stock
  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.lowStockThreshold
  );

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
        {lowStockProducts.length > 0 && (
          <Badge variant="destructive">{lowStockProducts.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            All items are well-stocked
          </p>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/inventory/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {product.quantity} {product.unit} remaining
                  </div>
                </div>
                <div className="text-right">
                  <div>{formatIndianRupees(product.sellingPrice)}</div>
                </div>
              </div>
            ))}

            {lowStockProducts.length > 5 && (
              <Link
                to="/inventory"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View {lowStockProducts.length - 5} more items
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
