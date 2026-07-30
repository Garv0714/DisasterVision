import {
  BarChart3,
  ClipboardCheck,
  FileText,
  Settings,
  Upload,
} from "lucide-react";

import type {
  ActivityItem,
  Assessment,
  QuickAction,
  SystemComponentStatus,
} from "@/types/dashboard";

export const RECENT_ASSESSMENTS: Assessment[] = [
  {
    id: "DV-1042",
    location: "Valdosta, GA",
    disasterType: "Flood",
    severity: "High",
    status: "Completed",
    date: "2026-07-28",
  },
  {
    id: "DV-1041",
    location: "Marikina, PH",
    disasterType: "Typhoon",
    severity: "Critical",
    status: "In Progress",
    date: "2026-07-27",
  },
  {
    id: "DV-1040",
    location: "Antalya, TR",
    disasterType: "Wildfire",
    severity: "Moderate",
    status: "Completed",
    date: "2026-07-25",
  },
  {
    id: "DV-1039",
    location: "Christchurch, NZ",
    disasterType: "Earthquake",
    severity: "High",
    status: "Pending",
    date: "2026-07-24",
  },
  {
    id: "DV-1038",
    location: "Jakarta, ID",
    disasterType: "Flood",
    severity: "Low",
    status: "Completed",
    date: "2026-07-22",
  },
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "1",
    label: "Report generated for DV-1042",
    timestamp: "2 hours ago",
    icon: FileText,
  },
  {
    id: "2",
    label: "Analysis completed for DV-1041",
    timestamp: "5 hours ago",
    icon: BarChart3,
  },
  {
    id: "3",
    label: "Image uploaded for DV-1040",
    timestamp: "Yesterday",
    icon: Upload,
  },
  {
    id: "4",
    label: "Assessment started for DV-1039",
    timestamp: "Yesterday",
    icon: ClipboardCheck,
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Upload Assessment",
    description: "Add before and after imagery",
    icon: Upload,
  },
  {
    label: "View Reports",
    description: "Browse generated reports",
    icon: FileText,
  },
  {
    label: "Start Analysis",
    description: "Run a new damage comparison",
    icon: BarChart3,
  },
  {
    label: "Settings",
    description: "Manage platform preferences",
    icon: Settings,
  },
];

export const SYSTEM_COMPONENTS: SystemComponentStatus[] = [
  { label: "Frontend", online: true },
  { label: "API", online: true },
  { label: "ML Engine", online: true },
  { label: "Database", online: true },
];