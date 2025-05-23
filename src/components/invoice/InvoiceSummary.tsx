
import { Card } from "@/components/ui/card";
import { formatIndianRupees } from "@/contexts/InvoiceContext";

interface InvoiceSummaryProps {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  cgst: number;
  sgst: number;
  total: number;
}

export const InvoiceSummary = ({
  subtotal,
  discountPercent,
  discountAmount,
  cgst,
  sgst,
  total
}: InvoiceSummaryProps) => {
  return (
    <Card className="p-4 bg-gray-50">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatIndianRupees(subtotal)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between">
            <span>Discount ({discountPercent}%):</span>
            <span>-{formatIndianRupees(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>CGST:</span>
          <span>{formatIndianRupees(cgst)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST:</span>
          <span>{formatIndianRupees(sgst)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{formatIndianRupees(total)}</span>
        </div>
      </div>
    </Card>
  );
};

