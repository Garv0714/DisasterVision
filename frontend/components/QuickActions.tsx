import { QUICK_ACTIONS } from "@/constants/dashboard";

export default function QuickActions() {
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink">
        Quick Actions
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              className="flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-5 text-left shadow-sm hover:border-ink/20 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                <Icon className="h-5 w-5 text-ink" />
              </span>
              <span className="font-body text-sm font-semibold text-ink">
                {action.label}
              </span>
              <span className="font-body text-xs text-muted">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}