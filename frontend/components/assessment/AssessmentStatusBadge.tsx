import { AssessmentStatus } from "@/types/assessment";
import { STATUS_LABEL_MAP } from "@/constants/assessment";

interface AssessmentStatusBadgeProps {
  status: AssessmentStatus;
}

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  in_progress: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  archived: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export default function AssessmentStatusBadge({ status }: AssessmentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL_MAP[status]}
    </span>
  );
}