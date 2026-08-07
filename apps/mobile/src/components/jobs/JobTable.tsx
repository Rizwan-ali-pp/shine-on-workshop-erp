import { Job } from "@/types/job";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface JobTableProps {
  data: Job[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onUpdateStatus: (job: Job) => void;
  onRetry?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "RECEIVED":
    case "INSPECTING":
      return "bg-blue-100 text-blue-800";
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
  onUpdateStatus,
  onRetry,
}: JobTableProps) {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("jobNumber")}
          >
            <div className="flex items-center">
              Job #
              {renderSortIcon("jobNumber")}
            </div>
          </TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Status</TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50 text-right"
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
            className="cursor-pointer hover:bg-gray-50 text-right"
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
            <TableCell className="font-semibold text-primary">
              {job.jobNumber}
            </TableCell>
            <TableCell>
              <div>{job.customer?.name}</div>
              <div className="text-xs text-muted-foreground">
                {job.customer?.phone}
              </div>
            </TableCell>
            <TableCell>
              <div>{job.vehicle?.registrationNumber}</div>
              <div className="text-xs text-muted-foreground">
                {job.vehicle?.brand} {job.vehicle?.model}
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  job.status
                )}`}
              >
                {job.status.replace(/_/g, " ")}
              </span>
            </TableCell>
            <TableCell className="text-right font-medium">
              ₹{job.estimatedTotal.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-semibold text-green-700">
              ₹{(job.totalPaid || 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right text-gray-500">
              {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(job.receivedAt))}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatus(job)}
                  title="Update Status"
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Link
                  href={`/jobs/${job.id}`}
                  title="View Details"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
