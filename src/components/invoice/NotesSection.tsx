
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesSectionProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const NotesSection = ({ notes, onChange }: NotesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter any additional notes"
        rows={3}
      />
    </div>
  );
};

