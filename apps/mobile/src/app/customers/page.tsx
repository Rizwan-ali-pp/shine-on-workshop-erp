import AppLayout from "@/components/layout/AppLayout";
import CustomerClient from "@/components/customers/CustomerClient";

export default function CustomersPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <CustomerClient />
      </div>
    </AppLayout>
  );
}
