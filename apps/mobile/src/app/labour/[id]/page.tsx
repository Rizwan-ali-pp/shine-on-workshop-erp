import AppLayout from "@/components/layout/AppLayout";
import WorkerDetailsClient from "@/components/labour/WorkerDetailsClient";

export const metadata = {
  title: "Worker Ledger - ShineTrack ERP",
};

export default async function WorkerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <WorkerDetailsClient workerId={id} />
    </AppLayout>
  );
}
