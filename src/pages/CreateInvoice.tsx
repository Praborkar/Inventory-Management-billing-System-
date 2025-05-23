
import { MainLayout } from "@/components/layout/MainLayout";
import InvoiceForm from "@/components/invoice/InvoiceForm";

export default function CreateInvoice() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
        <p className="text-muted-foreground">
          Generate a new GST invoice for a customer
        </p>
      </div>
      
      <InvoiceForm />
    </MainLayout>
  );
}
