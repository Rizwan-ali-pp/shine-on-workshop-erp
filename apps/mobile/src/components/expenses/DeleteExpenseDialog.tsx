import { useState } from "react";
import { Expense } from "@/types/expense";
import { useDeleteExpense } from "@/hooks/useExpenses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
}

export default function DeleteExpenseDialog({
  isOpen,
  onOpenChange,
  expense,
}: DeleteExpenseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutateAsync: deleteExpense } = useDeleteExpense();

  if (!expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteExpense(expense.id);
      onOpenChange(false);
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete accessory/expense."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Accessory</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this accessory/expense record for{" "}
            <span className="font-semibold text-foreground">
              ₹{expense.amount.toLocaleString()}
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
