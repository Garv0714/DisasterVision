import { ImageIcon, FileText, BarChart3, MapPin, Clock } from "lucide-react";
import { Assessment } from "@/types/assessment";
import { DISASTER_TYPE_LABEL_MAP } from "@/constants/assessment";
import AssessmentStatusBadge from "./AssessmentStatusBadge";

interface AssessmentDetailsProps {
  assessment: Assessment;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AssessmentDetails({ assessment }: AssessmentDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{assessment.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {assessment.location}
            </p>
          </div>
          <AssessmentStatusBadge status={assessment.status} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {assessment.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">ID</p>
            <p className="mt-1 font-mono text-sm text-slate-700">{assessment.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Disaster Type</p>
            <p className="mt-1 text-sm text-slate-700">
              {DISASTER_TYPE_LABEL_MAP[assessment.disaster_type]}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
            <p className="mt-1 text-sm text-slate-700">{formatDateTime(assessment.created_at)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Updated</p>
            <p className="mt-1 text-sm text-slate-700">{formatDateTime(assessment.updated_at)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Clock className="h-4 w-4 text-slate-400" />
          Timeline
        </h2>
        <div className="flex flex-col gap-4 border-l-2 border-slate-100 pl-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Assessment created</p>
            <p className="text-xs text-slate-400">{formatDateTime(assessment.created_at)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Last updated</p>
            <p className="text-xs text-slate-400">{formatDateTime(assessment.updated_at)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ImageIcon className="h-4 w-4 text-slate-400" />
            Imagery
          </h2>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
            Image upload API not available yet
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-slate-400" />
            Reports
          </h2>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
            Report generation coming in a future milestone
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            Analysis
          </h2>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
            Damage analysis coming in a future milestone
          </div>
        </div>
      </div>
    </div>
  );
}