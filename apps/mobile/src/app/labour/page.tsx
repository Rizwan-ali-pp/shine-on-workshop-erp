import AppLayout from "@/components/layout/AppLayout";
import LabourClient from "@/components/labour/LabourClient";

export const metadata = {
  title: "Labour & Workers - ShineTrack ERP",
};

export default function LabourPage() {
  return (
    <AppLayout>
      <LabourClient />
    </AppLayout>
  );
}
