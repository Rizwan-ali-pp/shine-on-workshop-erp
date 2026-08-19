import AppLayout from "@/components/layout/AppLayout";
import ExpenseClient from "@/components/expenses/ExpenseClient";

export const metadata = {
  title: "Accessories - ShineTrack ERP",
};

export default function ExpensesPage() {
  return (
    <AppLayout>
      <ExpenseClient />
    </AppLayout>
  );
}
