"use client";

import { useWorker, useDeleteLaborLog } from "@/hooks/useWorkers";
import { ArrowLeft, Trash2, IndianRupee, HardHat } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface WorkerDetailsClientProps {
  workerId: string;
}

export default function WorkerDetailsClient({ workerId }: WorkerDetailsClientProps) {
  const { data: worker, isLoading, isError } = useWorker(workerId);
  const deleteLog = useDeleteLaborLog();

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-gray-500">Loading Worker Details...</div>;
  }

  if (isError || !worker) {
    return <div className="p-8 text-center text-red-500">Failed to load Worker.</div>;
  }

  const totalPaid = worker.laborLogs?.reduce((sum: number, log: any) => sum + log.amount, 0) || 0;

  const handleDeleteLog = async (id: string) => {
    if (confirm("Are you sure you want to delete this labour charge?")) {
      try {
        await deleteLog.mutateAsync({ id, workerId });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <Link href="/labour" className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 mt-1 md:mt-0">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex flex-wrap items-center gap-2 md:gap-3">
              <span className="break-all">{worker.name}</span>
              <Badge variant={worker.isActive ? "default" : "secondary"} className="text-xs md:text-sm font-medium">
                {worker.isActive ? "Active" : "Inactive"}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {worker.phone || "No phone number recorded"}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Charges Logged</p>
            <h3 className="text-2xl font-bold text-slate-800">{worker.laborLogs?.length || 0}</h3>
            <p className="text-xs text-gray-400 mt-1">Lifetime</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 border-b-4 border-b-primary/50">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Wages Paid</p>
            <h3 className="text-2xl font-bold text-primary">₹{totalPaid.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">Lifetime Earnings</p>
          </div>
        </div>
      </div>

      {/* Detailed Ledgers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Labour Ledger</h3>
        </div>
        <div className="p-0 overflow-auto max-h-[500px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Notes / Job</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!worker.laborLogs || worker.laborLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">No labour charges recorded yet.</td>
                </tr>
              ) : (
                worker.laborLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(log.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{log.notes || "—"}</span>
                      {log.job && <span className="text-xs text-primary ml-2 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">Job: {log.job.jobNumber}</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">₹{log.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
