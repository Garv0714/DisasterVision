import { LayoutDashboard, ClipboardList, LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "assessments",
    label: "Assessments",
    href: "/assessments",
    icon: ClipboardList,
  },
];