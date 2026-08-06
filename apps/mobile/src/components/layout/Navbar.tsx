import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <Search className="text-slate-500" size={20} />

        <input
          type="text"
          placeholder="Search customers, jobs..."
          className="
            outline-none
            bg-transparent
            text-sm
            placeholder:text-slate-400
            w-80
          "
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer text-slate-500 hover:text-blue-600 transition" />

        <div className="flex items-center gap-3">
          <UserCircle2 size={36} className="text-blue-600" />

          <div>
            <p className="font-semibold">Rizwan Ali</p>
            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}