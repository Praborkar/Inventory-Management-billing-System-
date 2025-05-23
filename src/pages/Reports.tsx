
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { useInventory } from "@/contexts/InventoryContext";
import { useInvoices } from "@/contexts/InvoiceContext";

export default function Reports() {
  const { products } = useInventory();
  const { invoices } = useInvoices();
  
  // Prepare data for category distribution
  const categoryData = products.reduce((acc: Record<string, number>, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.quantity;
    return acc;
  }, {});
  
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ 
    name, value 
  }));
  
  // Prepare data for sales by category
  const salesByCategoryData = () => {
    const categoryRevenue: Record<string, number> = {};
    
    // Calculate revenue by product and then group by category
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        invoice.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            const { category } = product;
            categoryRevenue[category] = (categoryRevenue[category] || 0) + item.total;
          }
        });
      }
    });
    
    return Object.entries(categoryRevenue).map(([name, value]) => ({ 
      name, value: parseFloat(value.toFixed(2)) 
    }));
  };
  
  // Prepare data for monthly sales
  const monthlySalesData = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Initialize monthly totals
    const monthlySales = months.map(month => ({ 
      name: month, 
      sales: 0,
      invoices: 0 
    }));
    
    // Populate with data
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        const date = new Date(invoice.createdAt);
        const month = date.getMonth(); // 0-11
        
        monthlySales[month].sales += invoice.total;
        monthlySales[month].invoices += 1;
      }
    });
    
    // Format numbers
    return monthlySales.map(item => ({
      ...item,
      sales: parseFloat(item.sales.toFixed(2))
    }));
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6B6B', '#4ECDC4'];
  
  return (
    <MainLayout requireAdmin>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Analytics and reports for your inventory and sales
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Monthly Sales Chart */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales Overview</CardTitle>
            <CardDescription>
              Sales performance by month in the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySalesData()} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    return name === 'sales' ? [`$${value}`, 'Sales'] : [value, 'Invoices'];
                  }} />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total Sales"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="invoices" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Number of Invoices"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>
              Products quantity by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByCategoryData()} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="value" fill="#3b82f6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Summary Stats */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Key Performance Metrics</CardTitle>
            <CardDescription>
              Summary of important business metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Total Products</span>
                <span className="text-3xl font-bold">{products.length}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Total Sales</span>
                <span className="text-3xl font-bold">
                  ${invoices
                    .filter(i => i.status === 'paid')
                    .reduce((total, invoice) => total + invoice.total, 0)
                    .toFixed(2)}
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Total Items Sold</span>
                <span className="text-3xl font-bold">
                  {invoices
                    .filter(i => i.status === 'paid')
                    .reduce((total, invoice) => 
                      total + invoice.items.reduce((sum, item) => sum + item.quantity, 0), 0)}
                </span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">Avg Order Value</span>
                <span className="text-3xl font-bold">
                  ${invoices.length > 0
                    ? (invoices
                        .filter(i => i.status === 'paid')
                        .reduce((total, invoice) => total + invoice.total, 0) / 
                        invoices.filter(i => i.status === 'paid').length)
                        .toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
