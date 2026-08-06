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

export const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    title: "Vehicles",
    icon: Car,
    href: "/vehicles",
  },
  {
    title: "Jobs",
    icon: BriefcaseBusiness,
    href: "/jobs",
  },
  {
    title: "Services",
    icon: Wrench,
    href: "/services",
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "/payments",
  },
  {
    title: "Expenses",
    icon: Receipt,
    href: "/expenses",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];