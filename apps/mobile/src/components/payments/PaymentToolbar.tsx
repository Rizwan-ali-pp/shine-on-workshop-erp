import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface PaymentToolbarProps {
  onAdd: () => void;
}

export default function PaymentToolbar({ onAdd }: PaymentToolbarProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Record Payment
      </Button>
    </>
  );
}
