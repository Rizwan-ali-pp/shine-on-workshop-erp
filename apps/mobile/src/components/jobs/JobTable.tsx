import { Job } from "@/types/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import DeleteJobDialog from "./DeleteJobDialog";

interface JobTableProps {
  data: Job[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "RECEIVED":
    case "INSPECTING":
      return "bg-orange-100 text-orange-800";
    case "ESTIMATE_PREPARED":
    case "WAITING_APPROVAL":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800";
    case "READY":
      return "bg-green-100 text-green-800";
    case "DELIVERED":
      return "bg-gray-100 text-gray-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function JobTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
}: JobTableProps) {
  const [jobToDelete, setJobToDelete] = useState<{ id: string; jobNumber: string } | null>(null);

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading jobs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load jobs.</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No jobs found. Try adjusting your search.
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((job) => (
          <div
            key={job.id}
            className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow relative"
          >
            <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-0" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="pointer-events-none">
                <span className="font-bold text-orange-600">{job.jobNumber}</span>
                <p className="font-medium text-slate-900 mt-1">{job.customer?.name}</p>
                <p className="text-xs text-slate-500">{job.customer?.phone}</p>
              </div>
              <div className="text-right pointer-events-none">
                <span className="text-xs text-slate-500 font-medium">
                  {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(job.receivedAt))}
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  ₹{job.estimatedTotal.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 relative z-10">
              <div className="pointer-events-none">
                <p className="text-sm text-slate-700">{job.vehicle?.registrationNumber}</p>
                <p className="text-xs text-slate-500">{job.vehicle?.brand} {job.vehicle?.model}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right pointer-events-none">
                  <p className="text-xs text-slate-500">Paid</p>
                  <p className="text-sm font-bold text-green-600">₹{(job.totalPaid || 0).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJobToDelete({ id: job.id, jobNumber: job.jobNumber });
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onSort("jobNumber")}
              >
                <div className="flex items-center">
                  Job #
                  {renderSortIcon("jobNumber")}
                </div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-right"
                onClick={() => onSort("estimatedTotal")}
              >
                <div className="flex items-center justify-end">
                  Est. Total
                  {renderSortIcon("estimatedTotal")}
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end text-green-700">
                  Total Received
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-right"
                onClick={() => onSort("receivedAt")}
              >
                <div className="flex items-center justify-end">
                  Date
                  {renderSortIcon("receivedAt")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-semibold text-orange-600">
                  {job.jobNumber}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{job.customer?.name}</div>
                  <div className="text-xs text-slate-500">
                    {job.customer?.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-700">{job.vehicle?.registrationNumber}</div>
                  <div className="text-xs text-slate-500">
                    {job.vehicle?.brand} {job.vehicle?.model}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{job.estimatedTotal.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-semibold text-green-700">
                  ₹{(job.totalPaid || 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-slate-500">
                  {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(job.receivedAt))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setJobToDelete({ id: job.id, jobNumber: job.jobNumber })}
                      title="Delete Job"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/jobs/${job.id}`}
                      title="View Details"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteJobDialog
        isOpen={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
        jobId={jobToDelete?.id || ""}
        jobNumber={jobToDelete?.jobNumber || ""}
      />
    </>
  );
}
