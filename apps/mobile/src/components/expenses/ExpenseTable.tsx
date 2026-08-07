import { Expense } from "@/types/expense";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExpenseTableProps {
  data: Expense[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry?: () => void;
}

export default function ExpenseTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
}: ExpenseTableProps) {
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
        Loading expenses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load expenses.</p>
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
        No expenses found. Try adjusting your search.
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
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("category")}
          >
            <div className="flex items-center">
              Category
              {renderSortIcon("category")}
            </div>
          </TableHead>
          <TableHead>Details</TableHead>
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
        {data.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {expense.job ? (
                <>
                  <div className="font-semibold text-primary">
                    {expense.job.jobNumber}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {expense.job.customer?.name}
                  </div>
                </>
              ) : (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Shop Expense</span>
              )}
            </TableCell>
            <TableCell className="text-right font-medium text-red-600">
              ₹{expense.amount.toLocaleString()}
            </TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">
                {expense.category}
              </span>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium">
                {expense.paidTo || "N/A"}
              </div>
              {expense.description && (
                <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={expense.description}>
                  {expense.description}
                </div>
              )}
            </TableCell>
            <TableCell className="text-right">
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(expense.createdAt))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
