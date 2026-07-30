import { AssessmentStatus, DisasterType, SortOption } from "@/types/assessment";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const DISASTER_TYPE_OPTIONS: { value: DisasterType; label: string }[] = [
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "wildfire", label: "Wildfire" },
  { value: "cyclone", label: "Cyclone" },
  { value: "landslide", label: "Landslide" },
  { value: "other", label: "Other" },
];

export const SIMULATED_ANALYSIS_DELAY_MS = 2000;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, JPEG, or PNG files are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "File size must not exceed 20MB.",
    };
  }

  return { valid: true };
}

export const ASSESSMENT_STATUS_OPTIONS: {
  value: AssessmentStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export const SORT_OPTIONS: SortOption[] = [
  { value: "created_desc", label: "Newest First", field: "created_at", direction: "desc" },
  { value: "created_asc", label: "Oldest First", field: "created_at", direction: "asc" },
  { value: "updated_desc", label: "Recently Updated", field: "updated_at", direction: "desc" },
  { value: "title_asc", label: "Title (A-Z)", field: "title", direction: "asc" },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const DEFAULT_PAGE_SIZE = 10;

export const SIMULATED_FETCH_DELAY_MS = 600;

export const DISASTER_TYPE_LABEL_MAP: Record<DisasterType, string> =
  DISASTER_TYPE_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.label }),
    {} as Record<DisasterType, string>
  );

export const STATUS_LABEL_MAP: Record<AssessmentStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

/**
 * The Upload form doesn't collect a title, but the backend Assessment
 * model requires one. This derives a readable default. Flagged as a
 * product decision worth revisiting if a real title field is wanted.
 */
export function buildDefaultAssessmentTitle(
  disasterType: DisasterType,
  location: string
): string {
  return `${DISASTER_TYPE_LABEL_MAP[disasterType]} Assessment — ${location}`;
}