import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateExpense } from "@/hooks/useExpenses";
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

const expenseSchema = z.object({
  jobId: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.string().min(2, "Category is required"),
  paidTo: z.string().optional(),
  description: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultJobId?: string;
}

export default function ExpenseDialog({ isOpen, onOpenChange, defaultJobId }: ExpenseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isShopExpense, setIsShopExpense] = useState(false);

  const { data: jobsData, isLoading: isJobsLoading } = useJobs({ limit: 100, sortBy: "receivedAt", sortOrder: "desc" });
  const { mutateAsync: createExpense } = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      jobId: defaultJobId || "",
      amount: 0,
      category: "",
      paidTo: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setIsShopExpense(false);
      reset({
        jobId: defaultJobId || "",
        amount: 0,
        category: "",
        paidTo: "",
        description: "",
      });
    }
  }, [isOpen, reset, defaultJobId]);

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!isShopExpense && (!data.jobId || data.jobId === "")) {
      setSubmitError("Please select a job for a job expense.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const submitData = {
        ...data,
        jobId: isShopExpense ? undefined : data.jobId,
      };
      await createExpense(submitData as any);
      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to log expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Expense</DialogTitle>
          <DialogDescription>
            Record an expense (parts, labor, external services) or a general shop expense.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {submitError}
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <input 
            type="checkbox" 
            id="isShopExpense" 
            checked={isShopExpense}
            onChange={(e) => setIsShopExpense(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isShopExpense" className="text-sm font-medium">This is a general Shop Expense (not tied to a Job)</label>
        </div>

        <form id="expense-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isShopExpense && (
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
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Amount (₹)</label>
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. 1500"
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <input
                {...register("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. Parts, Labor"
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Paid To (Optional)</label>
            <input
              {...register("paidTo")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Vendor name or person..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              {...register("description")}
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="What was this expense for?"
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
          <Button type="submit" form="expense-form" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
