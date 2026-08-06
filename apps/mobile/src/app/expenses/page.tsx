import AppLayout from "@/components/layout/AppLayout";
import ExpenseClient from "@/components/expenses/ExpenseClient";

export default function ExpensesPage() {
  return (
    <AppLayout>
      <ExpenseClient />
    </AppLayout>
  );
}
