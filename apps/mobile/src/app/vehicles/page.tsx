import AppLayout from "@/components/layout/AppLayout";
import VehicleClient from "@/components/vehicles/VehicleClient";

export default function VehiclesPage() {
  return (
    <AppLayout>
      <div className="p-8 h-[calc(100vh-64px)] overflow-hidden">
        <VehicleClient />
      </div>
    </AppLayout>
  );
}
