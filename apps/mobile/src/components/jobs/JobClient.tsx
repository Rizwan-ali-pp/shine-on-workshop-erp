"use client";

import { useState } from "react";
import { Job } from "@/types/job";
import { useJobs } from "@/hooks/useJobs";
import { useDebounce } from "@/hooks/useDebounce";
import JobToolbar from "./JobToolbar";
import JobSearch from "./JobSearch";
import JobTable from "./JobTable";
import JobDialog from "./JobDialog";
import PaginationControls from "@/components/ui/PaginationControls";

export default function JobClient() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("receivedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data, isLoading, isError, refetch } = useJobs({
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
    setIsJobDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <JobToolbar onAdd={handleAdd} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <JobSearch value={search} onChange={handleSearchChange} />
      </div>
      
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <JobTable
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

      <JobDialog
        isOpen={isJobDialogOpen}
        onOpenChange={setIsJobDialogOpen}
      />
    </div>
  );
}
