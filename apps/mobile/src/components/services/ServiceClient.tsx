"use client";

import { useState } from "react";
import { Service } from "@/types/service";
import { useServices } from "@/hooks/useServices";
import { useDebounce } from "@/hooks/useDebounce";
import ServiceToolbar from "./ServiceToolbar";
import ServiceSearch from "./ServiceSearch";
import ServiceTable from "./ServiceTable";
import ServiceDialog from "./ServiceDialog";
import DeleteServiceDialog from "./DeleteServiceDialog";
import PaginationControls from "../customers/PaginationControls"; // Reusing the pagination controls

export default function ServiceClient() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data, isLoading, isError, refetch } = useServices({
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
    setSelectedService(null);
    setIsServiceDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsServiceDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ServiceToolbar onAdd={handleAdd} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ServiceSearch value={search} onChange={handleSearchChange} />
      </div>
      
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <ServiceTable
          data={data?.data || []}
          isLoading={isLoading}
          isError={isError}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

      <ServiceDialog
        isOpen={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        service={selectedService || undefined}
      />

      <DeleteServiceDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        service={selectedService}
      />
    </div>
  );
}
