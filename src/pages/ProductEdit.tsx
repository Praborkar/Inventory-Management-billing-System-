
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import ProductForm from "@/components/inventory/ProductForm";

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">
          Update product details, MRP, and GST information
        </p>
      </div>
      
      {id && <ProductForm editMode productId={id} />}
    </MainLayout>
  );
}
