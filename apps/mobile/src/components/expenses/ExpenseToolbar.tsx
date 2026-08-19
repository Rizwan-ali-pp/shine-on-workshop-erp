import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface ExpenseToolbarProps {
  onAdd: () => void;
}

export default function ExpenseToolbar({ onAdd }: ExpenseToolbarProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Accessories</h1>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Log Accessory
      </Button>
    </>
  );
}
