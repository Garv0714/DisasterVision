import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Assessments", icon: ClipboardList },
  { label: "Analysis", icon: BarChart3 },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];