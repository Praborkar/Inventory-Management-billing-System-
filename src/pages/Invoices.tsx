
import { MainLayout } from "@/components/layout/MainLayout";
import InvoiceTable from "@/components/invoice/InvoiceTable";

export default function Invoices() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-1.5 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground">
          Manage your sales and GST invoices
        </p>
      </div>
      
      <InvoiceTable />
    </MainLayout>
  );
}
