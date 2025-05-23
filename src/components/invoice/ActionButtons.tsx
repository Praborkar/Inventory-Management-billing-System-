
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ActionButtonsProps {
  onSubmit: () => void;
}

export const ActionButtons = ({ onSubmit }: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2">
      <Button type="button" className="flex-1" onClick={onSubmit}>
        Create Invoice
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/invoices')}
      >
        Cancel
      </Button>
    </div>
  );
};

