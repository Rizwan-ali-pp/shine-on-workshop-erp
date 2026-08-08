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
import Logo from "@/components/ui/Logo";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Jobs", icon: BriefcaseBusiness, href: "/jobs" },
  { name: "Services", icon: Wrench, href: "/services" },
  { name: "Payments", icon: CreditCard, href: "/payments" },
  { name: "Expenses", icon: Receipt, href: "/expenses" },
];

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const { logout } = useAuth();

  return (
    <aside className="flex w-64 h-full md:h-screen flex-col bg-black text-white shrink-0">
      <div className="flex items-center justify-center border-b border-slate-800 p-4 md:p-6 bg-black">
        <Logo className="scale-75 md:scale-100 origin-center md:origin-left" />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="shrink-0">
                <Link
                  href={item.href}
                  onClick={onLinkClick}
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