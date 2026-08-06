import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/ui/StatCard";
import { getDashboardStats } from "@/services/dashboard";

import {
  BriefcaseBusiness,
  Users,
  Car,
  IndianRupee,
} from "lucide-react";

export default async function HomePage() {
  const stats = await getDashboardStats();

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
          value={stats.totalJobs}
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Users}
        />

        <StatCard
          title="Vehicles"
          value={stats.totalVehicles}
          icon={Car}
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.revenue}`}
          icon={IndianRupee}
        />
      </div>
    </AppLayout>
  );
}