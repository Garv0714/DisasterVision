"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AssessmentDetails from "@/components/assessment/AssessmentDetails";
import EmptyState from "@/components/assessment/EmptyState";
import { fetchAssessmentById } from "@/services/assessment.mock";
import { Assessment } from "@/types/assessment";

export default function AssessmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      const result = await fetchAssessmentById(params.id);
      if (isMounted) {
        setAssessment(result);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

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

      {!isLoading && !assessment && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EmptyState
            message="Assessment not found."
            subMessage="It may have been deleted or the ID is incorrect."
          />
        </div>
      )}

      {!isLoading && assessment && <AssessmentDetails assessment={assessment} />}
    </div>
  );
}