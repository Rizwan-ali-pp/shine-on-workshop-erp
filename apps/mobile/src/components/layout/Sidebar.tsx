"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Car,
  BriefcaseBusiness,
  Wrench,
  CreditCard,
  Receipt,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Vehicles", icon: Car, href: "/vehicles" },
  { name: "Jobs", icon: BriefcaseBusiness, href: "/jobs" },
  { name: "Services", icon: Wrench, href: "/services" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
  { name: "Expenses", icon: Receipt, href: "/expenses" },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex w-full md:w-64 md:h-screen flex-col md:flex-col bg-slate-900 text-white shrink-0">
      <div className="flex items-center justify-between border-b border-slate-800 p-4 md:p-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-orange-500">
            ShineTrack
          </h1>
          <p className="hidden md:block mt-1 text-sm text-slate-400">
            Workshop ERP
          </p>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => logout()}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-red-900/30 text-red-400"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-x-auto md:overflow-y-auto p-2 md:p-4">
        <ul className="flex md:flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="shrink-0">
                <Link
                  href={item.href}
                  className="flex w-full items-center gap-2 md:gap-3 rounded-lg px-3 md:px-4 py-2 md:py-3 transition hover:bg-slate-800"
                >
                  <Icon size={20} />
                  <span className="text-sm md:text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden md:block border-t border-slate-800 p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-red-900/30 text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}