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
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-blue-100 p-3">
          <Icon
            size={28}
            className="text-blue-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}