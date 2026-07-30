import { SearchX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
}

export default function EmptyState({
  message = "No assessments found.",
  subMessage = "Try adjusting your search or filters.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-6 w-6 text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{message}</p>
        <p className="mt-1 text-xs text-slate-400">{subMessage}</p>
      </div>
    </div>
  );
}