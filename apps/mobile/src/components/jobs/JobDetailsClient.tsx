"use client";

import { useState } from "react";
import { useJob } from "@/hooks/useJobs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, DollarSign, Receipt, TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentDialog from "../payments/PaymentDialog";
import ExpenseDialog from "../expenses/ExpenseDialog";
import DeleteExpenseDialog from "../expenses/DeleteExpenseDialog";
import DeleteJobDialog from "./DeleteJobDialog";
import { Expense } from "@/types/expense";

interface JobDetailsClientProps {
  jobId: string;
}

export default function JobDetailsClient({ jobId }: JobDetailsClientProps) {
  const { data: job, isLoading, isError } = useJob(jobId);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-gray-500">Loading Job Financials...</div>;
  }

  if (isError || !job) {
    return <div className="p-8 text-center text-red-500">Failed to load Job details.</div>;
  }

  // Calculate Financials
  const totalRevenue = job.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalExpenses = job.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
  const netProfit = totalRevenue - totalExpenses;
  const remainingBudget = job.estimatedTotal - totalExpenses; // Just an FYI metric

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <Link href="/jobs" className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 mt-1 md:mt-0">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex flex-wrap items-center gap-2 md:gap-3">
              <span className="break-all">{job.jobNumber}</span>
              <Badge variant="outline" className="text-xs md:text-sm font-medium border-primary/20 bg-primary/5">
                {job.status.replace(/_/g, " ")}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {job.customer?.name} • {job.vehicle?.registrationNumber} <br className="md:hidden" />
              <span className="text-xs md:text-sm">({job.vehicle?.brand} {job.vehicle?.model})</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 px-3 md:px-4"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsExpenseOpen(true)} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex-1 md:flex-none justify-center px-2 md:px-4 text-xs md:text-sm h-10">
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Log Expense
          </Button>
          <Button onClick={() => setIsPaymentOpen(true)} className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none justify-center px-2 md:px-4 text-xs md:text-sm h-10">
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Receive Payment</span><span className="sm:hidden">Payment</span>
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Payments Received</p>
            <h3 className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">From Customer</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses Logged</p>
            <h3 className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-xs text-gray-400 mt-1">Parts, Labor, External</p>
          </div>
        </div>

        <div className={`bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 ${netProfit >= 0 ? "border-b-4 border-b-green-500" : "border-b-4 border-b-red-500"}`}>
          <div className={`p-3 rounded-lg ${netProfit >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {netProfit >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Profit</p>
            <h3 className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-700" : "text-red-600"}`}>
              {netProfit < 0 ? "-" : ""}₹{Math.abs(netProfit).toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Current Job Profitability</p>
          </div>
        </div>
      </div>

      {/* Detailed Ledgers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Payments Ledger */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Payments Received</h3>
            <Badge variant="outline" className="bg-white">{job.payments?.length || 0} Records</Badge>
          </div>
          <div className="p-0 overflow-auto max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {!job.payments || job.payments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">No payments recorded yet.</td>
                  </tr>
                ) : (
                  job.payments.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(p.createdAt))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{p.type}</span>
                        <span className="text-xs text-gray-400 ml-2">({p.method})</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-700">₹{p.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Ledger */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Expenses Logged</h3>
            <Badge variant="outline" className="bg-white">{job.expenses?.length || 0} Records</Badge>
          </div>
          <div className="p-0 overflow-auto max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category / Paid To</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {!job.expenses || job.expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">No expenses logged yet.</td>
                  </tr>
                ) : (
                  job.expenses.map((e: any) => (
                    <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(e.createdAt))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{e.category}</div>
                        <div className="text-xs text-gray-500">{e.paidTo || e.description || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">₹{e.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setExpenseToDelete(e);
                            setIsDeleteExpenseOpen(true);
                          }}
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

      <PaymentDialog isOpen={isPaymentOpen} onOpenChange={setIsPaymentOpen} defaultJobId={jobId} />
      <ExpenseDialog isOpen={isExpenseOpen} onOpenChange={setIsExpenseOpen} defaultJobId={jobId} />
      <DeleteExpenseDialog isOpen={isDeleteExpenseOpen} onOpenChange={setIsDeleteExpenseOpen} expense={expenseToDelete} />
      <DeleteJobDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        jobId={jobId} 
        jobNumber={job?.jobNumber || ""} 
        onSuccess={() => router.push("/jobs")} 
      />
    </div>
  );
}
