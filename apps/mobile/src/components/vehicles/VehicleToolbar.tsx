import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";

interface VehicleToolbarProps {
  onAdd: () => void;
}

export default function VehicleToolbar({ onAdd }: VehicleToolbarProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <PlusIcon className="h-4 w-4" />
        Add Vehicle
      </Button>
    </>
  );
}
