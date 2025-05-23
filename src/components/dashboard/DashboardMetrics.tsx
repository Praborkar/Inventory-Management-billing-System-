
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/contexts/InventoryContext";
import { useInvoices } from "@/contexts/InvoiceContext";

export default function DashboardMetrics() {
  const { products, lowStockProducts } = useInventory();
  const { invoices } = useInvoices();
  
  // Calculate metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockCount = lowStockProducts.length;
  
  // Calculate sales metrics
  const totalSales = invoices.reduce((sum, invoice) => 
    invoice.status === 'paid' ? sum + invoice.total : sum, 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
  
  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = invoices.reduce((sum, invoice) => {
    const invoiceDate = new Date(invoice.createdAt).toISOString().split('T')[0];
    return invoiceDate === today && invoice.status === 'paid' ? sum + invoice.total : sum;
  }, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
            <path d="M20 3H4C2.89543 3 2 3.89543 2 5V7C2 8.10457 2.89543 9 4 9H20C21.1046 9 22 8.10457 22 7V5C22 3.89543 21.1046 3 20 3Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 13H4C2.89543 13 2 13.8954 2 15V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V15C22 13.8954 21.1046 13 20 13Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {totalStock} items in inventory
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground">
            Need immediate attention
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${todaySales.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +{invoices.filter(i => {
              const invoiceDate = new Date(i.createdAt).toISOString().split('T')[0];
              return invoiceDate === today;
            }).length} new invoices today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingInvoices}</div>
          <p className="text-xs text-muted-foreground">
            ${invoices.reduce((sum, invoice) => 
              invoice.status === 'pending' ? sum + invoice.total : sum, 0).toFixed(2)} to be collected
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
