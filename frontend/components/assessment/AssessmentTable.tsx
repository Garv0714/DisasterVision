import { Assessment } from "@/types/assessment";
import AssessmentRow from "./AssessmentRow";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

interface AssessmentTableProps {
  assessments: Assessment[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const COLUMNS = [
  "ID",
  "Title",
  "Location",
  "Disaster Type",
  "Status",
  "Created",
  "Updated",
  "Actions",
];

export default function AssessmentTable({
  assessments,
  isLoading,
  onDelete,
}: AssessmentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              assessments.map((assessment) => (
                <AssessmentRow
                  key={assessment.id}
                  assessment={assessment}
                  onDelete={onDelete}
                />
              ))}
          </tbody>
        </table>
      </div>

      {isLoading && <LoadingSkeleton rows={6} />}

      {!isLoading && assessments.length === 0 && <EmptyState />}
    </div>
  );
}