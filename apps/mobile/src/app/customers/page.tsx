import { getCustomers } from "@/services/customer.service";
import AppLayout from "@/components/layout/AppLayout";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="mb-6 text-4xl font-bold">Customers</h1>

        <div className="rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="p-4">{customer.name}</td>

                  <td className="p-4">{customer.phone}</td>

                  <td className="p-4">
                    {customer.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
