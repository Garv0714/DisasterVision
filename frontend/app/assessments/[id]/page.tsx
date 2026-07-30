"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, RotateCw } from "lucide-react";
import AssessmentDetails from "@/components/assessment/AssessmentDetails";
import EmptyState from "@/components/assessment/EmptyState";
import { fetchAssessmentById, ApiError } from "@/services/assessment";
import { Assessment } from "@/types/assessment";

export default function AssessmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await fetchAssessmentById(params.id);
      setAssessment(result);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong loading this assessment.";
      setLoadError(message);
      setAssessment(null);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await load();
      if (!isMounted) return;
    })();
    return () => {
      isMounted = false;
    };
  }, [load]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6 sm:p-8">
      <button
        type="button"
        onClick={() => router.push("/assessments")}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assessments
      </button>

      {isLoading && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-sm text-slate-400">Loading assessment...</p>
        </div>
      )}

      {!isLoading && loadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loadError}</span>
            </div>
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      )}

      {!isLoading && !loadError && !assessment && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EmptyState
            message="Assessment not found."
            subMessage="It may have been deleted or the ID is incorrect."
          />
        </div>
      )}

      {!isLoading && !loadError && assessment && (
        <AssessmentDetails assessment={assessment} />
      )}
    </div>
  );
}