import { LayoutList } from "lucide-react";

interface AssessmentHeaderProps {
  totalCount: number;
}

export default function AssessmentHeader({ totalCount }: AssessmentHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
        <LayoutList className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Assessments</h1>
        <p className="text-sm text-slate-500">
          {totalCount} {totalCount === 1 ? "assessment" : "assessments"} tracked across all disaster types.
        </p>
      </div>
    </div>
  );
}