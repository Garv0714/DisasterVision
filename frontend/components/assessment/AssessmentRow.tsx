"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Assessment } from "@/types/assessment";
import { DISASTER_TYPE_LABEL_MAP } from "@/constants/assessment";
import AssessmentStatusBadge from "./AssessmentStatusBadge";

interface AssessmentRowProps {
  assessment: Assessment;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AssessmentRow({ assessment, onDelete }: AssessmentRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete assessment "${assessment.title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setIsDeleting(true);
    onDelete(assessment.id);
  };

  return (
    <tr className={`border-b border-slate-100 transition-opacity last:border-b-0 hover:bg-slate-50/60 ${isDeleting ? "opacity-40" : ""}`}>
      <td className="whitespace-nowrap px-4 py-3 text-xs font-mono text-slate-400">
        {assessment.id}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-slate-900">
        {assessment.title}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{assessment.location}</td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {DISASTER_TYPE_LABEL_MAP[assessment.disaster_type]}
      </td>
      <td className="px-4 py-3">
        <AssessmentStatusBadge status={assessment.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
        {formatDate(assessment.created_at)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
        {formatDate(assessment.updated_at)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/assessments/${assessment.id}`}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            type="button"
            title="Editing coming soon"
            disabled
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-slate-300"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}