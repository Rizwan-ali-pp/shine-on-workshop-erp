import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateJob } from "@/hooks/useJobs";
import { useServices } from "@/hooks/useServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

const jobSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  vehicleRegistration: z.string().min(1, "Vehicle registration is required"),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  advanceAmount: z.number().min(0),
  notes: z.string().optional(),
  services: z
    .array(
      z.object({
        serviceId: z.string().uuid("Please select a service"),
        quotedPrice: z.number().positive("Price must be > 0"),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one service is required"),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JobDialog({ isOpen, onOpenChange }: JobDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: servicesData } = useServices({ limit: 100, sortBy: "name", sortOrder: "asc" });

  const { mutateAsync: createJob } = useCreateJob();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      vehicleRegistration: "",
      vehicleBrand: "",
      vehicleModel: "",
      advanceAmount: 0,
      notes: "",
      services: [{ serviceId: "", quotedPrice: 0, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const servicesValues = useWatch({
    control,
    name: "services",
  });

  // Calculate estimated total based on dynamic services
  const estimatedTotal = useMemo(() => {
    return (servicesValues || []).reduce((sum, s) => sum + (Number(s?.quotedPrice) || 0), 0);
  }, [servicesValues]);

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      reset({
        customerName: "",
        customerPhone: "",
        vehicleRegistration: "",
        vehicleBrand: "",
        vehicleModel: "",
        advanceAmount: 0,
        notes: "",
        services: [{ serviceId: "", quotedPrice: 0, notes: "" }],
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createJob({
        ...data,
        estimatedTotal,
      });
      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to create job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Select a customer, their vehicle, and assign services to create a job.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {submitError}
          </div>
        )}

        <form id="job-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
          {/* Top Section: Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Customer Name *</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                {...register("customerName")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.customerName && (
                <p className="text-sm text-red-500">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                {...register("customerPhone")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>

          {/* Top Section: Vehicle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reg Number *</label>
              <input
                type="text"
                placeholder="e.g. KL-51-AB-1234"
                {...register("vehicleRegistration")}
                className="flex h-10 w-full uppercase rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.vehicleRegistration && (
                <p className="text-sm text-red-500">{errors.vehicleRegistration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Brand (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Honda"
                {...register("vehicleBrand")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Model (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Civic"
                {...register("vehicleModel")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Dynamic Services Section */}
          <div className="space-y-4 border border-input rounded-md p-4 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Services</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => append({ serviceId: "", quotedPrice: 0, notes: "" })}
              >
                <Plus className="h-3 w-3" />
                Add Service
              </Button>
            </div>

            {errors.services?.root && (
              <p className="text-sm text-red-500">{errors.services.root.message}</p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <select
                      {...register(`services.${index}.serviceId`)}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Service</option>
                      {servicesData?.data.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.services?.[index]?.serviceId && (
                      <p className="text-xs text-red-500">
                        {errors.services[index]?.serviceId?.message}
                      </p>
                    )}
                  </div>

                  <div className="w-28 space-y-1">
                    <input
                      type="number"
                      placeholder="Price"
                      {...register(`services.${index}.quotedPrice`, { valueAsNumber: true })}
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {errors.services?.[index]?.quotedPrice && (
                      <p className="text-xs text-red-500">
                        {errors.services[index]?.quotedPrice?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t text-sm font-semibold">
              Estimated Total: ₹{estimatedTotal.toLocaleString()}
            </div>
          </div>

          {/* Bottom Section: Advance & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Advance Payment (₹)
              </label>
              <input
                type="number"
                {...register("advanceAmount", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                {...register("notes")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Initial inspection notes..."
              />
            </div>
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
          <Button type="submit" form="job-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating Job..." : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
