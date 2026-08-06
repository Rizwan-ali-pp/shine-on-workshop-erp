import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";

interface VehicleSearchProps {
  onSearch: (searchTerm: string) => void;
}

export default function VehicleSearch({ onSearch }: VehicleSearchProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by registration, brand, or model..."
        className="pl-9 w-full"
      />
    </div>
  );
}
