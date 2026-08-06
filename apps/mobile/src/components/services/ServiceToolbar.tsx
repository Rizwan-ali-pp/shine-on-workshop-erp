import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface ServiceToolbarProps {
  onAdd: () => void;
}

export default function ServiceToolbar({ onAdd }: ServiceToolbarProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Services</h1>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Service
      </Button>
    </>
  );
}
