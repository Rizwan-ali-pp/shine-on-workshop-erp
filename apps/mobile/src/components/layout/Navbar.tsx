import { UserCircle2, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between md:justify-end px-4 md:px-8">
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-3">
        <UserCircle2 size={36} className="text-orange-500" />
        <div>
          <p className="font-semibold text-sm sm:text-base">Rizwan Ali</p>
          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
}