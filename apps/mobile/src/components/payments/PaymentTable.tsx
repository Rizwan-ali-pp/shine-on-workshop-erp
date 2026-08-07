import { Payment } from "@/types/payment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PaymentTableProps {
  data: Payment[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry?: () => void;
}

const getMethodBadgeVariant = (method: string) => {
  switch (method) {
    case "CASH":
      return "default";
    case "UPI":
      return "secondary";
    case "CARD":
      return "outline";
    default:
      return "default";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "ADVANCE":
      return "text-orange-600 bg-orange-50";
    case "PARTIAL":
      return "text-yellow-600 bg-yellow-50";
    case "FINAL":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function PaymentTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
}: PaymentTableProps) {
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
        Loading payments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load payments.</p>
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
        No payments found. Try adjusting your search.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job & Customer</TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50 text-right"
            onClick={() => onSort("amount")}
          >
            <div className="flex items-center justify-end">
              Amount
              {renderSortIcon("amount")}
            </div>
          </TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Type</TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50 text-right"
            onClick={() => onSort("createdAt")}
          >
            <div className="flex items-center justify-end">
              Date
              {renderSortIcon("createdAt")}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <div className="font-semibold text-primary">
                {payment.job?.jobNumber}
              </div>
              <div className="text-xs text-muted-foreground">
                {payment.job?.customer?.name}
              </div>
            </TableCell>
            <TableCell className="text-right font-medium text-green-700">
              ₹{payment.amount.toLocaleString()}
            </TableCell>
            <TableCell>
              <Badge variant={getMethodBadgeVariant(payment.method) as any}>
                {payment.method}
              </Badge>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  payment.type
                )}`}
              >
                {payment.type}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(payment.createdAt))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
