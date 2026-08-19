"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import WorkerTable from "./WorkerTable";
import WorkerDialog from "./WorkerDialog";

export default function LabourClient() {
  const { data: workers, isLoading, isError } = useWorkers();
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Labour & Workers</h1>
          <p className="text-muted-foreground mt-1">Manage your team and track labour payments.</p>
        </div>
        <Button onClick={() => setIsWorkerDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Add Worker
        </Button>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">Failed to load workers.</div>
        ) : (
          <WorkerTable data={workers || []} />
        )}
      </div>

      <WorkerDialog isOpen={isWorkerDialogOpen} onClose={() => setIsWorkerDialogOpen(false)} />
    </div>
  );
}
