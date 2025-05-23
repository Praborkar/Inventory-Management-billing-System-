
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/contexts/InventoryContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InventoryChart() {
  const { products } = useInventory();
  
  // Group products by category and calculate total quantity in each
  const categoryData = React.useMemo(() => {
    const categories = products.reduce((acc: Record<string, number>, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {});
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [products]);
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>
          Current stock levels across all product categories
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value} units`, "Quantity"]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
