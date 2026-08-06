import { Service } from "@/types/service";
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
import { Badge } from "@/components/ui/Badge";

interface ServiceTableProps {
  data: Service[];
  isLoading: boolean;
  isError: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onRetry?: () => void;
}

export default function ServiceTable({
  data,
  isLoading,
  isError,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onRetry,
}: ServiceTableProps) {
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
        Loading services...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load services.</p>
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
        No services found. Try adjusting your search.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onSort("name")}
          >
            <div className="flex items-center">
              Name
              {renderSortIcon("name")}
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
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell>{service.category}</TableCell>
            <TableCell>
              <div className="max-w-xs truncate" title={service.description}>
                {service.description || (
                  <span className="text-gray-400 italic">No description</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(service)}
                  title="Edit Service"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {service.isActive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(service)}
                    title="Deactivate Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
