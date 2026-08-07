import { UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
      <div className="flex items-center gap-3">
        <UserCircle2 size={36} className="text-blue-600" />
        <div>
          <p className="font-semibold">Rizwan Ali</p>
          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>
      </div>
    </header>
  );
}