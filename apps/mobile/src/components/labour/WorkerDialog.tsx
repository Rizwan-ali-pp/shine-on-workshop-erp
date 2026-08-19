"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { useCreateWorker } from "@/hooks/useWorkers";

const workerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

interface WorkerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkerDialog({ isOpen, onClose }: WorkerDialogProps) {
  const createWorker = useCreateWorker();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const onSubmit = async (data: WorkerFormValues) => {
    try {
      await createWorker.mutateAsync(data);
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
          <DialogTitle>Add New Worker</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Worker Name *</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              {...register("phone")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createWorker.isPending}>
              {createWorker.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Worker
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
