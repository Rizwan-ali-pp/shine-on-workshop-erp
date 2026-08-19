import { Expense } from "@/types/expense";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExpenseTableProps {
  data: Expense[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onRetry?: () => void;
  onDeleteClick: (expense: Expense) => void;
}

export default function ExpenseTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onRetry,
  onDeleteClick,
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
    <>
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((expense) => (
          <div
            key={expense.id}
            className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                {expense.job ? (
                  <>
                    <span className="font-bold text-slate-900">{expense.job.jobNumber}</span>
                    <p className="text-sm text-slate-500 mt-1">{expense.job.customer?.name}</p>
                  </>
                ) : (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Shop Expense</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">
                  {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(expense.createdAt))}
                </span>
                <p className="text-sm font-bold text-red-600 mt-1">
                  ₹{expense.amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                {expense.category}
              </span>
              <div className="text-right flex-1 ml-4 truncate">
                <p className="text-sm font-medium text-slate-900 truncate">{expense.paidTo || "N/A"}</p>
                {expense.description && (
                  <p className="text-xs text-slate-500 truncate" title={expense.description}>
                    {expense.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDeleteClick(expense)}
                className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job & Customer</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-right"
                onClick={() => onSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {renderSortIcon("amount")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {renderSortIcon("category")}
                </div>
              </TableHead>
              <TableHead>Details</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-right"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center justify-end">
                  Date
                  {renderSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {expense.job ? (
                    <>
                      <div className="font-semibold text-slate-900">
                        {expense.job.jobNumber}
                      </div>
                      <div className="text-xs text-slate-500">
                        {expense.job.customer?.name}
                      </div>
                    </>
                  ) : (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Shop Expense</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  ₹{expense.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-slate-900">
                    {expense.paidTo || "N/A"}
                  </div>
                  {expense.description && (
                    <div className="text-xs text-slate-500 truncate max-w-[200px]" title={expense.description}>
                      {expense.description}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-slate-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(expense.createdAt))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteClick(expense)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
