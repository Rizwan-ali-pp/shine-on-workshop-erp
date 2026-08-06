"use client";

import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

interface CustomerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerSearch({ value, onChange }: CustomerSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or phone..."
        className="pl-9 w-full"
      />
    </div>
  );
}
