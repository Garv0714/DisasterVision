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