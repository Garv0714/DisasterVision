import { ACTIVITY_ITEMS } from "@/constants/dashboard";

export default function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-display text-base font-semibold text-ink">
        Activity Timeline
      </h3>

      <ul className="mt-4 flex flex-col gap-4">
        {ACTIVITY_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background">
                <Icon className="h-4 w-4 text-ink" />
              </span>
              <div>
                <p className="font-body text-sm text-ink">{item.label}</p>
                <p className="font-mono text-xs text-muted">
                  {item.timestamp}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}