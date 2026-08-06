import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useDeleteVehicle } from "@/hooks/useVehicles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteVehicleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export default function DeleteVehicleDialog({
  isOpen,
  onOpenChange,
  vehicle,
}: DeleteVehicleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { mutateAsync: deleteVehicle } = useDeleteVehicle();

  if (!vehicle) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteVehicle(vehicle.id);
      onOpenChange(false);
    } catch (error: any) {
      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete vehicle. It may be associated with existing jobs."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Vehicle</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the vehicle{" "}
            <span className="font-semibold text-foreground">
              {vehicle.registrationNumber}
            </span>
            ? This action cannot be undone.
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
            {isDeleting ? "Deleting..." : "Delete Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
