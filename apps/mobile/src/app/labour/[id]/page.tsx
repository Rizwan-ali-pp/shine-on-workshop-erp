import AppLayout from "@/components/layout/AppLayout";
import WorkerDetailsClient from "@/components/labour/WorkerDetailsClient";

export const metadata = {
  title: "Worker Ledger - ShineTrack ERP",
};

export default function WorkerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <WorkerDetailsClient workerId={params.id} />
    </AppLayout>
  );
}
