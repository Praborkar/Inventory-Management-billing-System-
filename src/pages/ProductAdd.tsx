
import { MainLayout } from "@/components/layout/MainLayout";
import ProductForm from "@/components/inventory/ProductForm";

export default function ProductAdd() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div>
      
      <ProductForm />
    </MainLayout>
  );
}
