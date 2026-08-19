import { useState } from "react";
import { useDeleteLaborLog } from "@/hooks/useWorkers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteLaborLogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  laborLog: { id: string; amount: number } | null;
}

export default function DeleteLaborLogDialog({
  isOpen,
  onOpenChange,
  laborLog,
}: DeleteLaborLogDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutateAsync: deleteLaborLog } = useDeleteLaborLog();

  if (!laborLog) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteLaborLog(laborLog.id);
      onOpenChange(false);
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete labour charge."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Labour Charge</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this labour charge for{" "}
            <span className="font-semibold text-foreground">
              ₹{laborLog.amount.toLocaleString()}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {deleteError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {deleteError}
          </div>
        )}

        <DialogFooter className="mt-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
