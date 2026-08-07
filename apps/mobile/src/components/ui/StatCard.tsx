import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-orange-600" />
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}