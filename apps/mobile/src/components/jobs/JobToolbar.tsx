import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface JobToolbarProps {
  onAdd: () => void;
}

export default function JobToolbar({ onAdd }: JobToolbarProps) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Job
      </Button>
    </>
  );
}
