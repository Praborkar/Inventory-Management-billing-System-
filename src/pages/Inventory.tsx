
import { MainLayout } from "@/components/layout/MainLayout";
import ProductTable from "@/components/inventory/ProductTable";

export default function Inventory() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
        <p className="text-muted-foreground">
          Manage your products and stock levels
        </p>
      </div>
      
      <ProductTable />
    </MainLayout>
  );
}
