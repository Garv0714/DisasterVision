import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  showIndicator?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  showIndicator = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-muted">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
          <Icon className="h-4 w-4 text-ink" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {showIndicator && (
          <span
            className="h-2.5 w-2.5 rounded-full bg-geo"
            aria-hidden="true"
          />
        )}
        <span className="font-display text-2xl font-semibold text-ink">
          {value}
        </span>
      </div>
    </div>
  );
}