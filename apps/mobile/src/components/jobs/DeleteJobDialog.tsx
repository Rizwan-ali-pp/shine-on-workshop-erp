import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { useDeleteJob } from "@/hooks/useJobs";
import { AlertTriangle } from "lucide-react";

interface DeleteJobDialogProps {
  jobId: string;
  jobNumber: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeleteJobDialog({
  jobId,
  jobNumber,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteJobDialogProps) {
  const { mutateAsync: deleteJob } = useDeleteJob();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteJob(jobId);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete job.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Job {jobNumber}
          </DialogTitle>
          <DialogDescription className="pt-3 text-slate-600">
            Are you sure you want to permanently delete this job?
            <br />
            <br />
            <strong className="text-slate-900">This action cannot be undone.</strong> All associated payments, services, and expenses will also be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mt-2">
            {error}
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
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
