"use client";

import { useEffect, useState, useCallback } from "react";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentToolbar from "@/components/assessment/AssessmentToolbar";
import AssessmentTable from "@/components/assessment/AssessmentTable";
import AssessmentPagination from "@/components/assessment/AssessmentPagination";
import { fetchAssessments, deleteAssessmentById } from "@/services/assessment.mock";
import { Assessment, AssessmentFilters, PaginationState } from "@/types/assessment";
import { DEFAULT_PAGE_SIZE } from "@/constants/assessment";

const INITIAL_FILTERS: AssessmentFilters = {
  search: "",
  status: "all",
  sortValue: "created_desc",
};

const INITIAL_PAGINATION: PaginationState = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AssessmentFilters>(INITIAL_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>(INITIAL_PAGINATION);

  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchAssessments(filters, pagination);
    setAssessments(result.data);
    setTotal(result.total);
    setIsLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const handleFiltersChange = (nextFilters: AssessmentFilters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const handleDelete = async (id: string) => {
    await deleteAssessmentById(id);
    await loadAssessments();
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 sm:p-8">
      <AssessmentHeader totalCount={total} />

      <AssessmentToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={loadAssessments}
      />

      <div className="flex flex-col gap-3">
        <AssessmentTable
          assessments={assessments}
          isLoading={isLoading}
          onDelete={handleDelete}
        />

        {!isLoading && total > 0 && (
          <AssessmentPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}