import { Vehicle } from "@/types/vehicle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VehicleTableProps {
  data: Vehicle[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRetry?: () => void;
}

export default function VehicleTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onRetry,
}: VehicleTableProps) {
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
        Loading vehicles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load vehicles.</p>
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
        No vehicles found. Try adjusting your search.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("registrationNumber")}
          >
            <div className="flex items-center">
              Registration
              {renderSortIcon("registrationNumber")}
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("brand")}
          >
            <div className="flex items-center">
              Brand
              {renderSortIcon("brand")}
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("model")}
          >
            <div className="flex items-center">
              Model
              {renderSortIcon("model")}
            </div>
          </TableHead>
          <TableHead>Customer</TableHead>
          <TableHead
            className="cursor-pointer hover:bg-gray-50 text-right"
            onClick={() => onSort("createdAt")}
          >
            <div className="flex items-center justify-end">
              Added On
              {renderSortIcon("createdAt")}
            </div>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
            <TableCell>{vehicle.brand}</TableCell>
            <TableCell>{vehicle.model}</TableCell>
            <TableCell>
              {vehicle.customer ? (
                <div className="flex flex-col">
                  <span>{vehicle.customer.name}</span>
                  <span className="text-xs text-gray-500">
                    {vehicle.customer.phone}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 italic">Unknown</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(vehicle)}
                  title="Edit Vehicle"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(vehicle)}
                  title="Delete Vehicle"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
