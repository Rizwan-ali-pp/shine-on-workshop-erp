import { useState, useEffect } from "react";
import { Job, JobStatus } from "@/types/job";
import { useUpdateJobStatus } from "@/hooks/useJobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface UpdateJobStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

const STATUS_OPTIONS: JobStatus[] = [
  "RECEIVED",
  "INSPECTING",
  "ESTIMATE_PREPARED",
  "WAITING_APPROVAL",
  "APPROVED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

export default function UpdateJobStatusDialog({
  isOpen,
  onOpenChange,
  job,
}: UpdateJobStatusDialogProps) {
  const [status, setStatus] = useState<JobStatus | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: updateStatus } = useUpdateJobStatus();

  useEffect(() => {
    if (isOpen && job) {
      setStatus(job.status);
      setError(null);
    }
  }, [isOpen, job]);

  if (!job) return null;

  const handleUpdate = async () => {
    if (!status) return;
    setIsUpdating(true);
    setError(null);
    try {
      await updateStatus({ id: job.id, status });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Job Status</DialogTitle>
          <DialogDescription>
            Change the current status for Job{" "}
            <span className="font-semibold text-foreground">
              {job.jobNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mt-4">
            {error}
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || status === job.status}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
