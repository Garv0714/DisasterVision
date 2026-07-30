"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { AssessmentFilters } from "@/types/assessment";
import { ASSESSMENT_STATUS_OPTIONS, SORT_OPTIONS } from "@/constants/assessment";

interface AssessmentToolbarProps {
  filters: AssessmentFilters;
  onFiltersChange: (filters: AssessmentFilters) => void;
  onRefresh: () => void;
}

export default function AssessmentToolbar({
  filters,
  onFiltersChange,
  onRefresh,
}: AssessmentToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Search by title, location, or ID..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as AssessmentFilters["status"],
            })
          }
          className="rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {ASSESSMENT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.sortValue}
          onChange={(e) => onFiltersChange({ ...filters, sortValue: e.target.value })}
          className="rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleRefreshClick}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}