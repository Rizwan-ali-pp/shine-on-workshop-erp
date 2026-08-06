import AppLayout from "@/components/layout/AppLayout";
import {
  BriefcaseBusiness,
  Users,
  Car,
  IndianRupee,
} from "lucide-react";

import  StatCard  from "@/components/ui/StatCard";

export default function HomePage() {
  return (
    <AppLayout>
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 mb-8 text-slate-500">
        Welcome to ShineTrack ERP
      </p>

      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs"
          value="18"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Customers"
          value="25"
          icon={Users}
        />

        <StatCard
          title="Vehicles"
          value="31"
          icon={Car}
        />

        <StatCard
          title="Revenue"
          value="₹1.25L"
          icon={IndianRupee}
        />
      </div>
    </AppLayout>
  );
}