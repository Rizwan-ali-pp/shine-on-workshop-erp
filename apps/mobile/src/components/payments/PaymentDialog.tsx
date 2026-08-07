import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePayment } from "@/hooks/usePayments";
import { useJobs } from "@/hooks/useJobs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

const paymentSchema = z.object({
  jobId: z.string().uuid("Please select a job"),
  amount: z.number().positive("Amount must be greater than zero"),
  method: z.enum(["CASH", "UPI", "CARD"]),
  type: z.enum(["ADVANCE", "PARTIAL", "FINAL"]),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultJobId?: string;
}

export default function PaymentDialog({ isOpen, onOpenChange, defaultJobId }: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: jobsData, isLoading: isJobsLoading } = useJobs({ limit: 100, sortBy: "receivedAt", sortOrder: "desc" });
  const { mutateAsync: createPayment } = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      jobId: defaultJobId || "",
      amount: 0,
      method: "CASH",
      type: "PARTIAL",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      reset({
        jobId: defaultJobId || "",
        amount: 0,
        method: "CASH",
        type: "PARTIAL",
        notes: "",
      });
    }
  }, [isOpen, reset, defaultJobId]);

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createPayment(data);
      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Log a new payment transaction against a specific job.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {submitError}
          </div>
        )}

        <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Job</label>
            <select
              {...register("jobId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                {isJobsLoading ? "Loading Jobs..." : "Select Job Number"}
              </option>
              {jobsData?.data.map((job: any) => (
                <option key={job.id} value={job.id}>
                  {job.jobNumber} - {job.customer?.name}
                </option>
              ))}
            </select>
            {errors.jobId && <p className="text-sm text-red-500">{errors.jobId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount (₹)</label>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. 5000"
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Method</label>
              <select
                {...register("method")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Type</label>
              <select
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ADVANCE">Advance</option>
                <option value="PARTIAL">Partial</option>
                <option value="FINAL">Final</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
            <textarea
              {...register("notes")}
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Transaction ID or extra info..."
            />
          </div>
        </form>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="payment-form" disabled={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
