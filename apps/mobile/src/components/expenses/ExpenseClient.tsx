"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useDebounce } from "@/hooks/useDebounce";
import ExpenseToolbar from "./ExpenseToolbar";
import ExpenseSearch from "./ExpenseSearch";
import ExpenseTable from "./ExpenseTable";
import ExpenseDialog from "./ExpenseDialog";
import PaginationControls from "../customers/PaginationControls";

export default function ExpenseClient() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useExpenses({
    q: debouncedSearch,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleAdd = () => {
    setIsExpenseDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ExpenseToolbar onAdd={handleAdd} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ExpenseSearch value={search} onChange={handleSearchChange} />
      </div>
      
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <ExpenseTable
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRetry={() => refetch()}
        />

        {!isLoading && !isError && data && data.totalPages > 0 && (
          <div className="border-t p-4">
            <PaginationControls
              page={page}
              totalPages={data.totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      <ExpenseDialog
        isOpen={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
      />
    </div>
  );
}
