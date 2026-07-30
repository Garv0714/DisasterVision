import {
  Assessment,
  AssessmentFilters,
  PaginatedResult,
  PaginationState,
} from "@/types/assessment";
import { SORT_OPTIONS } from "@/constants/assessment";

export type ApiErrorKind =
  | "network"
  | "not_found"
  | "validation"
  | "server"
  | "unknown";

export class ApiError extends Error {
  status?: number;
  kind: ApiErrorKind;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new ApiError(
      "API URL is not configured. Set NEXT_PUBLIC_API_URL in your environment.",
      "unknown"
    );
  }
  return url;
}

async function parseErrorBody(response: Response): Promise<string | null> {
  try {
    const body = await response.json();
    if (typeof body?.detail === "string") return body.detail;
    if (Array.isArray(body?.detail)) {
      return body.detail
        .map((d: { msg?: string }) => d?.msg)
        .filter(Boolean)
        .join(" ");
    }
  } catch {
    // response had no JSON body — fall through to default message
  }
  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  if (response.status === 404) {
    throw new ApiError(
      "The requested assessment was not found.",
      "not_found",
      404
    );
  }

  if (response.status === 422 || response.status === 400) {
    const detail = await parseErrorBody(response);
    throw new ApiError(
      detail ?? "The submitted data was invalid. Please check the form and try again.",
      "validation",
      response.status
    );
  }

  if (response.status >= 500) {
    throw new ApiError(
      "The server encountered an error. Please try again shortly.",
      "server",
      response.status
    );
  }

  throw new ApiError(
    `Request failed with status ${response.status}.`,
    "unknown",
    response.status
  );
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      "network"
    );
  }
  return handleResponse<T>(response);
}

/**
 * Mirrors GET /assessments.
 * Search/status/sort/pagination are applied client-side on the returned
 * list since the current backend milestone doesn't document query params
 * for these — matches the exact behavior the mock layer had, so no
 * consuming component needed to change its call signature.
 */
export async function fetchAssessments(
  filters: AssessmentFilters,
  pagination: PaginationState
): Promise<PaginatedResult<Assessment>> {
  const all = await request<Assessment[]>("/assessments");

  let results = [...all];

  if (filters.search.trim()) {
    const query = filters.search.trim().toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  }

  if (filters.status !== "all") {
    results = results.filter((item) => item.status === filters.status);
  }

  const sortOption = SORT_OPTIONS.find(
    (option) => option.value === filters.sortValue
  );
  if (sortOption) {
    results = [...results].sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      if (aValue < bValue) return sortOption.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const total = results.length;
  const start = (pagination.page - 1) * pagination.pageSize;
  const paginated = results.slice(start, start + pagination.pageSize);

  return { data: paginated, total };
}

/** Mirrors GET /assessments/{id}. Returns null on 404 instead of throwing. */
export async function fetchAssessmentById(
  id: string
): Promise<Assessment | null> {
  try {
    return await request<Assessment>(`/assessments/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.kind === "not_found") {
      return null;
    }
    throw error;
  }
}

export interface CreateAssessmentPayload {
  title: string;
  description: string;
  location: string;
  disaster_type: Assessment["disaster_type"];
}

/** Mirrors POST /assessments. */
export async function createAssessment(
  data: CreateAssessmentPayload
): Promise<Assessment> {
  return request<Assessment>("/assessments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type UpdateAssessmentPayload = Partial
  CreateAssessmentPayload & { status: Assessment["status"] }
>;

/** Mirrors PATCH /assessments/{id}. Not called by any page yet — provided per spec for future Edit support. */
export async function updateAssessment(
  id: string,
  data: UpdateAssessmentPayload
): Promise<Assessment> {
  return request<Assessment>(`/assessments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/** Mirrors DELETE /assessments/{id}. */
export async function deleteAssessment(id: string): Promise<boolean> {
  await request<void>(`/assessments/${id}`, { method: "DELETE" });
  return true;
}