export type DisasterType =
  | "flood"
  | "earthquake"
  | "wildfire"
  | "cyclone"
  | "landslide"
  | "other";

export type ImageSlot = "before" | "after";

export interface UploadedImage {
  file: File;
  previewUrl: string;
}

export interface AssessmentFormData {
  location: string;
  disasterType: DisasterType | "";
  description: string;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface FormErrors {
  location?: string;
  disasterType?: string;
  description?: string;
  beforeImage?: string;
  afterImage?: string;
}

/* ---------------------------------------------------------------------- */
/* Milestone 4 — Assessment Management additions                          */
/* ---------------------------------------------------------------------- */

export type AssessmentStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "archived";

// Mirrors the backend Assessment model exactly (POST/GET /assessments)
export interface Assessment {
  id: string;
  title: string;
  description: string;
  location: string;
  disaster_type: DisasterType;
  status: AssessmentStatus;
  created_at: string;
  updated_at: string;
}

export type SortField = "created_at" | "updated_at" | "title" | "status";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  value: string;
  label: string;
  field: SortField;
  direction: SortDirection;
}

export interface AssessmentFilters {
  search: string;
  status: AssessmentStatus | "all";
  sortValue: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}