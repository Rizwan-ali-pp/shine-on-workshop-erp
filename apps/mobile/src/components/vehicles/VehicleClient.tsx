"use client";

import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import VehicleToolbar from "./VehicleToolbar";
import VehicleSearch from "./VehicleSearch";
import VehicleTable from "./VehicleTable";
import VehicleDialog from "./VehicleDialog";
import DeleteVehicleDialog from "./DeleteVehicleDialog";
import PaginationControls from "../customers/PaginationControls"; // Reusing the pagination controls

export default function VehicleClient() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { data, isLoading, isError, refetch } = useVehicles({
    q,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const handleSearch = (searchTerm: string) => {
    setQ(searchTerm);
    setPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setIsVehicleDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <VehicleToolbar onAdd={handleAdd} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <VehicleSearch onSearch={handleSearch} />
      </div>
      
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <VehicleTable
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

      <VehicleDialog
        isOpen={isVehicleDialogOpen}
        onOpenChange={setIsVehicleDialogOpen}
        vehicle={selectedVehicle || undefined}
      />

      <DeleteVehicleDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
