import { RECENT_ASSESSMENTS } from "@/constants/dashboard";
import type { AssessmentStatus, SeverityLevel } from "@/types/dashboard";

const SEVERITY_STYLES: Record<SeverityLevel, string> = {
  Low: "bg-geo/10 text-geo",
  Moderate: "bg-amber-100 text-amber-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-signal/10 text-signal",
};

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  Pending: "bg-background text-muted",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-geo/10 text-geo",
};

export default function RecentAssessmentsTable() {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-semibold text-ink">
          Recent Assessments
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                ID
              </th>
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                Location
              </th>
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                Disaster Type
              </th>
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                Severity
              </th>
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                Status
              </th>
              <th className="px-5 py-3 font-body text-xs font-medium uppercase tracking-wide text-muted">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ASSESSMENTS.map((assessment) => (
              <tr
                key={assessment.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-3 font-mono text-sm text-ink">
                  {assessment.id}
                </td>
                <td className="px-5 py-3 font-body text-sm text-ink">
                  {assessment.location}
                </td>
                <td className="px-5 py-3 font-body text-sm text-muted">
                  {assessment.disasterType}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-body text-xs font-medium ${SEVERITY_STYLES[assessment.severity]}`}
                  >
                    {assessment.severity}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 font-body text-xs font-medium ${STATUS_STYLES[assessment.status]}`}
                  >
                    {assessment.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-body text-sm text-muted">
                  {assessment.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}