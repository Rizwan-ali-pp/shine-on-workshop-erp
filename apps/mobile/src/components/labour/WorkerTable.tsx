import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { useDeleteWorker } from "@/hooks/useWorkers";
import LabourLogDialog from "./LabourLogDialog";

interface WorkerTableProps {
  data: any[];
}

export default function WorkerTable({ data }: WorkerTableProps) {
  const deleteWorker = useDeleteWorker();
  
  const [logDialogState, setLogDialogState] = useState<{
    isOpen: boolean;
    workerId: string | null;
    workerName: string;
  }>({
    isOpen: false,
    workerId: null,
    workerName: "",
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      try {
        await deleteWorker.mutateAsync(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Worker Name</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Logs</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((worker) => (
              <tr key={worker.id} className="hover:bg-slate-50 transition-colors group relative cursor-pointer">
                <td className="px-6 py-4">
                  <Link href={`/labour/${worker.id}`} className="absolute inset-0 z-0" />
                  <span className="font-semibold text-slate-900 relative z-10 pointer-events-none">{worker.name}</span>
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-none text-slate-600">
                  {worker.phone || "—"}
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-none">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                    {worker._count?.laborLogs || 0} Records
                  </span>
                </td>
                <td className="px-6 py-4 relative z-10 pointer-events-auto">
                  <div className="flex items-center justify-end gap-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setLogDialogState({ isOpen: true, workerId: worker.id, workerName: worker.name })}
                      className="text-primary border-primary/20 hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Log Labour
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(worker.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No workers found. Add your first worker to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((worker) => (
          <div
            key={worker.id}
            className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow relative"
          >
            <Link href={`/labour/${worker.id}`} className="absolute inset-0 z-0" />
            <div className="flex justify-between items-start mb-3 relative z-10 pointer-events-none">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{worker.name}</h3>
                {worker.phone && (
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1" /> {worker.phone}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                {worker._count?.laborLogs || 0} Records
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 relative z-10 pointer-events-none">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setLogDialogState({ isOpen: true, workerId: worker.id, workerName: worker.name })}
                className="text-primary border-primary/20 hover:bg-primary/5 pointer-events-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Log Labour
              </Button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(worker.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors pointer-events-auto relative z-20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No workers found. Add your first worker to get started.
          </div>
        )}
      </div>

      <LabourLogDialog 
        isOpen={logDialogState.isOpen}
        onClose={() => setLogDialogState((prev) => ({ ...prev, isOpen: false }))}
        workerId={logDialogState.workerId}
        workerName={logDialogState.workerName}
      />
    </>
  );
}
