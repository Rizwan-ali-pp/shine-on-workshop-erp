"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { useCreateLaborLog } from "@/hooks/useWorkers";

const laborLogSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  notes: z.string().optional(),
});

type LaborLogFormValues = z.infer<typeof laborLogSchema>;

interface LabourLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string | null;
  workerName: string;
}

export default function LabourLogDialog({ isOpen, onClose, workerId, workerName }: LabourLogDialogProps) {
  const createLog = useCreateLaborLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LaborLogFormValues>({
    resolver: zodResolver(laborLogSchema),
    defaultValues: {
      amount: undefined,
      notes: "",
    },
  });

  const onSubmit = async (data: LaborLogFormValues) => {
    if (!workerId) return;
    try {
      await createLog.mutateAsync({
        workerId,
        amount: data.amount,
        notes: data.notes,
      });
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Labour Charge</DialogTitle>
        </DialogHeader>

        <div className="bg-slate-50 p-3 rounded-md text-sm mb-4">
          Recording charge for: <span className="font-semibold">{workerName}</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount (₹) *</label>
            <input
              type="number"
              placeholder="e.g. 500"
              {...register("amount")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Daily Wage / Job specific"
              {...register("notes")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLog.isPending}>
              {createLog.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Charge
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
