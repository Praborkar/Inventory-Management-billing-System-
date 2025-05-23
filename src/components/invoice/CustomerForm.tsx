
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface CustomerFormData {
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  status: "paid" | "pending";
  paymentMode: "cash" | "upi" | "card" | "netbanking";
  discountPercent: number;
}

interface CustomerFormProps {
  data: CustomerFormData;
  onChange: (data: Partial<CustomerFormData>) => void;
  errors: Record<string, string>;
}

const paymentModes = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "netbanking", label: "Net Banking" }
];

export const CustomerForm = ({ data, onChange, errors }: CustomerFormProps) => {
  const handleDiscountChange = (value: string) => {
    const discount = parseFloat(value);
    if (isNaN(discount) || discount < 0) {
      onChange({ discountPercent: 0 });
    } else if (discount > 100) {
      onChange({ discountPercent: 100 });
    } else {
      onChange({ discountPercent: discount });
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Buyer Name</Label>
          <Input
            id="customerName"
            value={data.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            placeholder="Enter buyer name"
            className={errors.customerName ? "border-red-500" : ""}
          />
          {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerMobile">Mobile Number</Label>
          <Input
            id="customerMobile"
            value={data.customerMobile}
            onChange={(e) => onChange({ customerMobile: e.target.value })}
            placeholder="Enter mobile number"
            className={errors.customerMobile ? "border-red-500" : ""}
          />
          {errors.customerMobile && <p className="text-sm text-red-500">{errors.customerMobile}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={data.customerEmail}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            placeholder="Enter customer email"
            className={errors.customerEmail ? "border-red-500" : ""}
          />
          {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail}</p>}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={data.status} 
              onValueChange={(value: "paid" | "pending") => onChange({ status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select 
              value={data.paymentMode} 
              onValueChange={(value: "cash" | "upi" | "card" | "netbanking") => onChange({ paymentMode: value as "cash" | "upi" | "card" | "netbanking" })}
            >
              <SelectTrigger id="paymentMode">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={data.discountPercent}
            onChange={(e) => handleDiscountChange(e.target.value)}
            placeholder="Enter discount percentage"
          />
        </div>
      </div>
    </>
  );
};

