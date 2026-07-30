import {
  Assessment,
  AssessmentFilters,
  PaginatedResult,
  PaginationState,
  SortField,
  SortDirection,
} from "@/types/assessment";
import { SIMULATED_FETCH_DELAY_MS, SORT_OPTIONS } from "@/constants/assessment";

/**
 * Mock data layer for Assessment Management.
 *
 * Function names and signatures mirror the real backend contract
 * (GET /assessments, GET /assessments/{id}, DELETE /assessments/{id})
 * so swapping this file for real `fetch` calls later requires no
 * changes to any component that consumes it.
 */

let MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "a1b2c3",
    title: "Coastal Flood Damage — Cox's Bazar",
    description: "Severe coastal flooding following cyclone landfall, affecting residential zones near the shoreline.",
    location: "Cox's Bazar, Bangladesh",
    disaster_type: "flood",
    status: "completed",
    created_at: "2026-07-02T08:15:00Z",
    updated_at: "2026-07-04T11:30:00Z",
  },
  {
    id: "d4e5f6",
    title: "Earthquake Structural Survey — Antakya",
    description: "Post-earthquake structural damage assessment across residential and commercial buildings.",
    location: "Antakya, Turkey",
    disaster_type: "earthquake",
    status: "in_progress",
    created_at: "2026-07-10T13:45:00Z",
    updated_at: "2026-07-15T09:00:00Z",
  },
  {
    id: "g7h8i9",
    title: "Wildfire Perimeter Assessment — Sonoma",
    description: "Vegetation and structure loss assessment across the northern wildfire perimeter.",
    location: "Sonoma County, USA",
    disaster_type: "wildfire",
    status: "pending",
    created_at: "2026-07-18T06:20:00Z",
    updated_at: "2026-07-18T06:20:00Z",
  },
  {
    id: "j1k2l3",
    title: "Cyclone Impact Review — Odisha Coast",
    description: "Wind and storm surge damage across coastal villages and agricultural land.",
    location: "Odisha, India",
    disaster_type: "cyclone",
    status: "completed",
    created_at: "2026-06-28T10:00:00Z",
    updated_at: "2026-07-01T15:10:00Z",
  },
  {
    id: "m4n5o6",
    title: "Landslide Debris Mapping — Wayanad",
    description: "Slope failure and debris flow assessment following heavy monsoon rainfall.",
    location: "Wayanad, India",
    disaster_type: "landslide",
    status: "in_progress",
    created_at: "2026-07-20T04:30:00Z",
    updated_at: "2026-07-22T12:00:00Z",
  },
  {
    id: "p7q8r9",
    title: "Flood Recovery Tracking — Jakarta",
    description: "Ongoing recovery tracking for flood-affected districts in northern Jakarta.",
    location: "Jakarta, Indonesia",
    disaster_type: "flood",
    status: "archived",
    created_at: "2026-05-14T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "s1t2u3",
    title: "Earthquake Damage Baseline — Kahramanmaraş",
    description: "Baseline structural damage capture for follow-up analysis.",
    location: "Kahramanmaraş, Turkey",
    disaster_type: "earthquake",
    status: "completed",
    created_at: "2026-06-10T07:00:00Z",
    updated_at: "2026-06-12T10:00:00Z",
  },
  {
    id: "v4w5x6",
    title: "Wildfire Recovery Zone — Maui",
    description: "Assessment of rebuilding zones and remaining fire risk areas.",
    location: "Maui, USA",
    disaster_type: "wildfire",
    status: "pending",
    created_at: "2026-07-25T16:00:00Z",
    updated_at: "2026-07-25T16:00:00Z",
  },
  {
    id: "y7z8a9",
    title: "Cyclone Housing Damage — Beira",
    description: "Housing stock damage assessment following category 4 cyclone landfall.",
    location: "Beira, Mozambique",
    disaster_type: "cyclone",
    status: "in_progress",
    created_at: "2026-07-05T05:30:00Z",
    updated_at: "2026-07-09T14:20:00Z",
  },
  {
    id: "b1c2d3",
    title: "Landslide Risk Review — Chittagong Hills",
    description: "Preliminary risk review for slope-adjacent settlements.",
    location: "Chittagong Hill Tracts, Bangladesh",
    disaster_type: "landslide",
    status: "archived",
    created_at: "2026-05-30T11:00:00Z",
    updated_at: "2026-06-04T08:00:00Z",
  },
  {
    id: "e4f5g6",
    title: "Flood Zone Comparison — Kerala Backwaters",
    description: "Comparative flood extent analysis across two monsoon seasons.",
    location: "Kerala, India",
    disaster_type: "flood",
    status: "pending",
    created_at: "2026-07-27T09:10:00Z",
    updated_at: "2026-07-27T09:10:00Z",
  },
  {
    id: "h7i8j9",
    title: "Wildfire Damage Report — Alberta",
    description: "Boreal forest and structure loss assessment across affected townships.",
    location: "Alberta, Canada",
    disaster_type: "wildfire",
    status: "completed",
    created_at: "2026-06-20T13:00:00Z",
    updated_at: "2026-06-25T17:45:00Z",
  },
];

function delay<T>(value: T, ms: number = SIMULATED_FETCH_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function applySort(
  items: Assessment[],
  field: SortField,
  direction: SortDirection
): Assessment[] {
  const sorted = [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

/**
 * Mirrors: GET /assessments?search=&status=&sort=&page=&pageSize=
 */
export async function fetchAssessments(
  filters: AssessmentFilters,
  pagination: PaginationState
): Promise<PaginatedResult<Assessment>> {
  let results = [...MOCK_ASSESSMENTS];

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

  const sortOption = SORT_OPTIONS.find((option) => option.value === filters.sortValue);
  if (sortOption) {
    results = applySort(results, sortOption.field, sortOption.direction);
  }

  const total = results.length;
  const start = (pagination.page - 1) * pagination.pageSize;
  const paginated = results.slice(start, start + pagination.pageSize);

  return delay({ data: paginated, total });
}

/**
 * Mirrors: GET /assessments/{id}
 */
export async function fetchAssessmentById(id: string): Promise<Assessment | null> {
  const found = MOCK_ASSESSMENTS.find((item) => item.id === id) ?? null;
  return delay(found);
}

/**
 * Mirrors: DELETE /assessments/{id}
 * Mutates the in-memory mock list only — no persistence, no backend call.
 */
export async function deleteAssessmentById(id: string): Promise<boolean> {
  const existed = MOCK_ASSESSMENTS.some((item) => item.id === id);
  MOCK_ASSESSMENTS = MOCK_ASSESSMENTS.filter((item) => item.id !== id);
  return delay(existed);
}