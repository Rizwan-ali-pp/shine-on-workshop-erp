"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import CustomerDialog from "./CustomerDialog";

export default function CustomerToolbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Customer
      </Button>

      {isDialogOpen && (
        <CustomerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </>
  );
}
