
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import InvoiceDetail from "@/components/invoice/InvoiceDetail";

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Invoice Details</h2>
        <p className="text-muted-foreground">
          View detailed information about this invoice
        </p>
      </div>
      
      {id && <InvoiceDetail invoiceId={id} />}
    </MainLayout>
  );
}
