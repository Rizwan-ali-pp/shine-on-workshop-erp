import {
  LayoutDashboard,
  Users,
  Car,
  BriefcaseBusiness,
  Wrench,
  CreditCard,
  Receipt,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Customers", icon: Users },
  { name: "Vehicles", icon: Car },
  { name: "Jobs", icon: BriefcaseBusiness },
  { name: "Services", icon: Wrench },
  { name: "Payments", icon: CreditCard },
  { name: "Expenses", icon: Receipt },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">
          ShineTrack
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Workshop ERP
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <button
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    hover:bg-slate-800
                    transition
                  "
                >
                  <Icon size={20} />

                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}