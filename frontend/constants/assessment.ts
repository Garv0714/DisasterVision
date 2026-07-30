import { DisasterType } from "@/types/assessment";

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