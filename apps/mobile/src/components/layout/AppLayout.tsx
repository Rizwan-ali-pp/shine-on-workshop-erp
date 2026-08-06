import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <section className="flex-1 overflow-y-auto bg-slate-100 p-8">
          {children}
        </section>
      </div>
    </main>
  );
}