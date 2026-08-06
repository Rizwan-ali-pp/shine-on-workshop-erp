"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerParams } from "@/types/customer";
import { useDebounce } from "@/hooks/useDebounce";
import CustomerToolbar from "./CustomerToolbar";
import CustomerSearch from "./CustomerSearch";
import CustomerTable from "./CustomerTable";
import PaginationControls from "./PaginationControls";

export default function CustomerClient() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const params: CustomerParams = {
    q: debouncedSearch,
    page,
    limit,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, refetch } = useCustomers(params);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomerToolbar />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomerSearch value={search} onChange={handleSearchChange} />
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <CustomerTable 
          data={data?.data || []} 
          isLoading={isLoading} 
          isError={isError} 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRetry={() => refetch()}
        />
        
        {data && data.totalPages > 0 && (
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
    </div>
  );
}
