import { useState } from "react";
import { useDeleteWorker } from "@/hooks/useWorkers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteWorkerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  worker: { id: string; name: string } | null;
}

export default function DeleteWorkerDialog({
  isOpen,
  onOpenChange,
  worker,
}: DeleteWorkerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutateAsync: deleteWorker } = useDeleteWorker();

  if (!worker) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteWorker(worker.id);
      onOpenChange(false);
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete worker."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Worker</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              {worker.name}
            </span>
            ? This action cannot be undone and will delete all associated labour logs.
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
