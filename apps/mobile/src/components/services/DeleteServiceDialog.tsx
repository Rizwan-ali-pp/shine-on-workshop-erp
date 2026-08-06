import { useState } from "react";
import { Service } from "@/types/service";
import { useDeleteService } from "@/hooks/useServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export default function DeleteServiceDialog({
  isOpen,
  onOpenChange,
  service,
}: DeleteServiceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutateAsync: deleteService } = useDeleteService();

  if (!service) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteService(service.id);
      onOpenChange(false);
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message ||
          "Failed to deactivate service."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deactivate Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate the service{" "}
            <span className="font-semibold text-foreground">
              {service.name}
            </span>
            ? It will no longer be available for new jobs, but historical data will remain intact.
          </DialogDescription>
        </DialogHeader>

        {deleteError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mt-4">
            {deleteError}
          </div>
        )}

        <DialogFooter className="mt-6">
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
            {isDeleting ? "Deactivating..." : "Deactivate Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
