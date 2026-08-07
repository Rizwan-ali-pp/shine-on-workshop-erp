"use client";

import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/ui/StatCard";
import { getDashboardStats } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

import {
  BriefcaseBusiness,
  Users,
  Car,
  IndianRupee,
} from "lucide-react";

export default function HomePage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !stats) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-red-500">Failed to load dashboard data.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 mb-8 text-slate-500">
        Welcome to ShineTrack ERP
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
        />

        <StatCard
          title="Total Expenses"
          value={`₹${stats.totalExpenses.toLocaleString()}`}
          icon={IndianRupee}
        />

        <StatCard
          title="Net Profit"
          value={`₹${stats.netProfit.toLocaleString()}`}
          icon={IndianRupee}
        />
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Recent Financial Activity</h2>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {stats.recentActivity.map((activity: any) => (
                <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'PAYMENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-500">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(activity.date))}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    activity.type === 'PAYMENT' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.type === 'PAYMENT' ? '+' : '-'}₹{activity.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic">No recent activity found.</p>
        )}
      </div>
    </AppLayout>
  );
}