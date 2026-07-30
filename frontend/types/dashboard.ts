import type { LucideIcon } from "lucide-react";

export type SeverityLevel = "Low" | "Moderate" | "High" | "Critical";
export type AssessmentStatus = "Pending" | "In Progress" | "Completed";

export interface Assessment {
  id: string;
  location: string;
  disasterType: string;
  severity: SeverityLevel;
  status: AssessmentStatus;
  date: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
  icon: LucideIcon;
}

export interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface SystemComponentStatus {
  label: string;
  online: boolean;
}