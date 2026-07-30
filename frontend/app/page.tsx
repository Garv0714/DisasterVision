import { Activity, ClipboardList, FileText, Image as ImageIcon } from "lucide-react";

import ActivityTimeline from "@/components/ActivityTimeline";
import AppShell from "@/components/AppShell";
import QuickActions from "@/components/QuickActions";
import RecentAssessmentsTable from "@/components/RecentAssessmentsTable";
import StatCard from "@/components/StatCard";
import SystemStatusPanel from "@/components/SystemStatusPanel";
import WelcomeSection from "@/components/WelcomeSection";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <WelcomeSection />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Assessments"
            value="156"
            icon={ClipboardList}
          />
          <StatCard
            label="Images Processed"
            value="842"
            icon={ImageIcon}
          />
          <StatCard
            label="Reports Generated"
            value="218"
            icon={FileText}
          />
          <StatCard
            label="System Health"
            value="Online"
            icon={Activity}
            showIndicator
          />
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentAssessmentsTable />
          </div>

          <div className="flex flex-col gap-6">
            <SystemStatusPanel />
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </AppShell>
  );
}