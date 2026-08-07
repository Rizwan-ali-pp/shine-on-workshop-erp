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
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-blue-400">
          ShineTrack
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Workshop ERP
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-800"
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 p-4">
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