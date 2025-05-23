
import { MainLayout } from "@/components/layout/MainLayout";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import InventoryChart from "@/components/dashboard/InventoryChart";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your inventory and sales activity
        </p>
      </div>
      
      <div className="space-y-6">
        <DashboardMetrics />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <SalesChart />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <InventoryChart />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <RecentActivity />
          <LowStockAlert />
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <Button asChild className="px-8 py-6 text-lg">
            <Link to="/inventory">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M20 3H4C2.89543 3 2 3.89543 2 5V7C2 8.10457 2.89543 9 4 9H20C21.1046 9 22 8.10457 22 7V5C22 3.89543 21.1046 3 20 3Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 13H4C2.89543 13 2 13.8954 2 15V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V15C22 13.8954 21.1046 13 20 13Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Manage Inventory
            </Link>
          </Button>
          <Button asChild variant="outline" className="px-8 py-6 text-lg">
            <Link to="/create-invoice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
