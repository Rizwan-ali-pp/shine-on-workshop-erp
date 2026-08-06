import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vehicle } from "@/types/vehicle";
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/useVehicles";
import { useCustomers } from "@/hooks/useCustomers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

const vehicleSchema = z.object({
  customerId: z.string().uuid("Please select a customer"),
  registrationNumber: z.string().min(4, "Must be at least 4 characters").max(20, "Must be at most 20 characters").trim(),
  brand: z.string().min(2, "Must be at least 2 characters").max(50, "Must be at most 50 characters").trim(),
  model: z.string().min(1, "Must be at least 1 character").max(50, "Must be at most 50 characters").trim(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle; // If provided, we are in Edit Mode
}

export default function VehicleDialog({
  isOpen,
  onOpenChange,
  vehicle,
}: VehicleDialogProps) {
  const isEditMode = !!vehicle;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: customersData } = useCustomers({ limit: 1000 });
  const customers = customersData?.data || [];

  const { mutateAsync: createVehicle } = useCreateVehicle();
  const { mutateAsync: updateVehicle } = useUpdateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      customerId: "",
      registrationNumber: "",
      brand: "",
      model: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      if (vehicle) {
        reset({
          customerId: vehicle.customerId,
          registrationNumber: vehicle.registrationNumber,
          brand: vehicle.brand,
          model: vehicle.model,
        });
      } else {
        reset({
          customerId: "",
          registrationNumber: "",
          brand: "",
          model: "",
        });
      }
    }
  }, [isOpen, vehicle, reset]);

  const onSubmit = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isEditMode && vehicle) {
        await updateVehicle({ id: vehicle.id, data });
      } else {
        await createVehicle(data);
      }
      onOpenChange(false);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to the vehicle details below."
              : "Enter the vehicle details to track its service history."}
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {submitError}
          </div>
        )}

        <form id="vehicle-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerId" className="text-sm font-medium text-foreground">
              Customer
            </label>
            <select
              id="customerId"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("customerId")}
            >
              <option value="" disabled>Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-sm text-red-500">{errors.customerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="registrationNumber" className="text-sm font-medium text-foreground">
              Registration Number
            </label>
            <input
              id="registrationNumber"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. MH12AB1234"
              {...register("registrationNumber")}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-medium text-foreground">
              Brand
            </label>
            <input
              id="brand"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. Honda"
              {...register("brand")}
            />
            {errors.brand && (
              <p className="text-sm text-red-500">{errors.brand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-foreground">
              Model
            </label>
            <input
              id="model"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="e.g. City"
              {...register("model")}
            />
            {errors.model && (
              <p className="text-sm text-red-500">{errors.model.message}</p>
            )}
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
          <Button
            type="submit"
            form="vehicle-form"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Save Changes"
              : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
