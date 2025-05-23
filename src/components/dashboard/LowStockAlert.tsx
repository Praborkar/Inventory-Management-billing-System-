
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/contexts/InventoryContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function LowStockAlert() {
  const { lowStockProducts } = useInventory();
  
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
        <CardDescription>Products that need restocking soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-red-500">
                      <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <Link to={`/inventory/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    {product.quantity} left
                  </Badge>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Threshold: {product.lowStockThreshold}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No low stock items</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <Link 
              to="/inventory"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              View all inventory
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
