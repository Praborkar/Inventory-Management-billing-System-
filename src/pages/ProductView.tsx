
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import ProductDetail from "@/components/inventory/ProductDetail";

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Product Details</h2>
        <p className="text-muted-foreground">
          View detailed information about this product
        </p>
      </div>
      
      {id && <ProductDetail productId={id} />}
    </MainLayout>
  );
}
