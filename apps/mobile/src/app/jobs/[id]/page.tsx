import AppLayout from "@/components/layout/AppLayout";
import JobDetailsClient from "@/components/jobs/JobDetailsClient";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <JobDetailsClient jobId={id} />
    </AppLayout>
  );
}
